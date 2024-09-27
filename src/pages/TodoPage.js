import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/reducers/authSlice';
import Loading from '../components/Loading';
import TodoItem from '../components/TodoItem';
import readTasksByCompleted from '../utils/firestore/readTasksByCompleted';
import createTask from '../utils/firestore/createTask';
import updateTask from '../utils/firestore/updateTask';
import deleteTask from '../utils/firestore/deleteTask';

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

  const [task, setTask] = useState('');
  const [completedTasks, setCompletedTasks] = useState([]);
  const [incompletedTasks, setIncompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState('');

  const handleAddClick = async () => {
    setLoading(true);
    await createTask(task);
    setTask('');
    await fetchTasks();
    setLoading(false);
  };

  const fetchTasks = async () => {
    setLoading(true);
    setIncompletedTasks(await readTasksByCompleted(false));
    setCompletedTasks(await readTasksByCompleted(true));
    setLoading(false);
  };

  const handleEditClick = (id, text) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  const handleSaveClick = async (id) => {
    setLoading(true);
    await updateTask(id, editingTaskText);
    await fetchTasks();
    setEditingTaskId(null);
    setEditingTaskText('');
    setLoading(false);
  };

  const handleDeleteClick = async (id) => {
    setLoading(true);
    await deleteTask(id);
    await fetchTasks();
    setLoading(false);
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
          <button className="button" onClick={handleAddClick}>
            추가
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="todo-list-wrap">
            <h3>Done</h3>
            <ul className="todo-list">
              {completedTasks.sort(task.createdAt).map((task) => (
                <TodoItem
                  key={task.id}
                  task={task}
                  editingTaskId={editingTaskId}
                  editingTaskText={editingTaskText}
                  setEditingTaskText={setEditingTaskText}
                  onEdit={handleEditClick}
                  onSave={handleSaveClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </ul>
            <h3>To-do</h3>
            <ul className="todo-list">
              {incompletedTasks.sort(task.createdAt).map((task) => (
                <TodoItem
                  key={task.id}
                  task={task}
                  editingTaskId={editingTaskId}
                  editingTaskText={editingTaskText}
                  setEditingTaskText={setEditingTaskText}
                  onEdit={handleEditClick}
                  onSave={handleSaveClick}
                  onDelete={handleDeleteClick}
                />
              ))}
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
