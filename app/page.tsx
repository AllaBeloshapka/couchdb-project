import Link from 'next/link';

/**
 * Landing page of the application.
 * Provides navigation to Authentication features.
 */
export default function Home() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <h1>Welcome to My Next.js Auth Project 🚀</h1>
      <p>This is a practice application with <strong>CouchDB</strong> and <strong>JWT Authentication</strong>.</p>
      
      <hr style={{ margin: '20px 0' }} />

      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            {/* Link to the Registration process (currently via API/Postman) */}
            <span style={{ color: '#666' }}>Testing Registration:</span> <code>POST /api/auth/register</code>
          </li>
          <li style={{ marginBottom: '10px' }}>
            {/* Link to the Login process */}
            <span style={{ color: '#666' }}>Testing Login:</span> <code>POST /api/auth/login</code>
          </li>
          <li style={{ marginTop: '20px' }}>
            {/* Navigation to the protected dashboard */}
            <Link href="/dashboard" style={{ 
              backgroundColor: '#0070f3', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '5px',
              textDecoration: 'none'
            }}>
              Go to Dashboard 🛡
            </Link>
          </li>
        </ul>
      </nav>

      <footer style={{ marginTop: '50px', fontSize: '0.8rem', color: '#888' }}>
        <p>Built as part of the learning program with mentor Said.</p>
      </footer>
    </div>
  );
}