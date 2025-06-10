// src/components/Navbar.tsx
import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // adjust if path differs

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user, loading } = useAuth();

  return (
    <BootstrapNavbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand href="#home" className="fw-bold fs-4">
          Collaborative Board
        </BootstrapNavbar.Brand>

        <Nav className="mx-3 d-none d-md-flex align-items-center">
          <span className="text-muted small">
            <i className="bi bi-cloud me-1"></i> Status Placeholder
          </span>
        </Nav>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <span className="d-flex align-items-center me-3">
              <i className="bi bi-people-fill me-1"></i> 0 online
            </span>

            <div className="d-flex me-3">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="rounded-circle me-1"
                  style={{ width: '32px', height: '32px' }}
                />
              ) : (
                <div
                  className="rounded-circle d-flex justify-content-center align-items-center me-1"
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#ccc',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}
                >
                  {user?.displayName?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <Badge
                bg="secondary"
                className="ms-1 rounded-circle d-flex justify-content-center align-items-center"
                style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}
              >
                +0
              </Badge>
            </div>

            {!loading && user && (
              <span className="me-3">{user.displayName || user.email}</span>
            )}

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
