import { Link, useNavigate } from 'react-router-dom';

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-zinc-900 text-white flex justify-between items-center px-6 py-4">
      <Link to="/" className="text-xl font-light flex items-center text-white">
        <span className=" mr-2">🍽️</span> Software Restaurant
      </Link>
      <div className="space-x-4">
        <Link to="/" className="hover:underline text-white">홈</Link>
        {user ? (
          <>
            <Link to="/tables" className="hover:underline text-white">예약</Link>
            <Link to="/my-reservations" className="hover:underline text-white">예약확인</Link>
            <button
              onClick={handleLogout}
              className="hover:underline text-white bg-transparent border-none ml-2"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline text-white">로그인</Link>
            <Link to="/signup" className="hover:underline text-white">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;