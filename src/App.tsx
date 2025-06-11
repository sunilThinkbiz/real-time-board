import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Auth/Login";
import Home from "./page/Home";

function PrivateRoute({ children }: { children: React.JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// 👇 Component to redirect user to their personal board (e.g., /board/uid)
const RedirectToUserBoard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Navigate to={`/board/${user.uid}`} />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<Login />} />

          {/* Board route with dynamic boardId */}
          <Route
            path="/board/:boardId"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          {/* Redirect any unknown route to user's personal board */}
          <Route
            path="*"
            element={
              <PrivateRoute>
                <RedirectToUserBoard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
