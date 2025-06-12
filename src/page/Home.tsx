
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Navbar from "../components/Nav";
import Sidebar from "../components/Board/Sidebar";
import Canvas from "../components/Board/Canvas";
// import { Container, Row, Col } from "react-bootstrap";
import { BoardProvider } from "../context/BoardContext";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePresence } from "../hook/usePresence";

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const resolvedBoardId = boardId || user?.uid || null;

  usePresence(resolvedBoardId);

  const handleLogout = () => signOut(auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!boardId) return <Navigate to={`/board/${user.uid}`} />;

  return (
  <BoardProvider>
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onLogout={handleLogout} />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ width: "80px", backgroundColor: "#f8f9fa", borderRight: "1px solid #ddd" }}>
          <Sidebar />
        </div>
        <div style={{ flex: 1 }}>
          <Canvas boardId={boardId} />
        </div>
      </div>
    </div>
  </BoardProvider>
);

};

export default Home;
