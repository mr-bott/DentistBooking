import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Loader from "../Loader";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
      
        Cookies.set("jwt_token", data.token, { expires: 30 });
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Container">
      {loading ? (
        <div className="Container-loading">
          <p className="loading-message">
            → Our servers rely on free resources, so the first request might
            take up to a minute to awake the servers up. Just give it a moment,
            and we’ll be good to go!
          </p>
          <Loader />
        </div>
      ) : (
        <form className="form" onSubmit={handleSubmit}>
          <h2>Login:</h2>

          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <input
              type="email"
              className="input"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex-column">
            <label>Password</label>
          </div>
          <div className="inputForm">
            <input
              type="password"
              className="input"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex-row">
            <input type="checkbox" id="rememberMe" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button type="submit" className="button-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="p">
            Don't have an account?{" "}
            <span className="span" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </form>
      )}
    </div>
  );
};

export default Login;
