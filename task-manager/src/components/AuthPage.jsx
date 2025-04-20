import { useState } from 'react';
import supabase from '../backend/services/supabaseClient';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
  };

  return (
    <div className='auth-container'>
      <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Your Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type='submit'>{isLogin ? 'Log In' : 'Sign Up'}</button>
      </form>
      <p className='login-query' onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'No account? Sign up for free.' : 'Have an account? Log in.'}
      </p>
    </div>
  );
};

export default AuthPage;
