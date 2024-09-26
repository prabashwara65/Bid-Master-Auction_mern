import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"; // Helps with React Router integration

function Navigation() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#">Dashboard</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/mainDashboard">
            <Nav.Link>Dashboard</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/AddAdvertisement">
            <Nav.Link>Add Advertisement</Nav.Link>
          </LinkContainer>

          <LinkContainer to="/AdvertisementDetails">
            <Nav.Link>Advertisement Details</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
