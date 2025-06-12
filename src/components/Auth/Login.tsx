
import React from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { result, boardId } = await signInWithGoogle();
      if (result?.user?.uid && boardId) {
        navigate(`/board/${boardId}`);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="bg-white rounded-4 shadow p-5 text-center" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="fw-bold mb-2">Welcome!</h2>
        <p className="text-muted mb-4">Sign in to collaborate on notes</p>
        <button className="btn btn-primary w-100" onClick={handleLogin}>
          <i className="bi bi-google me-2" /> Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
