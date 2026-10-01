import React from 'react';
import RoomCard from '../components/RoomCard';
import './HomePage.css';

const HomePage = () => {
  const rooms = [
    {
      id: 1,
      name: "room1",
      availability: "Monday to Friday",
      price: 7,
      image: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3AtMzEyLXRlZDY2OTYtY2hpbS5qcGc.jpg" 
    },
    {
      id: 2,
      name: "room2",
      availability: "Saturday to Sunday",
      price: 3,
      image: "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU="
    },
    {
      id: 3,
      name: "room3",
      availability: "Friday to Monday",
      price: 4,
      image: "https://media.istockphoto.com/id/1153225644/photo/3d-render-of-luxury-hotel-room.jpg?s=612x612&w=0&k=20&c=RlWB-SdsgfF3k4cIRv-kqcc1mNuAmxyNjST7ajvK7PI="
    }
  ];

  return (
    <main className="home-main">
      <section className="home-header-section">
        <h1 className="home-title">
          Available Rooms
        </h1>
      </section>
      
      <div className="rooms-container">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;