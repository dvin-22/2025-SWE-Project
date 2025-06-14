import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TableListPage({ user }) {
  const [tables, setTables] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('Lunch');
  const navigate = useNavigate();

  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      alert('예약을 위해 로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchTables(date, timeSlot);
  };

  const handleTimeSlotChange = (e) => {
    const slot = e.target.value;
    setTimeSlot(slot);
    if (selectedDate) {
      fetchTables(selectedDate, slot);
    }
  };

  const fetchTables = (date, slot) => {
    fetch(`/api/tables?date=${date}&timeSlot=${slot}`)
      .then((res) => res.json())
      .then((data) => {
        setTables(data);
      })
      .catch((err) => console.error('Error fetching tables:', err));
  };

  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div
      className="relative min-h-screen text-white p-6"
      style={{
        backgroundImage: "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80 z-0" />

      <div className="relative z-10 max-w-3xl mx-auto mt-16 bg-zinc-900 bg-opacity-90 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">예약 날짜 및 시간 선택</h2>
        <div className="mb-6 flex justify-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={today}
            max={maxDateStr}
            className="bg-[#0D121C] text-white border border-[#4D5761] rounded px-4 py-2"
          />
          <select
            value={timeSlot}
            onChange={handleTimeSlotChange}
            className="bg-[#0D121C] text-white border border-[#4D5761] rounded px-4 py-2"
          >
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {selectedDate && (
          <>
            <h3 className="text-xl font-semibold mb-4 text-center">예약 가능한 테이블</h3>
            <ul className="space-y-4">
              {tables.map((t) => (
                <li
                  key={t.id}
                  className="flex justify-between items-center border border-gray-700 p-4 rounded-lg bg-[#0D121C] shadow hover:shadow-lg transition"
                >
                  <span className="text-lg">📍 {t.location} - {t.capacity}인</span>
                  <button
                    onClick={() => navigate(`/reserve/${t.id}?date=${selectedDate}&timeSlot=${timeSlot}`)}
                    className="px-4 py-2 bg-[#4D5761] hover:bg-[#6C737F] text-white rounded"
                  >
                    예약
                  </button>
                </li>
              ))}
              {tables.length === 0 && (
                <li className="text-center text-gray-400">해당 날짜 및 시간에 예약 가능한 테이블이 없습니다.</li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default TableListPage;