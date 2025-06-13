import React from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  Button,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useBoardUsers } from "../hook/useBoardUsers";
import { NAVBAR } from "../appConstant";
import Avatar from "./Avatar"; 
import { BoardUser } from "../types/type";

interface NavbarProps {
  onLogout: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user, loading } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const users = useBoardUsers(boardId || "default");
  const userList = Object.values(users || {});
  const onlineUsers = userList.filter((u: any) => u.online);

  return (
    <BootstrapNavbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand className="fw-bold fs-4">
          {NAVBAR.NAVBAR_TITLE}
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="align-items-center">

            {/* Online Users Count */}
            <span className="d-flex align-items-center me-3">
              <i className="bi bi-people-fill me-1"></i>
              {onlineUsers.length} {NAVBAR.ONLINE_LABEL}
            </span>

            {/* Online Users Avatars */}
            <div className="d-flex align-items-center me-3">
         {onlineUsers
                .map((u: BoardUser) => (
                <Avatar
                  key={u.uid}
                  user={u}
                  size={NAVBAR.AVATAR_SIZE}
                  onlineDotStyle={NAVBAR.ONLINE_DOT_STYLE}
                />
              ))}
            </div>

            {/* Current user name */}
            {!loading && user && (
              <span className="me-3 text-truncate" style={{ maxWidth: "150px" }}>
                {user.displayName || user.email}
              </span>
            )}

            {/* Logout Button */}
            <Button variant="danger" onClick={onLogout} className="me-2">
              <i className="bi bi-box-arrow-right me-2"></i>
              {NAVBAR.LOGOUT_LABEL}
            </Button>

          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;