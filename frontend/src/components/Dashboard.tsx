import "./css/Dashboard.css";

function Dashboard({ setScreen }: any) {
  return (
    <div className="dashboard-container">
      
      {/* Title */}
      <h1 className="dashboard-title">
        Welcome to QuickServe
      </h1>

      {/* Buttons */}
      <div className="button-group">

        <button
          onClick={() => setScreen("tables")}
          className="btn btn-dinein">
          Dine-In
        </button>

        <button
          onClick={() => setScreen("takeout")}
          className="btn btn-takeout">
          Take-out
        </button>

        <button
          onClick={() => setScreen("analytics")}
          className="btn btn-analytics">
          Analytics
        </button>

        <button
        onClick={() => setScreen("history")}
        className="btn btn-history">
          Order History
          </button>
      </div>
    </div>
  );
}

export default Dashboard;