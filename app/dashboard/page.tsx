export default function DashboardPage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🛡 Личный кабинет</h1>
            <p>Добро пожаловать! Эту страницу видишь только ты, потому что у тебя есть активный токен.</p>
            <a href="/api/auth/logout" style={{ color: 'red' }}>Выйти (скоро сделаем)</a>
        </div>
    );
}