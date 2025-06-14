import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{
        backgroundImage:
          "url('https://www.hotelnaruseoul.com/wp-content/uploads/sites/18/2022/10/Hotel-Naru-Seoul-MGallery_Restaurant-Voisin-2200x1200.jpg')",
      }}
    >
      <div className="bg-black bg-opacity-0 p-10 rounded-2xl text-center">
        <h1 className="text-4xl text-black font-bold mb-4">Welcome to Our Restaurant</h1>
        <p className="text-lg text-black mb-6">편안한 분위기에서 최고의 식사를 예약해보세요</p>
        <Link
          to="/tables"
          className="text-black underline hover:text-white text-lg font-semibold"
        >
          예약하러 가기 →
        </Link>
      </div>
    </div>
  );
}

export default HomePage;