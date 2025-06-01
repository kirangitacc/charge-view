import  { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onChangeUsername = (e) => setUsername(e.target.value);
  const onChangePassword = (e) => setPassword(e.target.value);

  const onSubmit = async (event) => {
    event.preventDefault();

    const userData = { username, password };
    const url = 'https://charge-view.onrender.com/login/';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    };

    try {
      const req = await fetch(url, options);
      const res = await req.json();

      if (req.ok) {
        const jwtToken = res.jwtToken;
        const userId = res.userId;
        localStorage.setItem('jwt_token', jwtToken);
        localStorage.setItem('user_id', userId);
        navigate('/home');
      } else {
        setErrorMsg(res.error_msg || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMsg('Wrong username or password');
    }
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-con">
      {/* Left container with heading and image */}
      <div className="login-left">
        <h1 className="login-heading">Welcome to Charge View</h1>
        <p className="login-subheading">
          Manage and monitor EV charging stations with ease
          Add, edit, or remove chargers and view them on an interactive map.
          Secure access for registered users only.
          Real-time status and details for every charger
          Fast, simple, and reliable charging management for everyone.
        </p>
        <img
          src="https://i.im.ge/2025/05/31/vBaAc0.charge.png" // Place your image in public/ as ev-login.png or update the path
          alt="EV Charging"
          className="login-img"
        />
      </div>
      {/* Right container with login card */}
      <div className="login-card">
        <div className="appLogo">Charge View</div>
        <h2 className="login-instructions-heading" >
          Welcome! Please Login or Register
        </h2>
        <p className="login-instructions" >
         New users need to register before accessing the platform.<br />
         If you are already a user, please login below.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label className="label" htmlFor="user">USERNAME</label>
          <input
            className="inp"
            type="text"
            id="user"
            onChange={onChangeUsername}
            value={username}
            placeholder="Enter your username"
          />

          <label className="label" htmlFor="pass">PASSWORD</label>
          <input
            className="inp"
            type="password"
            id="pass"
            onChange={onChangePassword}
            value={password}
            placeholder="Enter your password"
          />

          <div className="btn-row">
            <button type="submit" className="login-btn">Login</button>
            <button type="button" className="register-btn2" onClick={onRegisterClick}>
              Register
            </button>
          </div>

          {errorMsg && <p className="err-msg">{errorMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
