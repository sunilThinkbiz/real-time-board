import React from "react";
import Navbar from "../components/Nav";
import Sidebar from "../components/Board/Sidebar";
import Canvas from "../components/Board/Canvas";
import { BoardProvider } from "../context/BoardContext";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePresence } from "../hook/usePresence";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const resolvedBoardId = boardId || user?.uid || "";

  usePresence(resolvedBoardId);

  const handleLogout = () => signOut(auth);
 const handleInvite = async () => {
    const link = `${window.location.origin}/board/${resolvedBoardId}`;
    try {
      await navigator.clipboard.writeText(link);
      alert("Board link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!boardId) return <Navigate to={`/board/${user.uid}`} />;

  return (
    <BoardProvider boardId={resolvedBoardId}>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        {/* Fixed Navbar at top */}
        <Navbar onLogout={handleLogout} onInvite={handleInvite} />

        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Fixed Sidebar on left */}
          <div
            style={{
              width: "80px",
              background: "#f8f9fa",
              borderRight: "1px solid #ddd",
            }}
          >
            <Sidebar />
          </div>

          {/* Canvas area */}
          <div style={{ flex: 1, overflow: "hidden" }}>

            <Canvas boardId={resolvedBoardId} />
          </div>
        </div>
      </div>
    </BoardProvider>
  );
};

export default Home;
