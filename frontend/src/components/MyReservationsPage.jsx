import { useEffect, useState } from 'react';

function MyReservationPage({ user }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/my-reservations?userId=${user.userId}`)
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        setLoading(false);
      });
  }, [user]);

  const cancelReservation = async (id) => {
    const confirmCancel = window.confirm("정말로 이 예약을 취소하시겠습니까?");
    if (!confirmCancel) return;

    const res = await fetch(`/api/cancel/${id}?userId=${user.userId}`, {
      method: 'DELETE'
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      setReservations(prev => prev.filter(r => r.id !== id));
    } else {
      alert(data.error);
    }
  };

  if (!user) return <p className="text-white text-center mt-10">로그인이 필요합니다.</p>;
  if (loading) return <p className="text-white text-center mt-10">로딩 중...</p>;

  return (
    <div
      className="relative min-h-screen text-white p-10"
      style={{
        backgroundImage: "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black opacity-80 z-0" />

      {/* 콘텐츠 */}
      <div className="relative z-10 max-w-3xl mx-auto mt-16 bg-zinc-900 bg-opacity-90 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{user.name}님의 예약 내역</h2>
        {reservations.length === 0 ? (
          <p className="text-center text-gray-300">현재 예약 내역이 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {reservations.map(r => (
              <li
                key={r.id}
                className="bg-[#0D121C] rounded-lg p-4 flex justify-between items-center border border-gray-700"
              >
                <div>
                  📅 <strong>{r.date}</strong> | {r.time_slot} | {r.location} ({r.capacity}인)
                </div>
                <button
                  onClick={() => cancelReservation(r.id)}
                  className="text-sm text-red-400 hover:text-red-300 underline"
                >
                  예약 취소
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyReservationPage;