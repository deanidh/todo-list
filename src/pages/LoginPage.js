import { useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('로그인 성공: ', user);
        navigate('/todo');
      })
      .catch((error) => {
        console.log('로그인 에러: ', error);
      });
  };

  return (
    <div className="frame">
      <div className="login-container">
        <div className="login-title">LOGIN</div>
        <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="login-button" onClick={handleLogin}>
          로그인
        </div>
        <div className="login-button" onClick={() => navigate('/signup')}>
          회원가입
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
