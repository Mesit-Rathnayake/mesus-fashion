import "./DashboardPage.css";

const DashboardPage = () => {
    return (
        <div className="admin-dashboard">
            <div className="dashboard-heading">
                <div>
                    <span>OVERVIEW</span>
                    <h1>Dashboard</h1>
                    <p>Welcome to your MeSUS Fashion admin panel.</p>
                </div>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-stat-card">
                    <span>Total Products</span>
                    <h2>—</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Categories</span>
                    <h2>—</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Total Orders</span>
                    <h2>—</h2>
                </div>

                <div className="dashboard-stat-card">
                    <span>Revenue</span>
                    <h2>—</h2>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
