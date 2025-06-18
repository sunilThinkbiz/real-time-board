
import React, { useEffect } from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

const Login: React.FC = () => {
 const { user, loading } = useAuth();
const navigate = useNavigate();
const location = useLocation();

const queryParams = new URLSearchParams(location.search);
const inviter = queryParams.get("inviter");

useEffect(() => {
  if (!loading && user) {
    const owner = inviter || user.uid;
    localStorage.setItem("activeBoardOwner", owner);
    navigate(`/dashboard?owner=${owner}`);
  }
}, [user, loading, navigate, inviter]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Redirect handled by useEffect
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="bg-white rounded-4 shadow p-5 text-center" style={{ maxWidth: "420px", width: "100%" }}>
        <h2 className="fw-bold mb-2">Welcome!</h2>
        <p className="text-muted mb-4">Sign in to collaborate on notes</p>
        <button className="btn btn-primary w-100" onClick={handleGoogleSignIn}>
          <i className="bi bi-google me-2" /> Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
