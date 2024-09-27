import { getAuth } from 'firebase/auth';
import { query, getDocs, where, orderBy, getFirestore, collection } from 'firebase/firestore';

const readTasksByCompleted = async (completed) => {
  const auth = getAuth();
  const db = getFirestore();
  const tasks = collection(db, 'tasks');

  try {
    const q = query(tasks, where('completed', '==', completed), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs
      .filter((doc) => doc.data().userId === auth.currentUser.uid)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('DB 읽기 완료: completed ==', completed.toString());
    return result;
  } catch (e) {
    console.error('DB 읽기 실패: ', e);
  }
};

export default readTasksByCompleted;
