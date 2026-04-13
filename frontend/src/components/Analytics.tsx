import { useEffect, useState } from "react";
import "./css/Analytics.css";

const API = "http://localhost:3000";

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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API}/analytics`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to load analytics", error);
    }
  };

  if (!data) {
    return <p>Loading analytics...</p>;
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
      </div>
    </div>
  );
}

export default Analytics;