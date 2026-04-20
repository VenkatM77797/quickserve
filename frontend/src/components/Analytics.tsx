import { useEffect, useState } from "react";
import "./css/Analytics.css";

const API = import.meta.env.VITE_API_URL;

type TopItem = {
  name: string;
  quantity: number;
  revenue: number;
};

type AnalyticsData = {
  totalSales: number;
  totalOrders: number;
  dineInCount: number;
  takeoutCount: number;
  topItems: TopItem[];
};

type Props = {
  goBack: () => void;
};

function Analytics({ goBack }: Props) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/analytics`, {
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
        throw new Error("You are not authorized to view analytics");
      }

      if (!res.ok) {
        throw new Error(`Failed to load analytics: ${res.status} ${text}`);
      }

      const result = JSON.parse(text);

      setData({
        totalSales: result.totalSales ?? 0,
        totalOrders: result.totalOrders ?? 0,
        dineInCount: result.dineInCount ?? 0,
        takeoutCount: result.takeoutCount ?? 0,
        topItems: Array.isArray(result.topItems) ? result.topItems : [],
      });
    } catch (error: any) {
      console.error("Failed to load analytics", error);
      setError(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-container">
        <button className="back-btn" onClick={goBack}>
          Back
        </button>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container">
        <button className="back-btn" onClick={goBack}>
          Back
        </button>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="analytics-container">
        <button className="back-btn" onClick={goBack}>
          Back
        </button>
        <p>No analytics data available.</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      <button className="back-btn" onClick={goBack}>
        Back
      </button>

      <h2 className="analytics-title">Analytics Dashboard</h2>

      <div className="analytics-cards">
        <div className="card">
          <h3>Total Sales</h3>
          <p>₹{data.totalSales}</p>
        </div>

        <div className="card">
          <h3>Total Orders</h3>
          <p>{data.totalOrders}</p>
        </div>

        <div className="card">
          <h3>Dine-in Orders</h3>
          <p>{data.dineInCount}</p>
        </div>

        <div className="card">
          <h3>Take-out Orders</h3>
          <p>{data.takeoutCount}</p>
        </div>
      </div>

      <div className="table-container">
        <h3 className="analytics-title">Top Selling Items</h3>

        {data.topItems.length === 0 ? (
          <p>No top selling items found.</p>
        ) : (
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.topItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Analytics;