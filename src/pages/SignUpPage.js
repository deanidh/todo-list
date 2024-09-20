import { useState } from 'react';
import { auth } from '../utils/firebase/init_firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('회원가입 성공: ', user);
        navigate('/');
        alert('회원가입 성공');
      })
      .catch((error) => {
        console.log('회원가입 실패: ', error);
      });
  };

  return (
    <div className="frame">
      <div className="login-container">
        <div className="login-title">SIGNUP</div>
        <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="login-button" onClick={handleSignUp}>
          회원가입
        </div>
        <div className="login-button" onClick={() => navigate('/')}>
          돌아가기
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
