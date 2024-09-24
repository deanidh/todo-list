import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, getFirestore, getDocs, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/reducers/authSlice';
import Loading from '../components/Loading';
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
      setLoading(true);
      const docRef = await addDoc(collection(db, 'tasks'), {
        name: task,
        completed: false,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      console.log('DB 저장 성공: ', docRef.id);
      setTask('');
      await updateTasks();
    } catch (e) {
      console.log('DB 저장 실패: ', e);
    }
  };

  const fetchTasksByCompleted = async (completed) => {
    const q = query(collection(db, 'tasks'), where('completed', '==', completed));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs
      .filter((doc) => doc.data().userId === currentUserId)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return result;
  };

  const updateTasks = async () => {
    setLoading(true);
    try {
      setIncompletedTasks(await fetchTasksByCompleted(false));
      setCompletedTasks(await fetchTasksByCompleted(true));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateTasks();
  }, []);

  return (
    <div className="frame">
      <div className="todo-container">
        <div className="todo-input-wrap">
          <input
            className="input"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="할 일을 입력하세요"
          />
          <button className="button" onClick={addTask}>
            추가
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="todo-list-wrap">
            <h3>Done</h3>
            <ul className="todo-list">
              {completedTasks.map((task) => {
                return (
                  <li key={task.id}>
                    {task.name}
                    <span>완료</span>
                  </li>
                );
              })}
            </ul>
            <h3>To-do</h3>
            <ul className="todo-list">
              {incompletedTasks.map((task) => {
                return (
                  <li key={task.id}>
                    {task.name}
                    <span>미완료</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <button className="todo-logout" onClick={() => handleLogout()}>
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default TodoPage;
