import { useEffect, useState } from "react";

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
    <div
      style={{
        padding: 20,
        background: "#e5eaf5",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}>
      {/*Back button */}
      <button
        onClick={() => setScreen("dashboard")}
        style={{
          display: "flex",
          top: 20,
          left: 20,
          padding: "8px 14px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#d0bdf4",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
        Back
      </button>

      {/* Title */}
      <h1
        style={{
          color: "#8458B3",
          marginBottom: 20,
        }}>
        Tables
      </h1>

      {/*layout for tables */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(140px,1fr))",
          gap: 15,
        }}>
        {tables.map((t) => (
          <div
            key={t.id}
            onClick={() => {
              setSelectedTable(t);
              setScreen("order");
            }}
            style={{
              background:
                t.status === "AVAILABLE"
                  ? "#a0d2eb"
                : "#a28089",
              color: "#333",
              borderRadius: 12,
              padding: 15,
              cursor: "pointer",
              textAlign: "center",
              transition: "0.3s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}>
            {/* Table number */}
            <div style={{ fontWeight: "bold" }}>
              Table {t.tableNumber}
            </div>

            {/* Capacity */}
            <div>👥 {t.capacity}</div>

            {/* Status */}
            <div
              style={{
                marginTop: 5,
                fontSize: 14,
                fontFamily: "sans-serif",
              }}>
              {t.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableList;