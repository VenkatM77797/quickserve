import { useEffect, useState } from "react";
import "./css/OrderHistory.css";

const API = import.meta.env.VITE_API_URL;

type OrderItem = {
  id: string;
  quantity: number;
  lineTotal: number;
  menuItem: {
    name: string;
  };
};

type Order = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  table?: {
    tableNumber?: number;
  } | null;
  items: OrderItem[];
};

type Props = {
  goBack: () => void;
};

function OrderHistory({ goBack }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (date) params.append("date", date);
      if (type) params.append("type", type);
      if (status) params.append("status", status);

      const url = `${API}/orders/history${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await res.text();

      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        return;
      }

      if (res.status === 403) {
        throw new Error("You are not authorized to view order history");
      }

      if (!res.ok) {
        throw new Error(`Failed to load order history: ${res.status} ${text}`);
      }

      const data = JSON.parse(text);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to load order history", err);
      setError(err.message || "Failed to load order history");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <button className="history-back-btn" onClick={goBack}>
        Back
      </button>

      <h2 className="history-title">Order History</h2>

      <div className="history-filters">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="history-input"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="history-input"
        >
          <option value="">All Types</option>
          <option value="DINE_IN">Dine-in</option>
          <option value="TAKEAWAY">Take-out</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="history-input"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button className="history-filter-btn" onClick={fetchHistory}>
          Apply Filters
        </button>
      </div>

      {loading && <p>Loading order history...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="history-list">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => {
              const total = (order.items || []).reduce(
                (sum, item) => sum + Number(item.lineTotal || 0),
                0
              );

              return (
                <div key={order.id} className="history-card">
                  <div className="history-card-header">
                    <h3>Order ID: {order.id}</h3>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>

                  <p>
                    <strong>Type:</strong> {order.type}
                  </p>

                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>

                  <p>
                    <strong>Table:</strong> {order.table?.tableNumber ?? "Takeout"}
                  </p>

                  <div className="history-items">
                    <strong>Items:</strong>
                    <ul>
                      {(order.items || []).map((item) => (
                        <li key={item.id}>
                          {item.menuItem?.name ?? "Unknown Item"} x {item.quantity} --- ₹
                          {item.lineTotal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="history-total">
                    <strong>Total:</strong> ₹{total}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
export default OrderHistory;