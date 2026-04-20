import { useEffect, useState } from "react";
import Menu from "./Menu";
import Cart from "./Cart";
import Bill from "./Bill";
import "./css/OrderScreen.css";

const API = import.meta.env.VITE_API_URL;

type Props = {
  selectedTable: any;
  setSelectedTable: React.Dispatch<React.SetStateAction<any>>;
  goBack: () => void;
  showToast: (msg: string) => void;
};

function OrderScreen({
  selectedTable,
  setSelectedTable,
  goBack,
  showToast,
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [billGenerated, setBillGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    fetchCategories();

    if (selectedTable && !currentOrder) {
      fetchExistingOrder();
    }
  }, [selectedTable]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API}/categories`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      showToast("Failed to load categories");
    }
  };

  const fetchExistingOrder = async () => {
    try {
      if (!selectedTable) return;

      const res = await fetch(`${API}/orders/table/${selectedTable.id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        return;
      }

      const data = await res.json();
      const order = Array.isArray(data) ? data[0] : data;

      if (!order) return;

      setCurrentOrder(order);

      const cartItems = (order.items || []).map((item: any) => ({
        id: item.menuItem.id,
        name: item.menuItem.name,
        price: Number(item.unitPrice),
        qty: item.quantity,
      }));

      setCart(cartItems);
    } catch (error) {
      console.error("Failed to fetch existing order", error);
    }
  };

  const addItem = (item: any) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (id: string) => {
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const generateBill = () => {
    if (cart.length === 0) {
      showToast("Cart is empty!");
      return;
    }

    setBillGenerated(true);
    showToast("Bill generated");
  };

  const occupyTable = async () => {
    try {
      if (!selectedTable) return;

      const res = await fetch(`${API}/tables/${selectedTable.id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "OCCUPIED" }),
      });

      if (!res.ok) {
        throw new Error("Failed to occupy table");
      }

      setSelectedTable((prev: any) =>
        prev ? { ...prev, status: "OCCUPIED" } : prev
      );

      showToast("Table occupied");
    } catch (error) {
      console.error(error);
      showToast("Failed to occupy table");
    }
  };

  const freeTable = async () => {
    try {
      if (!selectedTable) return;

      const res = await fetch(`${API}/tables/${selectedTable.id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: "AVAILABLE" }),
      });

      if (!res.ok) {
        throw new Error("Failed to free table");
      }

      setSelectedTable((prev: any) =>
        prev ? { ...prev, status: "AVAILABLE" } : prev
      );

      showToast("Table is available");
    } catch (error) {
      console.error(error);
      showToast("Failed to free table");
    }
  };

  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        showToast("Cart is empty!");
        return;
      }

      setLoading(true);

      let order = currentOrder;

      if (!order) {
        const res = await fetch(`${API}/orders`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(
            selectedTable?.id ? { tableId: selectedTable.id } : {}
          ),
        });

        if (!res.ok) {
          throw new Error("Failed to create order");
        }

        order = await res.json();
        setCurrentOrder(order);
      }

      await fetch(`${API}/orders/${order.id}/items`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      for (const item of cart) {
        const itemRes = await fetch(`${API}/orders/items`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            orderId: order.id,
            menuItemId: item.id,
            quantity: item.qty,
          }),
        });

        if (!itemRes.ok) {
          throw new Error("Failed to add order items");
        }
      }

      await fetchExistingOrder();
      showToast("Order placed!");
    } catch (error) {
      console.error(error);
      showToast("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const payNow = async () => {
    try {
      if (!currentOrder) {
        showToast("No active order found");
        return;
      }

      setLoading(true);

      const paymentRes = await fetch(`${API}/payments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          orderId: currentOrder.id,
          method: "CASH",
        }),
      });

      if (!paymentRes.ok) {
        throw new Error("Payment failed");
      }

      const completeRes = await fetch(
        `${API}/orders/${currentOrder.id}/complete`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!completeRes.ok) {
        throw new Error("Failed to complete order");
      }

      const updatedOrder = await completeRes.json();
      setCurrentOrder(updatedOrder);

      if (selectedTable) {
        setSelectedTable((prev: any) =>
          prev ? { ...prev, status: "AVAILABLE" } : prev
        );
      }

      setCart([]);
      setBillGenerated(false);
      showToast("Payment done");

      setTimeout(() => {
        goBack();
      }, 2000);
    } catch (error) {
      console.error(error);
      showToast("Payment update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-container">
      <button onClick={goBack} className="back-btn">
        Back
      </button>

      <div className="order-header">
        <h2 className="order-title">
          {selectedTable ? `Table ${selectedTable.tableNumber}` : "Take-out"}
        </h2>

        {selectedTable &&
          (selectedTable.status === "AVAILABLE" ? (
            <button
              onClick={occupyTable}
              className="btn btn-occupy"
              disabled={loading}
            >
              Occupy
            </button>
          ) : (
            <button
              onClick={freeTable}
              className="btn btn-free"
              disabled={loading}
            >
              Free
            </button>
          ))}
      </div>

      <div className="layout">
        <Menu categories={categories} addItem={addItem} />

        <div>
          <Cart
            cart={cart}
            removeItem={removeItem}
            total={total}
            clearCart={clearCart}
            placeOrder={placeOrder}
          />

          <button
            onClick={generateBill}
            className="generate-btn"
            disabled={loading}
          >
            Generate Bill
          </button>

          {billGenerated && (
            <Bill cart={cart} total={total} selectedTable={selectedTable} />
          )}

          {currentOrder && currentOrder.status !== "COMPLETED" && (
            <button onClick={payNow} className="pay-btn" disabled={loading}>
              {loading ? "Processing..." : "Pay Now"}
            </button>
          )}

          {currentOrder?.status === "COMPLETED" && (
            <p className="paid-text">Paid</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;