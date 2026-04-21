import "./css/Dashboard.css";

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

type DashboardProps = {
  setScreen: (screen: Screen) => void;
  userRole: 1 | 2 | null;
  userName: string | null;
  onLogout: () => void;
};

function Dashboard({
  setScreen,
  userRole,
  userName,
  onLogout,
}: DashboardProps) {
  const roleLabel =
    userRole === 1 ? "MANAGER" : userRole === 2 ? "EMPLOYEE" : null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-user-block">
          <h1 className="dashboard-title">Welcome to QuickServe</h1>

          {userName && (
            <p className="dashboard-subtitle">
              Logged in as: <strong>{userName}</strong>
              {roleLabel && <> ({roleLabel})</>}
            </p>
          )}
        </div>

        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="button-group">
        <button
          onClick={() => setScreen("tables")}
          className="btn btn-dinein"
        >
          Dine-In
        </button>

        <button
          onClick={() => setScreen("takeout")}
          className="btn btn-takeout"
        >
          Take-out
        </button>

        {userRole === 1 && (
          <>
            <button
              className="btn btn-analytics"
              onClick={() => setScreen("analytics")}
            >
              Analytics
            </button>

            <button
              className="btn btn-history"
              onClick={() => setScreen("history")}
            >
              Order History
            </button>

            <button
              className="btn btn-add-manager"
              onClick={() => setScreen("create-manager")}
            >
              Add Manager
            </button>

            <button
              className="btn btn-add-employee"
              onClick={() => setScreen("createEmployee")}
            >
              Add Employee
            </button>

            <button
              className="btn btn-users"
              onClick={() => setScreen("users")}
            >
              View Users
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;