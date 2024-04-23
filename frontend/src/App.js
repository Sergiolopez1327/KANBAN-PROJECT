
import './App.css';
import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';

function App() {

  const [tasks, setTasks] = useState({
    todo: [],
    doing: [],
    done: [],
    dropped: []
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    setLoading(false);
    // Send the updated tasks to the backend
    fetch('http://localhost:8080/update_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  }, [tasks]);

  if (loading) {
    return <div>Loading...<h1>here comes an animation</h1></div>;
  } 

  const updateBackend = () => {
    fetch('http://localhost:8080/update_tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tasks),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleEdit = (task, index, status) => {
    const newTask = prompt('Edit task', task);
    if (newTask) {
      setTasks(prevTasks => {
        const newTasks = { ...prevTasks };
        newTasks[status][index] = newTask;
        return newTasks;
      }, updateBackend);  // Call updateBackend after state has been updated
    }
  };

  const handleMoveTask = (task, from, to) => {
    setTasks(prevTasks => {
      // Check that the states exist in the tasks object
      if (!prevTasks[from] || !prevTasks[to]) {
        return prevTasks;
      }
  
      // Remove the task from the current state
      const fromTasks = [...prevTasks[from]];
      const taskIndex = fromTasks.indexOf(task);
      if (taskIndex > -1) {
        fromTasks.splice(taskIndex, 1);
      }
  
      // Add the task to the new state
      const toTasks = [...prevTasks[to], task];
  
      return { ...prevTasks, [from]: fromTasks, [to]: toTasks };
    });
  };

  const handleDelete = (index, status) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      newTasks[status].splice(index, 1);
      return newTasks;
    });
    updateBackend();
  };

  const handleClick = (task, index, status) => {
    setSelectedTask({ task, index, status });
    setShowModal(true);
  };

  const handleAddTask = () => {
    setTasks(prevTasks => ({
      ...prevTasks,
      todo: [...prevTasks.todo, 'New task']
    }));
  };

  return (
    <div className="kanban-board">
      <Popup
          open={showModal}
          closeOnDocumentClick
          onClose={() => setShowModal(false)}
        >
          <div> 
            <h2>Do you want to edit, delete or move this task?</h2>
            <button onClick={() => { setEditing(selectedTask); setShowModal(false); }}>Edit</button>
            <button onClick={() => { handleDelete(selectedTask.index, selectedTask.status); setShowModal(false); }}>Delete</button>
            {selectedTask && selectedTask.status === 'todo' && <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'doing'); setShowModal(false); }}>Move to Doing</button>}
            {selectedTask && selectedTask.status === 'doing' && (
             <>
               <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'todo'); setShowModal(false); }}>Move to Todo</button>
               <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'done'); setShowModal(false); }}>Move to Done</button>
             </>
            )}
            {selectedTask && selectedTask.status === 'done' && (
              <>
                <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'doing'); setShowModal(false); }}>Move to Doing</button>
                <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'dropped'); setShowModal(false); }}>Move to Dropped</button>
              </>
              )}
              {selectedTask && selectedTask.status === 'dropped' && (
                <button onClick={() => { handleMoveTask(selectedTask.task, selectedTask.status, 'done'); setShowModal(false); }}>Move to Done</button>
              )}
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
        </Popup>
      <div className="kanban-column">
            <h2>Todo</h2>
            {tasks.todo.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'todo')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'todo' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'todo')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Doing</h2>
            {tasks.doing.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'doing')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'doing' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'doing')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Done</h2>
            {tasks.done.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'done')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'done' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'done')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <div className="kanban-column">
            <h2>Dropped</h2>
            {tasks.dropped.map((task, index) => (
              <div key={index} className="task-item" onClick={() => handleClick(task, index, 'dropped')}>
                {editing && editing.task === task && editing.index === index && editing.status === 'dropped' ? (
                  <input type="text" defaultValue={task} onBlur={(e) => handleEdit(e.target.value, index, 'dropped')} />
                ) : (
                  task
                )}
              </div>
            ))}
          </div>
          <button id="add-task-button" onClick={handleAddTask}>Add Task</button>
    </div>
  );
}

export default App;