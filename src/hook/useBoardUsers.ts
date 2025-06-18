import { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";
import { ref, onValue, off } from "firebase/database";

const ONLINE_TIMEOUT = 30 * 1000; // 30 seconds

export const useBoardUsers = (boardId: string) => {
  const [users, setUsers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!boardId) return;

    const usersRef = ref(database, `boards/${boardId}/users`);
    const listener = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const now = Date.now();

      const filteredUsers: Record<string, any> = {};

      Object.entries(data).forEach(([uid, user]: [string, any]) => {
        if (user.online && (!user.lastActive || now - user.lastActive < ONLINE_TIMEOUT)) {
          filteredUsers[uid] = user;
        }
      });

      setUsers(filteredUsers);
    });

    return () => off(usersRef, "value", listener);
  }, [boardId]);

  return users;
};
