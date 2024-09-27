import { getAuth } from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const createTask = async (task) => {
  const auth = getAuth();
  const db = getFirestore();
  const tasks = collection(db, 'tasks');

  try {
    const docRef = await addDoc(tasks, {
      name: task,
      completed: false,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    });
    console.log('DB 저장 성공: ', docRef.id);
  } catch (e) {
    console.log('DB 저장 실패: ', e);
  }
};

export default createTask;
