import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('🟢 Login Response:', data);

    if (res.ok && data.userId) {
      const user = { name: data.name, userId: data.userId };
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setLoginSuccess(true);
    } else {
      alert(data.error || '로그인 실패');
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      console.log('✅ 로그인 성공, 페이지 이동 시도');
      navigate('/tables');
    }
  }, [loginSuccess, navigate]);

  return (
  <div
    className="relative min-h-screen flex flex-col items-center justify-center text-white px-4"
    style={{
      backgroundImage: "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* 어두운 반투명 오버레이 */}
    <div className="absolute inset-0 bg-black opacity-80 z-0" />

    {/* 안내 문구 */}
    <div className="absolute top-40 text-center z-10">
      <h2 className="text-lg text-white font-medium">
        환영합니다! 예약을 위해 로그인해주세요.
      </h2>
    </div>

    {/* 로그인 박스 */}
    <div className="bg-zinc-900 p-8 rounded-2xl shadow-md w-96 mt-10 z-10">
      <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
      <input
        type="email"
        placeholder="이메일 입력"
        className="w-full mb-4 px-3 py-2 rounded bg-[#0D121C] border border-[#4D5761] text-white placeholder-[#6C737F]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 입력"
        className="w-full mb-6 px-3 py-2 rounded bg-[#0D121C] border border-[#4D5761] text-white placeholder-[#6C737F]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-[#4D5761] hover:bg-[#6C737F] text-white py-2 rounded"
      >
        로그인
      </button>
      <div className="text-right mt-2">
        <button
          onClick={() => navigate('/signup')}
          className="text-white hover:underline text-sm bg-transparent border-none p-0"
        >
          회원가입
        </button>
      </div>
    </div>
  </div>
  );
}

export default LoginPage;