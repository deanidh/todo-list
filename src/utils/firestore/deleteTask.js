import { doc, getFirestore, deleteDoc } from 'firebase/firestore';

const deleteTask = async (id) => {
  const db = getFirestore();

  try {
    const docRef = doc(db, 'tasks', id);
    await deleteDoc(docRef);
    console.log('DB 삭제 완료: ', id);
  } catch (e) {
    console.log('DB 삭제 실패: ', e);
  }
};

export default deleteTask;
