// App.jsx
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import TableListPage from './components/TableListPage';
import ReservationFormPage from './components/ReservationFormPage';
import MyReservationsPage from './components/MyReservationsPage';

function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser && storedUser !== 'undefined') {
    try {
      const parsed = JSON.parse(storedUser);
      console.log('👤 App 초기 user:', parsed);
      setUser(parsed);
    } catch (err) {
      console.error('❌ JSON 파싱 실패:', err);
    }
  }
  setLoading(false);
}, []);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">로딩 중...</div>;
  }

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/tables" element={<TableListPage user={user} />} />
        <Route path="/reserve/:tableId" element={<ReservationFormPage user={user} />} />
        <Route path="/my-reservations" element={<MyReservationsPage user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;