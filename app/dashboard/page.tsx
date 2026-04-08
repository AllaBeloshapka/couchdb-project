/**
 * Private Dashboard Page.
 * This page is protected by the middleware and accessible only to authenticated users.
 */
export default function DashboardPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🛡 User Dashboard</h1>
            <p>Welcome! You can see this page because you have a valid authentication token.</p>
            
            {/* Logout link - functionality to be implemented in the next session */}
            <a href="/api/auth/logout" style={{ color: 'red' }}>Logout (coming soon)</a>
        </div>
    );
}