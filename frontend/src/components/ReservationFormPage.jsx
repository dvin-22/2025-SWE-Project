import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ReservationFormPage({ user }) {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const dateFromQuery = queryParams.get('date') || '';
  const timeSlotFromQuery = queryParams.get('timeSlot') || 'Lunch';

  const [form, setForm] = useState({
    date: '',
    timeSlot: '',
    name: '',
    phone: '',
    cardNumber: '',
    guestCount: 2
  });

  const [tableCapacity, setTableCapacity] = useState(null);

  useEffect(() => {
    if (dateFromQuery && timeSlotFromQuery) {
      setForm(prev => ({
        ...prev,
        date: dateFromQuery,
        timeSlot: timeSlotFromQuery
      }));
    }

    fetch(`/api/table/${tableId}`)
      .then(res => res.json())
      .then(data => setTableCapacity(data.capacity))
      .catch(err => console.error('Error fetching table info:', err));
  }, [dateFromQuery, timeSlotFromQuery, tableId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'guestCount' ? parseInt(value) : value
    });
  };

  const validateForm = () => {
    const phoneRegex = /^(010\d{8}|010-\d{4}-\d{4})$/;
    if (!phoneRegex.test(form.phone)) {
      alert('전화번호 형식이 잘못되었습니다. 예: 01012345678 또는 010-1234-5678');
      return false;
    }

    const cardRegex = /^(\d{16}|\d{4}-\d{4}-\d{4}-\d{4})$/;
    if (!cardRegex.test(form.cardNumber)) {
      alert('카드번호 형식이 잘못되었습니다. 16자리 숫자 또는 xxxx-xxxx-xxxx-xxxx');
      return false;
    }

    if (tableCapacity !== null && form.guestCount > tableCapacity) {
      alert(`이 테이블은 최대 ${tableCapacity}명까지 예약 가능합니다.`);
      return false;
    }

    if (tableCapacity !== null && form.guestCount < 1) {
      alert(`인원수가 잘못되었습니다. (1명 이상 입력)`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const res = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        userId: user.userId,
        tableId: parseInt(tableId)
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      navigate('/my-reservations');
    } else {
      alert(data.error);
    }
  };

  if (!user) return <p className="text-white text-center mt-10">로그인이 필요합니다.</p>;

  return (
    <div
      className="relative min-h-screen text-white py-10 px-4"
      style={{
        backgroundImage: "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0" />
      <div className="relative z-10 max-w-xl mx-auto mt-16 p-8 bg-zinc-900 bg-opacity-90 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">예약하기</h2>
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-400">
            예약 날짜: <span className="font-semibold text-white">{form.date}</span><br />
            시간대: <span className="font-semibold text-white">{form.timeSlot}</span>
          </div>

          <input
            name="name"
            placeholder="예약자 이름"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761]"
          />
          <input
            name="phone"
            placeholder="전화번호 (예: 010-1234-5678)"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761]"
          />
          <input
            name="cardNumber"
            placeholder="카드번호 (예: 1234-5678-9012-3456)"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761]"
          />
          <input
            name="guestCount"
            type="number"
            min="1"
            placeholder="인원수"
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#0D121C] text-white border border-[#4D5761]"
          />
          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-white font-semibold"
          >
            예약 완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReservationFormPage;