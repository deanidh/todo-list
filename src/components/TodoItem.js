const TodoItem = (props) => {
  return (
    <li>
      {props.editingTaskId === props.task.id ? (
        <>
          <input type="text" value={props.editingTaskText} onChange={(e) => props.setEditingTaskText(e.target.value)} />
          <div className="todo-list-btn-group">
            <button onClick={() => props.onSave(props.task.id)}>저장</button>
          </div>
        </>
      ) : (
        <>
          {props.task.name}
          <div className="todo-list-btn-group">
            <button onClick={() => props.onEdit(props.task.id, props.task.name)}>수정</button>
            <button onClick={() => props.onDelete(props.task.id)}>삭제</button>
          </div>
        </>
      )}
    </li>
  );
};

export default TodoItem;
