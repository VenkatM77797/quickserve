function Dashboard({ setScreen }: any) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #8458B3, #a0d2eb)",
        color: "white",
      }}>
      {/* Title */}
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: 30,
        }}>
        Welcome to QuickServe
      </h1>

      {/* Button container */}
      <div
        style={{
          display: "flex",
          gap: 20,
        }}>

        <button
          onClick={() => setScreen("tables")}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#a0d2eb", 
            color: "#333",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}>
          Dine-In
        </button>

        <button
          onClick={() => setScreen("takeout")}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            backgroundColor: "#d0bdf4",
            border: "none",
            color: "#333",
            fontSize: 16,
            cursor: "pointer",
            transition: "0.3s",
            fontWeight: "bold",
            boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}>
          Take-out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;