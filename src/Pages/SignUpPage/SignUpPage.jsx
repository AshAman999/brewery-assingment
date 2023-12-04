import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Form, Button } from "react-bootstrap";
import '../Login/login.css'
const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password and confirm password
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    // Make API call to sign up
    try {
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // You can redirect to another page or perform other actions after successful sign-up
        console.log("Sign-up successful!");
      } else {
        console.error("Sign-up failed");
        // Handle unsuccessful sign-up, show an error message, etc.
      }
    } catch (error) {
      console.error("Error during sign-up:", error.message);
    }
  };

  return (
    <Container
      className=" container-height"
      style={{ maxWidth: "60%" }}>
      <Row>
        <Col>
          <h1 className="text-center mb-3">Sign Up</h1>
          <Form onSubmit={handleSubmit} className="form_border p-5">
            <Form.Group controlId="formBasicEmail" className="pb-3">
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

            <Form.Group controlId="formBasicConfirmPassword" className="pb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
