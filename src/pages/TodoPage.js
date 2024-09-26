import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  addDoc,
  query,
  getFirestore,
  getDocs,
  where,
  documentId,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
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
  const tasks = collection(db, 'tasks');
  const [task, setTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

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
      await fetchTasks();
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

  const fetchTasks = async () => {
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
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, { name: editingTaskText });
    } catch (e) {
      console.log('DB 업데이트 실패: ', e);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'tasks', id);
      await deleteDoc(docRef);
      console.log('DB 삭제 완료: ', id);
      await fetchTasks();
    } catch (e) {
      console.log('DB 삭제 실패: ', e);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id, text) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  const handleSaveClick = async (id) => {
    setLoading(true);
    try {
      updateTask(id);
      await fetchTasks();
      setEditingTaskId(null);
      setEditingTaskText('');
    } catch (e) {
      console.log('DB Update 실패: ', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
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
              {completedTasks.map((task) => (
                <li key={task.id}>
                  {editingTaskId === task.id ? (
                    <>
                      <input type="text" value={editingTaskText} onChange={(e) => setEditingTaskText(e.target.value)} />
                      <div className="todo-list-btn-group">
                        <button onClick={() => handleSaveClick(task.id)}>저장</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {task.name}
                      <div className="todo-list-btn-group">
                        <button onClick={() => handleEditClick(task.id, task.name)}>수정</button>
                        <button onClick={() => deleteTask(task.id)}>삭제</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <h3>To-do</h3>
            <ul className="todo-list">
              {incompletedTasks.map((task) => {
                return (
                  <li key={task.id}>
                    {editingTaskId === task.id ? (
                      <>
                        <input
                          type="text"
                          value={editingTaskText}
                          onChange={(e) => setEditingTaskText(e.target.value)}
                        />
                        <div className="todo-list-btn-group">
                          <button onClick={() => handleSaveClick(task.id)}>저장</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {task.name}
                        <div className="todo-list-btn-group">
                          <button onClick={() => handleEditClick(task.id, task.name)}>수정</button>
                          <button onClick={() => deleteTask(task.id)}>삭제</button>
                        </div>
                      </>
                    )}
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
