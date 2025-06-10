// src/page/Home.tsx
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Navbar from "../components/Nav";

const Home: React.FC = () => {
  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      <div className="container mt-5">
        <h2>Welcome to the Board!</h2>
        <p>This is your real-time interactive board (content to be added).</p>
      </div>
    </div>
  );
};

export default Home;
