// Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, database } from "../firebase/firebaseConfig";
import { ref, onValue, push, set, remove } from "firebase/database";
import CreateBoardModal from "./CreateBoardModal";
import BoardsTable from "./BoardsTable";
import Navbar from "../components/Nav";
import { signOut } from "firebase/auth";

interface Board {
  boardId: string;
  title: string;
  createdAt: number;
  invitedFrom?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [boards, setBoards] = useState<Board[]>([]);
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryOwner = searchParams.get("owner");
  const localOwner = localStorage.getItem("activeBoardOwner");
  const ownerUid = queryOwner || localOwner || user?.uid;

  useEffect(() => {
    if (ownerUid) {
      localStorage.setItem("activeBoardOwner", ownerUid);
    }
  }, [ownerUid]);

  useEffect(() => {
    if (!ownerUid) return;
    const boardsRef = ref(database, `userBoards/${ownerUid}`);
    return onValue(boardsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list: Board[] = Object.entries(data).map(([key, value]: any) => ({
        boardId: key,
        title: value.title || key,
        createdAt: value.createdAt,
        invitedFrom: value.invitedFrom || "",
      }));
      setBoards(list);
    });
  }, [ownerUid]);

  // Watch online users for each board
  useEffect(() => {
    const unsubscribes: Array<() => void> = [];
    boards.forEach((board) => {
      const usersRef = ref(database, `boards/${board.boardId}/users`);
      const unsub = onValue(usersRef, (snap) => {
        const data = snap.val() || {};
       const online = Object.values(data).filter((u: any) => u.online).length;
      setOnlineCounts((prev) => ({ ...prev, [board.boardId]: online }));
      });
      unsubscribes.push(() => unsub());
    });
    return () => unsubscribes.forEach((unsub) => unsub());
  }, [boards]);

  const handleCreateBoard = async (title: string) => {
    if (!ownerUid) return;
    const boardsRef = ref(database, "boards");
    const newBoardRef = push(boardsRef);
    const boardId = newBoardRef.key as string;

    const newBoardData = {
      createdAt: Date.now(),
      createdBy: ownerUid,
      title,
    };

    await set(newBoardRef, newBoardData);

    const userBoardRef = ref(database, `userBoards/${ownerUid}/${boardId}`);
    await set(userBoardRef, newBoardData);

    navigate(`/board/${boardId}`);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!ownerUid) return;
    await remove(ref(database, `boards/${boardId}`));
    await remove(ref(database, `userBoards/${ownerUid}/${boardId}`));
  };
  const handleLogout = () => signOut(auth);
  return (
    <>
      <Navbar onLogout={handleLogout}onInvite={() => {}} />
      <div className="container py-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h4 className="mb-0">Boards in this team</h4>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Create new
            </Button>
          </Col>
        </Row>

        {/* ✅ New component */}
        <BoardsTable
          boards={boards}
          onlineCounts={onlineCounts}
          onRowClick={(boardId) => navigate(`/board/${boardId}`)}
          onDelete={handleDeleteBoard}
          user={user}
        />

        <CreateBoardModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onCreate={(title) => {
            handleCreateBoard(title);
            setShowModal(false);
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
