import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "./login.css"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make API call to sign in
    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        // You can redirect to another page or perform other actions after successful login
        console.log("Login successful!");
      } else {
        console.error("Login failed");
        // Handle unsuccessful login, show an error message, etc.
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <Container
      className=" container-height"
      style={{ maxWidth: "60%" }}>
     
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
    </Container>
  );
};

export default LoginPage;
