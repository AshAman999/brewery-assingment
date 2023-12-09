import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./login.css";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        console.log("Login successful!");
        navigate("/");
      } else {
        console.error("Login failed");
        alert("Invalid email or password"); // Show an error message
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      alert("An error occurred during login"); // Show an error message
    }
  };

  const handleRegister = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <Container className=" container-height" style={{ maxWidth: "60%" }}>
      <Row>
        <h1 className="text-center pb-3">Login</h1>
        <Form onSubmit={handleSubmit} className="form_border p-5">
          <Form.Group controlId="formBasicEmail" className="pb-2">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="pb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <p>Not yet registered? Click here to register.</p>
          <Button variant="link" onClick={handleRegister}>
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
