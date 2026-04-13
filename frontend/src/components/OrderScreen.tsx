import { useEffect, useState } from "react";
import Menu from "./Menu";
import Cart from "./Cart";
import Bill from "./Bill";
import "./css/OrderScreen.css";

const API = "http://localhost:3000";

function OrderScreen({ selectedTable, goBack, showToast }: any) {
  const [categories, setCategories] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [billGenerated, setBillGenerated] = useState(false);

  useEffect(() => {
    fetchCategories();

    if (selectedTable && !currentOrder) {
      fetchExistingOrder();
    }
  }, [selectedTable]);

  const fetchCategories = async () => {
    const res = await fetch(`${API}/categories`);
    setCategories(await res.json());
  };

  const fetchExistingOrder = async () => {
    const res = await fetch(`${API}/orders/table/${selectedTable.id}`);
    const data = await res.json();
    const order = Array.isArray(data) ? data[0] : data;
    if (!order) return;
    setCurrentOrder(order);

    const cartItems = order.items.map((item: any) => ({
      id: item.menuItem.id,
      name: item.menuItem.name,
      price: Number(item.unitPrice),
      qty: item.quantity,
    }));

    setCart(cartItems);
  };

  const addItem = (item: any) => {
    const existing = cart.find((i) => i.id === item.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeItem = (id: string) => {
    setCart(
      cart
        .map((i) =>
          i.id === id ? { ...i, qty: i.qty - 1 } : i
        )
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
    await fetch(`${API}/tables/${selectedTable.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "OCCUPIED" }),
    });
    selectedTable.status = "OCCUPIED";
    showToast("Table occupied");
  };

  const freeTable = async () => {
    await fetch(`${API}/tables/${selectedTable.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "AVAILABLE" }),
    });
    selectedTable.status = "AVAILABLE";
    showToast("Table is Available");
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast("Cart is empty!");
      return;
    }

    const res = await fetch(`${API}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        selectedTable?.id
          ? { tableId: selectedTable.id }
          : {}
      ),
    });

    const order = await res.json();
    setCurrentOrder(order);

    for (const item of cart) {
      await fetch(`${API}/orders/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          menuItemId: item.id,
          quantity: item.qty,
        }),
      });
    }

    showToast("Order placed!");
  };

  const payNow = async () => {
    if (!currentOrder) return;

    await fetch(`${API}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: currentOrder.id,
        method: "CASH",
      }),
    });

    showToast("Payment done");
    setCart([]);
    setBillGenerated(false);
    setTimeout(() => goBack(), 2000);
  };

  return (
    <div className="order-container">
      
      <button onClick={goBack} className="back-btn">
        Back
      </button>

      <div className="order-header">
        <h2 className="order-title">
          {selectedTable
            ? `Table ${selectedTable.tableNumber}`
            : "Take-out"}
        </h2>

        {selectedTable &&
          (selectedTable.status === "AVAILABLE" ? (
            <button onClick={occupyTable} className="btn btn-occupy">
              Occupy
            </button>
          ) : (
            <button onClick={freeTable} className="btn btn-free">
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
            placeOrder={placeOrder}/>

          <button onClick={generateBill} className="generate-btn">
            Generate Bill
          </button>

          {billGenerated && (
            <Bill
              cart={cart}
              total={total}
              selectedTable={selectedTable}/>
          )}

          {currentOrder && (
            <button onClick={payNow} className="pay-btn">
              Pay Now
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