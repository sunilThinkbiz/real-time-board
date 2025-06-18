import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebaseConfig";

interface Board {
  boardId: string;
}

export const useBoardOnlineCounts = (boards: Board[]) => {
  const [onlineCounts, setOnlineCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const unsubscribes: Array<() => void> = [];

    boards.forEach((board) => {
      const onlineRef = ref(database, `boards/${board.boardId}/onlineUsers`);
      const unsubscribe = onValue(onlineRef, (snapshot) => {
        const data = snapshot.val() || {};
        const count = Object.keys(data).length;
        setOnlineCounts((prev) => ({ ...prev, [board.boardId]: count }));
      });
      unsubscribes.push(() => unsubscribe());
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [boards]);

  return onlineCounts;
};
