import { doc, updateDoc, getFirestore } from 'firebase/firestore';

const updateTask = async (id, text) => {
  const db = getFirestore();

  try {
    const docRef = doc(db, 'tasks', id);
    await updateDoc(docRef, { name: text });
    console.log('DB 업데이트 완료: ', id);
  } catch (e) {
    console.log('DB 업데이트 실패: ', e);
  }
};

export default updateTask;
