import { useEffect, useState } from "react";
import "./css/TableList.css";

const API = "http://localhost:3000";

function TableList({ setScreen, setSelectedTable }: any) {
  const [tables, setTables] = useState<any[]>([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const res = await fetch(`${API}/tables`);
    setTables(await res.json());
  };

  return (
    <div className="table-container">
      
      {/* Back button */}
      <button
        onClick={() => setScreen("dashboard")}
        className="back-btn"
      >
        Back
      </button>

      {/* Title */}
      <h1 className="table-title">Tables</h1>

      {/* Grid */}
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
            {/* Table number */}
            <div className="table-number">
              Table {t.tableNumber}
            </div>

            {/* Capacity */}
            <div>👥 {t.capacity}</div>

            {/* Status */}
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