// src/components/Auth/Login.tsx
import React from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { LoginContent } from "../../appConstant";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { TITLE, FEATURES, SIGN_IN_WITH_GOOGLE } = LoginContent;

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      if (user?.uid) {
        navigate(`/board/${user.uid}`);
      } else {
        navigate("/board/default");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="bg-white rounded-4 shadow p-5 text-center"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="fw-bold mb-2">{TITLE}</h2>
        <p className="text-muted mb-4">{FEATURES[0]}</p>

        <button
          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogin}
        >
          <i className="bi bi-person-circle"></i>
          {SIGN_IN_WITH_GOOGLE}
        </button>
      </div>
    </div>
  );
};

export default Login;
