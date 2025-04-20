import { useEffect, useState } from 'react';
import axios from 'axios';
import supabase from '../backend/services/supabaseClient';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 3,
    status: 'to do',
    due: '',
  });

  const [sortMode, setSortMode] = useState('');

  const getAllTasks = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);
      setTasks(data);
      if (error) throw error;
    } catch (error) {
      setError(true);
      throw new Error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  const sortTasks = () => {
    const sorted = [...tasks];
    if (sortMode === 'priority') {
      sorted.sort((a, b) => b.priority - a.priority);
    } else if (sortMode === 'due') {
      sorted.sort((a, b) => new Date(a.due) - new Date(b.due));
    }
    return sorted;
  };

  const addNewTask = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      due: form.due || '',
      user_id: userId,
    };

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([payload])
        .single();
      setTasks((prev) => [...prev, data]);
      setForm({
        title: '',
        description: '',
        priority: 3,
        status: 'to do',
        due: '',
      });
      if (error) throw error;
    } catch (error) {
      alert('Failed to add tasks.');
      throw new Error(error);
    }
  };

  const deleteTask = async (taskId) => {
    const confirm = window.confirm(
      'Are you sure you would like to delete this task?'
    );
    if (!confirm) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
      setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
    } catch (error) {
      alert('Failed to delete task.');
      throw new Error(error);
    }
  };

  if (loading) return <p>Loading in progres...</p>;
  if (error) return <p>There was an error loading the tasks!</p>;

  return (
    <div className='app-container'>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          localStorage.removeItem('userId');
        }}
      >
        Log Out
      </button>
      <div className='task-table-container'>
        <div className='sort-controls'>
          <button onClick={() => setSortMode('priority')}>
            Sort by Priority (High to Low)
          </button>
          <button onClick={() => setSortMode('due')}>
            Sort by Due Date (Soonest First)
          </button>
          <button onClick={() => setSortMode('')}>Default Sorting</button>
        </div>
        <table className='task-table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due</th>
              <th>Remove Task</th>
            </tr>
          </thead>
          <tbody>
            {sortTasks(tasks).map((task) => (
              <tr key={task.task_id}>
                <td>{task.task_id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.due}</td>
                <td>
                  <button
                    className='delete-key'
                    onClick={() => deleteTask(task.task_id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <form onSubmit={addNewTask}>
          <input
            type='text'
            placeholder='Task Name'
            value={form.title}
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type='text'
            placeholder='Description'
            value={form.description}
            required
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: Number(e.target.value) })
            }
          >
            {[1, 2, 3, 4, 5].map((p) => (
              <option key={p} value={p}>
                Priority {p}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value='to do'>To Do</option>
            <option value='in progress'>In Progress</option>
            <option value='done'>Done</option>
          </select>
          <input
            type='date'
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
          />
          <button type='submit'>Add Task</button>
        </form>
      </div>
    </div>
  );
};

export default TaskList;
