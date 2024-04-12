import React, { useState } from 'react';
import './App.css';

const initialTasks = {
  todo: ['Task 1', 'Task 2'],
  doing: ['Task 3'],
  done: ['Task 4'],
  dropped: ['Task 5']
};

function App() {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (id, from, to) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      const taskIndex = newTasks[from].findIndex(task => task === id);
      const task = newTasks[from][taskIndex];

      newTasks[from].splice(taskIndex, 1);
      newTasks[to].push(task);

      return newTasks;
    });
  };

  return (
    <div className="App">
      <div className="kanban-board">
        {Object.entries(tasks).map(([column, tasks]) => (
          <div key={column} className="kanban-column">
            <h2>{column.toUpperCase()}</h2>
            {tasks.map((task, index) => (
              <div key={index} className="kanban-task">
                {task}
                <div>
                  {column !== 'done' && <button onClick={() => moveTask(task, column, 'done')}>Mark as done</button>}
                  {column !== 'dropped' && <button onClick={() => moveTask(task, column, 'dropped')}>Drop</button>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;