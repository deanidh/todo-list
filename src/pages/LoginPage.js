import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/reducers/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const auth = getAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch(
          login({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
          })
        );
        navigate('/todo');
        console.log('로그인 성공: ', userCredential.user.uid, userCredential.user.email);
      })
      .catch((error) => {
        console.log('로그인 실패: ', error);
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/todo');
    }
  }, []);

  return (
    <div className="frame">
      <div className="container">
        <div className="title">LOGIN</div>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="button" onClick={handleLogin}>
          로그인
        </div>
        <div className="button" onClick={() => navigate('/signup')}>
          회원가입
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
