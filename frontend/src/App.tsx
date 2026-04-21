import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import TableList from "./components/TableList";
import OrderScreen from "./components/OrderScreen";
import Analytics from "./components/Analytics";
import OrderHistory from "./components/OrderHistory";
import Login from "./components/Login";
import CreateManager from "./components/CreateManager";
import CreateEmployee from "./components/CreateEmployee";
import UserList from "./components/UserList";

const API = import.meta.env.VITE_API_URL;

type Screen =
  | "dashboard"
  | "tables"
  | "takeout"
  | "order"
  | "analytics"
  | "history"
  | "create-manager"
  | "createEmployee"
  | "users";

type User = {
  id: string;
  name: string;
  email: string;
  role: 1 | 2;
};

function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [toast, setToast] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${API}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Invalid token");
        }

        const data = await res.json();
        setUser({
          ...data,
          role: Number(data.role),
        });
      } catch (err) {
        console.log("Auth error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const isManager = user?.role === 1;

  const managerOnlyScreens: Screen[] = [
    "analytics",
    "history",
    "create-manager",
    "createEmployee",
    "users",
  ];

  const canAccessScreen = (target: Screen) => {
    if (!user) return false;

    if (managerOnlyScreens.includes(target) && !isManager) {
      return false;
    }

    return true;
  };

  const safeSetScreen = (target: Screen) => {
    if (canAccessScreen(target)) {
      setScreen(target);
    } else {
      showToast("Access denied");
      setScreen("dashboard");
    }
  };

  useEffect(() => {
    if (!user) return;

    if (!canAccessScreen(screen)) {
      setScreen("dashboard");
    }
  }, [screen, user]);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser({
      ...loggedInUser,
      role: Number(loggedInUser.role) as 1 | 2,
    });
    setScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setScreen("dashboard");
    setSelectedTable(null);
  };

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-shell">
      {toast && <div className="app-toast">{toast}</div>}

      {screen === "dashboard" && (
        <Dashboard
          setScreen={safeSetScreen}
          userRole={user.role}
          userName={user.name}
          onLogout={handleLogout}
        />
      )}

      {screen === "tables" && (
        <TableList
          setScreen={safeSetScreen}
          setSelectedTable={setSelectedTable}
        />
      )}

      {screen === "order" && (
        <OrderScreen
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          goBack={() => setScreen("tables")}
          showToast={showToast}
        />
      )}

      {screen === "takeout" && (
        <OrderScreen
          selectedTable={null}
          setSelectedTable={setSelectedTable}
          goBack={() => setScreen("dashboard")}
          showToast={showToast}
        />
      )}

      {screen === "analytics" && user.role === 1 && (
        <Analytics goBack={() => setScreen("dashboard")} />
      )}

      {screen === "history" && user.role === 1 && (
        <OrderHistory goBack={() => setScreen("dashboard")} />
      )}

      {screen === "create-manager" && user.role === 1 && (
        <CreateManager goBack={() => setScreen("dashboard")} />
      )}

      {screen === "createEmployee" && user.role === 1 && (
        <CreateEmployee goBack={() => setScreen("dashboard")} />
      )}

      {screen === "users" && user.role === 1 && (
        <UserList
          goBack={() => setScreen("dashboard")}
          showToast={showToast}
        />
      )}
    </div>
  );
}

export default App;