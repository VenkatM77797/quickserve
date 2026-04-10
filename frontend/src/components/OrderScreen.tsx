import { useEffect, useState } from "react";
import Menu from "./Menu";
import Cart from "./Cart";
import Bill from "./Bill";

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

  // Adding item
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

  // Remove item
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

  // Total
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const generateBill = () => {
    if (cart.length === 0) {
      showToast("Cart is empty!");
      return;
    }
    setBillGenerated(true);
    showToast("Bill generated");
  };

  // Occupy table
  const occupyTable = async () => {
    await fetch(`${API}/tables/${selectedTable.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "OCCUPIED" }),
    });
    selectedTable.status = "OCCUPIED";
    showToast("Table occupied");
  };

  // Table available
  const freeTable = async () => {
    await fetch(`${API}/tables/${selectedTable.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "AVAILABLE" }),
    });
    selectedTable.status = "AVAILABLE";
    showToast("Table is Available");
  };

  // Place order
  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast("Cart is empty!");
      return;
    }
    try {
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
    } catch {
      showToast("Order failed");
    }
  };

  // Payment
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
    setBillGenerated(false); // resetting bill
    setTimeout(() => goBack(), 2000);
  };

  return (
    <div
      style={{
        padding: 20,
        background: "#e5eaf5",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Back */}
      <button
        onClick={goBack}
        style={{
          display: "flex",
          marginBottom: 15,
          padding: "08px 14px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#d0bdf4",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
        Back
      </button>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#8458B3" }}>
          {selectedTable
            ? `Table ${selectedTable.tableNumber}`
            : "Take-out"}
        </h2>

        {selectedTable &&
          (selectedTable.status === "AVAILABLE" ? (
            <button
              onClick={occupyTable}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#a0d2eb",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
              Occupy
            </button>
          ) : (
            <button
              onClick={freeTable}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#a28089",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
              Free
            </button>
          ))}
      </div>

      {/* Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 20,
          marginTop: 20,
        }}>
        <Menu categories={categories} addItem={addItem} />

        <div>
          <Cart
            cart={cart}
            removeItem={removeItem}
            total={total}
            clearCart={clearCart}
            placeOrder={placeOrder}
          />

          {/* Generate Bill btn */}
          <button
            onClick={generateBill}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#8458B3",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 8px rgba(5, 0, 0, 0.3)",
            }}>
            Generate Bill
          </button>

          {/* Bill UI */}
          {billGenerated && (
            <Bill
              cart={cart}
              total={total}
              selectedTable={selectedTable}
            />
          )}

          {/* Pay Button */}
          {currentOrder && (
            <button
              onClick={payNow}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "#a0d2eb",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}>
              Pay Now
            </button>
          )}

          {/* Paid status */}
          {currentOrder?.status === "COMPLETED" && (
            <p style={{ color: "green", marginTop: 10 }}>
              Paid
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderScreen;