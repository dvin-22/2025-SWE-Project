import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      navigate('/');
    } else {
      alert(data.error);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center text-white px-4"
      style={{
        backgroundImage: "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 어두운 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-80 z-0" />

      {/* 회원가입 박스 */}
      <div className="z-10 bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <div className="space-y-4">
          <input
            name="name"
            placeholder="이름"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761] placeholder-[#6C737F]"
          />
          <input
            name="email"
            placeholder="이메일"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761] placeholder-[#6C737F]"
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761] placeholder-[#6C737F]"
          />
          <button
            onClick={handleSignup}
            className="w-full py-2 rounded bg-[#4D5761] hover:bg-[#6C737F] text-white font-semibold"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;