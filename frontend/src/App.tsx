import { useState } from "react";
import Dashboard from "./components/Dashboard";
import TableList from "./components/TableList";
import OrderScreen from "./components/OrderScreen";

type CartItem = {
  id: number;
  name: string;
  price: number;
  qty: number;
};

type Table = {
  id: number;
  name: string;
};

function App() {
  const [screen, setScreen] = useState("dashboard");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<any>(null);

  const [toast, setToast] = useState("");
  const [billGenerated, setBillGenerated] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const generateBill = () => {
    if (!cart || cart.length === 0) {
      showToast("No items to generate bill");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const newOrder = {
      table: selectedTable,
      items: cart,
      total,
      time: new Date().toLocaleString(),
    };

    setOrder(newOrder);
    setBillGenerated(true);
    showToast("Bill generated");
  };

  return (
    <>
      {/* DASHBOARD */}
      {screen === "dashboard" && <Dashboard setScreen={setScreen} />}

      {/* TABLE LIST */}
      {screen === "tables" && (
        <TableList
          setScreen={setScreen}
          setSelectedTable={setSelectedTable}
        />
      )}

      {/* TAKEOUT */}
      {screen === "takeout" && (
        <OrderScreen
          selectedTable={null}
          goBack={() => setScreen("dashboard")}
          showToast={showToast}
          cart={cart}
          setCart={setCart}
          generateBill={generateBill}
          billGenerated={billGenerated}
          order={order}
        />
      )}

      {/* DINE-IN ORDER */}
      {screen === "order" && (
        <OrderScreen
          selectedTable={selectedTable}
          goBack={() => setScreen("tables")}
          showToast={showToast}
          cart={cart}
          setCart={setCart}
          generateBill={generateBill}
          billGenerated={billGenerated}
          order={order}
        />
      )}

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#111",
            color: "white",
            padding: "12px 18px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {toast}
        </div>
      )}
    </>
  );
}

export default App;