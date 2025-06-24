import React, { useState, useEffect } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, database } from "../firebase/firebaseConfig";
import { ref, onValue, push, set, remove, get } from "firebase/database";
import CreateBoardModal from "./CreateBoardModal";
import BoardsTable from "./BoardsTable";
import Navbar from "../components/Nav";
import { signOut } from "firebase/auth";

interface Board {
  boardId: string;
  title: string;
  createdAt: number;
  invitedFrom?: string;
  ownerName: string;
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
    if (!user) return;
    const boardsRef = ref(database, `boards`);

    return onValue(boardsRef, async (snapshot) => {
      const data = snapshot.val() || {};

      const fetchedBoards = await Promise.all(
        Object.entries(data).map(async ([boardId, boardData]: any) => {
          const isOwner = boardData.owner === user.uid;
          const isSharedWithUser = boardData.sharedWith?.[user.uid];

          if (!isOwner && !isSharedWithUser) return null;

          // Resolve owner name from /users/{uid}
          let ownerName = "Unknown";
          if (boardData.owner) {
            const ownerSnap = await get(
              ref(database, `users/${boardData.owner}`)
            );
            if (ownerSnap.exists()) {
              const userData = ownerSnap.val();
              console.log(userData);
              ownerName = userData.name;
            }
          }

          return {
            boardId,
            title: boardData.title || "Untitled",
            createdAt: boardData.createdAt || 0,
            invitedFrom: isOwner ? undefined : boardData.owner,
            ownerName,
          } as Board;
        })
      );

      setBoards(fetchedBoards.filter((b): b is Board => b !== null));
    });
  }, [user]);

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
    if (!user) return;

    const newBoardRef = push(ref(database, "boards"));
    const boardId = newBoardRef.key as string;

    const newBoardData = {
      createdAt: Date.now(),
      title,
      owner: user.uid,
    };

    await set(newBoardRef, newBoardData);
    await set(ref(database, `userBoards/${user.uid}/${boardId}`), true);

    navigate(`/board/${boardId}`);
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!user) return;
    await remove(ref(database, `boards/${boardId}`));
    await remove(ref(database, `userBoards/${user.uid}/${boardId}`));
  };

  const handleLogout = () => signOut(auth);

  return (
    <>
      <Navbar onLogout={handleLogout} onInvite={() => {}} />
      <div className="container py-4">
        <Row className="align-items-center mb-3">
          <Col>
            <h4 className="mb-0">Boards</h4>
          </Col>
          <Col className="text-end">
            <Button variant="primary" onClick={() => setShowModal(true)}>
              + Create new
            </Button>
          </Col>
        </Row>

        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          <BoardsTable
            boards={boards}
            onlineCounts={onlineCounts}
            onRowClick={(boardId) => navigate(`/board/${boardId}`)}
            onDelete={handleDeleteBoard}
            user={user}
          />
        </div>

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
