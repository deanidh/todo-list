import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, getFirestore, getDocs } from 'firebase/firestore';

const TodoPage = () => {
  const navigate = useNavigate();

  const auth = getAuth();
  const db = getFirestore();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = async () => {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        task: task,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      console.log('DB 저장 성공: ', docRef.id);
      setTask('');
    } catch (e) {
      console.log('DB 저장 실패: ', e);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArray = [];
      querySnapshot.forEach((doc) => {
        tasksArray.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksArray);
    });
    return () => unsubscribe();
  }, []);

  // 읽기 테스트
  // getDocs(collection(db, 'tasks')).then((querySnapshot) => {
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data().task);
  //   });
  // });

  return (
    <div className="frame">
      <div className="todo-container">
        <input
          className="todo-input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button className="todo-button" onClick={() => addTask()}>
          추가
        </button>
        <ul className="todo-list">
          {tasks.map((task) => {
            return (
              <li key={task.id}>
                {task.task}
                <span>{task.completed ? '완료' : '미완료'}</span>
              </li>
            );
          })}
        </ul>
        <button
          className="todo-logout"
          onClick={() => {
            signOut(auth);
            navigate('/');
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default TodoPage;
