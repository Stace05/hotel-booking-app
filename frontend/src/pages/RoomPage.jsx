import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import './RoomPage.css';

const initialRooms = [
  {
    id: 1,
    name: "Luxury Suite",
    category: "Luxury",
    beds: 2,
    amenities: ["Wi-Fi", "Mini-bar", "Patio", "TV", "Air Conditioning"],
    description: "Large room with a view.",
    price: 150,
    image: "https://media.istockphoto.com/id/1266155634/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%80%D0%BE%D0%B7%D0%BA%D1%96%D1%88%D0%BD%D1%96-%D1%82%D0%B0-%D0%B5%D0%BB%D0%B5%D0%B3%D0%B0%D0%BD%D1%82%D0%BD%D1%96-%D1%96%D0%BD%D1%82%D0%B5%D1%80%D1%94%D1%80%D0%B8-%D1%81%D0%BF%D0%B0%D0%BB%D1%8C%D0%BD%D1%96.jpg?s=612x612&w=0&k=20&c=n4PxtcBlW2ybX3Cml-C5xcou6qsAkOVUtdoqsWTggVc="
  },
  {
    id: 2,
    name: "Standard Double Room",
    category: "Standard",
    beds: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    description: "Standard room for two.",
    price: 100,
    image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3AtMzEyLXRlZDY2OTYtY2hpbS5qcGc.jpg"
  },
  {
    id: 3,
    name: "Single Room",
    category: "Economy",
    beds: 1,
    amenities: ["Wi-Fi", "Air Conditioning"],
    description: "Budget option for a single person",
    price: 80,
    image: "https://media.istockphoto.com/id/1153225644/photo/3d-render-of-luxury-hotel-room.jpg?s=612x612&w=0&k=20&c=RlWB-SdsgfF3k4cIRv-kqcc1mNuAmxyNjST7ajvK7PI="
  },
  {
    id: 4,
    name: "Family Suite",
    category: "Standard",
    beds: 4,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini-bar"],
    description: "Large room for a family of four.",
    price: 120,
    image: "https://media.istockphoto.com/id/2093684615/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%BF%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%80%D0%B0-%D1%81%D1%83%D1%87%D0%B0%D1%81%D0%BD%D0%B0-%D0%B2%D1%96%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8F-%D0%B7%D0%B0-%D0%B4%D0%BE%D0%BF%D0%BE%D0%BC%D0%BE%D0%B3%D0%BE%D1%8E-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%B8%D1%85-%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D0%B9.jpg?s=612x612&w=0&k=20&c=U5Tgpz89IAN-Ex7oiYq_iZ6JFDVreJSb7RHUwzz7llk="
  }
];

const RoomDetailsPage = () => {
  const { id } = useParams();
    const room = initialRooms.find((r) => r.id === parseInt(id));
  if (!room) {
    return (
      <main className="room-details-main">
        <h1 className="details-title">Room Not Found</h1>
        <Link to="/" className="back-link">Return to Home</Link>
      </main>
    );
  }

  return (
    <main className="room-details-main">
      <div className="room-details-card">
        <Link to="/" className="back-link">
          <FaChevronLeft className="back-icon" /> Back to Hotel Rooms
        </Link>

        <div className="room-content-wrapper">
          <img
            src={room.image}
            alt={room.name}
            className="room-details-image"
          />

          <div className="room-info-block">
            <h1 className="details-title">{room.name}</h1>
            <p className="details-description">{room.description}</p>

            <ul className="details-list">
              <li className="details-list-item">
                <span className="details-list-label">Category:</span>
                {room.category}
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Capacity:</span>
                {room.beds} {room.beds === 1 ? 'person' : 'people'}
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Price:</span>
                ${room.price}/night
              </li>
              <li className="details-list-item">
                <span className="details-list-label">Amenities:</span>
                {room.amenities.join(', ')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RoomDetailsPage;