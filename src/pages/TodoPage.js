import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, getFirestore, getDocs, where, documentId, deleteDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/reducers/authSlice';
import Loading from '../components/Loading';
const TodoPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = getAuth();
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
      dispatch(logout());
    });
  };

  const db = getFirestore();
  const currentUserId = useSelector((state) => state.auth.user.uid);
  const [task, setTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const tasks = collection(db, 'tasks');

  const createTask = async () => {
    try {
      setLoading(true);
      const docRef = await addDoc(tasks, {
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

  const readTasksByCompleted = async (completed) => {
    const q = query(tasks, where('completed', '==', completed));
    const querySnapshot = await getDocs(q);
    const result = querySnapshot.docs
      .filter((doc) => doc.data().userId === currentUserId)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return result;
  };

  const updateTasks = async () => {
    setLoading(true);
    try {
      setIncompletedTasks(await readTasksByCompleted(false));
      setCompletedTasks(await readTasksByCompleted(true));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id) => {
    setLoading(true);
    try {
      const q = query(tasks, where(documentId(), '==', id));
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs);
    } catch (e) {
      console.log('DB Update 실패: ', e);
    }
    setLoading(false);
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const q = query(tasks, where(documentId(), '==', id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        console.log('DB 삭제 완료: ', id);
      } else {
        console.log('DB Update 실패: id와 일치하는 doc 없음');
      }
      updateTasks();
    } catch (e) {
      console.log('DB Update 실패: ', e);
    }
    setLoading(false);
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
          <button className="button" onClick={createTask}>
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
                    <div className="todo-list-btn-group">
                      <button onClick={() => console.log(123)}>수정</button>
                      <button onClick={() => deleteTask(task.id)}>삭제</button>
                    </div>
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
                    <div className="todo-list-btn-group">
                      <button onClick={() => console.log(task.id)}>수정</button>
                      <button onClick={() => deleteTask(task.id)}>삭제</button>
                    </div>
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
