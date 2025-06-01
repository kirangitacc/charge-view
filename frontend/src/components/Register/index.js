import { useState } from 'react';
import { Link} from 'react-router-dom';
import './index.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const onChange = event => {
    const { name, value } = event.target;
    if (name === 'name') setName(value);
    else if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'gender') setGender(value);
    else if (name === 'email') setEmail(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const userData = { name, username, password, gender, email };

    const url = 'http://localhost:5000/register/';

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
        setSuccessMsg(res.message || 'Registration successful!');
        setErrorMsg('');
        setName('');
        setUsername('');
        setPassword('');
        setGender('');
        setEmail('');
      } else {
        setErrorMsg(res.message || 'Registration failed. Please try again.');
        setSuccessMsg('');
      }
    } catch (error) {
      setErrorMsg(error.message || 'An error occurred. Please try again.');
      setSuccessMsg('');
    }
  };

  return (
    <div className="register-con">
      <div className="register-card">
        <h1 className="logo">charge-view-Register</h1>
        <form className="register-form" onSubmit={onSubmit}>
          <label className="register-label" htmlFor="name">NAME</label>
          <input
            className="register-inp"
            type="text"
            id="name"
            name="name"
            onChange={onChange}
            value={name}
            placeholder="Enter your name"
            required
          />
          <label className="register-label" htmlFor="username">USERNAME</label>
          <input
            className="register-inp"
            type="text"
            id="username"
            name="username"
            onChange={onChange}
            value={username}
            placeholder="Enter your username"
            required
          />
          <label className="register-label" htmlFor="password">PASSWORD</label>
          <input
            className="register-inp"
            type="password"
            id="password"
            name="password"
            onChange={onChange}
            value={password}
            placeholder="Enter your password"
            required
          />
          <label className="register-label" htmlFor="gender">GENDER</label>
          <select
            className="register-inp"
            id="gender"
            name="gender"
            onChange={onChange}
            value={gender}
            required
          >
            <option value="">None</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <label className="register-label" htmlFor="email">EMAIL</label>
          <input
            className="register-inp"
            type="email"
            id="email"
            name="email"
            onChange={onChange}
            value={email}
            placeholder="Enter your email"
            required
          />
          <button type="submit" className="register-btn">
            Register
          </button>
          {errorMsg && <p className="register-err-msg">{errorMsg}</p>}
          {successMsg && (
            <Link to="/">
              <p className="register-success-msg">{successMsg} click here to login </p>
            </Link>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;