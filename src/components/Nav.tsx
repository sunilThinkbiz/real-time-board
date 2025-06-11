// src/components/Navbar.tsx
import React from 'react';
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  Badge,
  Button,
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { useBoardUsers } from '../hook/useBoardUsers'; 

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user, loading } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const users = useBoardUsers(boardId || 'default');
  const userList = Object.values(users || {});
  const onlineUsers = userList.filter((u: any) => u.online);
console.log('onlineUsers',onlineUsers)
  return (
    <BootstrapNavbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand className="fw-bold fs-4">
          Collaborative Board
        </BootstrapNavbar.Brand>

        <Nav className="mx-3 d-none d-md-flex align-items-center">
          <span className="text-muted small">
            <i className="bi bi-cloud me-1"></i> Real-time sync
          </span>
        </Nav>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end"
        >
          <Nav className="align-items-center">

            {/*  Online Users Count */}
            <span className="d-flex align-items-center me-3">
              <i className="bi bi-people-fill me-1"></i> {onlineUsers.length} online
            </span>

            {/*  Avatars with Green Circle */}
            <div className="d-flex align-items-center me-3">
              {onlineUsers.map((u: any) => (
                <div key={u.uid} className="position-relative me-2">
                  <img
                    src={u.photoURL || ''}
                    alt={u.displayName || ''}
                    title={u.displayName || ''}
                    className="rounded-circle"
                    style={{
                      width: '32px',
                      height: '32px',
                      objectFit: 'cover',
                      border: '2px solid #dee2e6',
                    }}
                  />
                  <span
                    className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle"
                    style={{
                      width: '10px',
                      height: '10px',
                    }}
                  ></span>
                </div>
              ))}
            </div>

            {/* ✅ User Display Name */}
            {!loading && user && (
              <span className="me-3 text-truncate" style={{ maxWidth: '150px' }}>
                {user.displayName || user.email}
              </span>
            )}

            {/* ✅ Logout Button */}
            <Button variant="danger" onClick={onLogout} className="me-2">
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
