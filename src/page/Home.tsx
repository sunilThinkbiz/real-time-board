
import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import Navbar from "../components/Nav";
import Sidebar from "../components/Board/Sidebar";
import Canvas from "../components/Board/Canvas";
import { Container, Row, Col } from "react-bootstrap";
import { BoardProvider } from "../context/BoardContext";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePresence } from "../hook/usePresence";

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const resolvedBoardId = boardId || user?.uid || null;

  // ✅ Always call hooks unconditionally
  usePresence(resolvedBoardId);

  const handleLogout = () => signOut(auth);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!boardId) return <Navigate to={`/board/${user.uid}`} />;

  return (
    <BoardProvider>
      <Navbar onLogout={handleLogout} />
      <Container fluid>
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10}>
            <Canvas boardId={boardId} />
          </Col>
        </Row>
      </Container>
    </BoardProvider>
  );
};

export default Home;
