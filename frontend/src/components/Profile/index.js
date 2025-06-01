import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./index.css";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("user_id");
      const jwtToken = localStorage.getItem("jwt_token");
      const url = `http://localhost:5000/user/${userId}`;
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: "GET",
        mode: "cors",
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="profile-card">
      <h2>User Profile</h2>
      <div className="profile-avatar">{userDetails.username.charAt(0)}</div>
      <div className="profile-details">
        <div className="profile-row">
          <label>Username:</label>
          <span className="sp1">{userDetails.username}</span>
        </div>
        <div className="profile-row">
          <label>Email:</label>
          <span className="sp2">{userDetails.email}</span>
        </div>
        <div className="profile-row">
          <label>Gender:</label>
          <span className="sp3">{userDetails.gender}</span>
        </div>
      </div>

      {/* Logout & Home Buttons inside Link */}
      <div className="button-container">
        <Link to="/">
          <button className="logout-btn">Logout</button>
        </Link>
        <Link to="/home">
          <button className="home-btn">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
