import { useEffect, useState } from "react";
import "./ToDoList.css";

const ToDoList = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("todoTasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [warn, setWarn] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
      setInputValue("");
      setWarn(false);
    } else {
      setWarn(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTask();
  };

  const toggleChecked = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const activeTasksCount = tasks.filter((task) => !task.completed).length;

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  return (
    <div className="todo-container">
      <h1>Мой To-DO List</h1>

      <form onSubmit={handleSubmit} className="input-menu">
        <input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (warn) setWarn(false);
          }}
          placeholder="Введите текст задачи..."
          type="text"
          className="task-input"
        />
        <button type="submit" className="add-btn">
          Добавить
        </button>

        {warn && <p className="warning">Нельзя добавить пустую задачу</p>}
      </form>

      <div className="filter-container">
        <div className="filter-buttons">
          <button
            className={filter === "all" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("all")}
          >
            Все
          </button>
          <button
            className={filter === "active" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("active")}
          >
            Активные
          </button>
          <button
            className={
              filter === "completed" ? "filter-btn active" : "filter-btn"
            }
            onClick={() => setFilter("completed")}
          >
            Завершенные
          </button>

          <button
            className="sort-btn"
            onClick={toggleSortOrder}
            title={sortOrder === "newest" ? "Сначала новые" : "Сначала старые"}
          >
            {sortOrder === "newest" ? "▼ Дата" : "▲ Дата"}
          </button>
        </div>

        <div className="tasks-info">
          <span>Осталось задач: {activeTasksCount}</span>
          {tasks.some((task) => task.completed) && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              Очистить завершенные
            </button>
          )}
        </div>
      </div>

      <ul className="tasks-list">
        {sortedTasks.map((task) => (
          <li key={task.id} className="task-item">
            <input
              onChange={() => toggleChecked(task.id)}
              checked={task.completed}
              type="checkbox"
              className="task-checkbox"
            />
            <span
              className={task.completed ? "task-text completed" : "task-text"}
            >
              {task.text}
            </span>
            <button onClick={() => removeTask(task.id)} className="delete-btn">
              X
            </button>
          </li>
        ))}

        {sortedTasks.length === 0 && (
          <li className="empty-message">
            {filter === "all"
              ? "Нет задач"
              : filter === "active"
              ? "Нет активных задач"
              : "Нет завершенных задач"}
          </li>
        )}
      </ul>
    </div>
  );
};

export default ToDoList;
