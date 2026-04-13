import { useEffect, useState } from "react";
import "./css/OrderHistory.css";

const API = "http://localhost:3000";

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

  const fetchHistory = async () => {
    const params = new URLSearchParams();

    if (date) params.append("date", date);
    if (type) params.append("type", type);
    if (status) params.append("status", status);

    const res = await fetch(`${API}/orders/history?${params.toString()}`);
    const data = await res.json();
    setOrders(data);
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
          className="history-input"/>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="history-input">
          <option value="">All Types</option>
          <option value="DINE_IN">Dine-in</option>
          <option value="TAKEAWAY">Take-out</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="history-input">
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <button className="history-filter-btn" onClick={fetchHistory}>
          Apply Filters
        </button>
      </div>

      <div className="history-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + Number(item.lineTotal),
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
                  <strong>Table:</strong>{" "}
                  {order.table?.tableNumber ?? "Takeout"}
                </p>

                <div className="history-items">
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.menuItem.name} x {item.quantity} --- ₹
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
    </div>
  );
}

export default OrderHistory;