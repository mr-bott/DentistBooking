
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const SignUpDoctor = () => {
  const [step, setStep] = useState(1); // 1: form, 2: enter OTP
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const role = "user";
  const navigate = useNavigate();

  const url = process.env.REACT_APP_BACKEND_URL;

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${url}/send_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: email }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setStep(2); // move to OTP step
      } else {
        setError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      setLoading(false);
      setError("Error sending OTP. Try again.");
    }
  };

  // Step 2: Verify OTP and sign up
  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const verifyRes = await fetch(`${url}/verify_otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gmail: email, otp }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setLoading(false);
        setError(verifyData.error || "OTP verification failed");
        return;
      }

      const signupRes = await fetch(`${url}/api/register/dentist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password}),
      });

      const signupData = await signupRes.json();
      setLoading(false);

      if (signupRes.ok) {
        navigate("/login");
      } else {
        setError(signupData.message || "Signup failed");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong during signup.");
    }
  };

  return (
    <div className="Container">
      {loading ? (
        <div className="Container-loading">
          <p className="loading-message">
            → Our servers rely on free resources, so the first request might
            take up to a minute to wake up the servers. Just give it a moment.
          </p>
          <Loader />
        </div>
      ) : (
        <form
          className="form"
          onSubmit={step === 1 ? handleSendOtp : handleVerifyAndSignup}
        >
          <h2>Sign Up</h2>

          {error && <p className="error">{error}</p>}

          {step === 1 && (
            <>
              <label>Name</label>
              <div className="inputForm">
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <label>Email</label>
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

              <label>Password</label>
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

              <label>Confirm Password</label>
              <div className="inputForm">
                <input
                  type="password"
                  className="input"
                  placeholder="Confirm your Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="button-submit">
                Send OTP
              </button>
              <p className="p">
            Already have an account?{" "}
            <span className="span" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
            </>
          )}

          {step === 2 && (
            <>
              <label>Enter OTP sent to your Email</label>
              <div className="inputForm">
                <input
                  type="text"
                  className="input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="button-submit">
                Verify OTP & Sign Up
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default SignUpDoctor;
