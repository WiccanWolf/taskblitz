import { useEffect, useState } from 'react';
import './App.css';
import TaskList from './components/TaskList.jsx';
import AuthPage from './components/AuthPage.jsx';
import supabase from './backend/services/supabaseClient.js';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        localStorage.setItem('userId', user_id);
      } else {
        localStorage.removeItem('userId');
      }
      setLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          localStorage.setItem('userId', session.user.id);
        } else {
          localStorage.removeItem('userId');
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h1>Taskblitz</h1>
      <h2>Your To-Do List Companion</h2>
      {user ? <TaskList /> : <AuthPage />}
    </>
  );
}

export default App;
