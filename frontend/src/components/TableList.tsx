import { useEffect, useState } from "react";
import "./css/TableList.css";

const API = import.meta.env.VITE_API_URL;

function TableList({ setScreen, setSelectedTable }: any) {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/tables`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load tables");
      }

      const data = await res.json();
      setTables(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch tables", error);
      setTables([]);
    }
  };

  return (
    <div className="table-container">
      <button
        onClick={() => setScreen("dashboard")}
        className="back-btn"
      >
        Back
      </button>

      <h1 className="table-title">Tables</h1>

      <div className="table-grid">
        {tables.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              setSelectedTable(t);
              setScreen("order");
            }}
            className={`table-card ${
              t.status === "AVAILABLE"
                ? "table-available"
                : "table-occupied"
            }`}
          >
            <div className="table-number">
              Table {t.tableNumber}
            </div>

            <div>👥 {t.capacity}</div>

            <div className="table-status">
              {t.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableList;