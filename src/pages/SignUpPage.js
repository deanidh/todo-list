import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('회원가입 성공: ', user);
        alert('회원가입 성공');
        navigate('/');
      })
      .catch((error) => {
        console.log('회원가입 실패: ', error);
      });
  };

  return (
    <div className="frame">
      <div className="container">
        <div className="title">SIGNUP</div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div onClick={handleSignUp}>회원가입</div>
        <div onClick={() => navigate('/')}>돌아가기</div>
      </div>
    </div>
  );
};

export default SignUpPage;
