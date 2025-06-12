
import { useEffect, useState } from 'react';
import { database } from '../firebase/firebaseConfig';
import { ref, onValue } from 'firebase/database';

export const useBoardUsers = (boardId: string) => {
  const [users, setUsers] = useState<Record<string, any>>({});
    console.log('users',users)
  useEffect(() => {
    if (!boardId) return;

    const usersRef = ref(database, `boards/${boardId}/users`);
    console.log('usersRef',usersRef)
    const unsubscribe = onValue(usersRef, (snapshot) => {
      setUsers(snapshot.val() || {});
    });

    return () => unsubscribe();
  }, [boardId]);

  return users;
};
