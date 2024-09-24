import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, getFirestore, getDocs, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/reducers/authSlice';
const TodoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = getAuth();
  const handleLogout = () => {
    signOut(auth).then(() => {
      dispatch(logout());
      navigate('/');
    });
  };

  const db = getFirestore();
  const currentUserId = useSelector((state) => state.auth.user.uid);
  const [task, setTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchTasksByCompleted = async (completed) => {
    const q = query(collection(db, 'tasks'), where('completed', '==', completed));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs.map((doc) => {
      if (doc.data().userId === currentUserId) {
        return { id: doc.id, ...doc.data() };
      }
    });
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTasks = await fetchTasksByCompleted(false);
        setIncompletedTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="frame">
      <div className="todo-container">
        <input
          className="input"
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <button className="button" onClick={() => addTask()}>
          추가
        </button>
        <ul className="todo-list">
          {incompletedTasks.map((task) => {
            return (
              <li key={task.id}>
                {task.name}
                <span>{task.completed ? '완료' : '미완료'}</span>
              </li>
            );
          })}
        </ul>
        <button className="todo-logout" onClick={() => handleLogout()}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default TodoPage;
