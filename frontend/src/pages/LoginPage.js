import React from "react";
import { useContext } from "react";
import "../static/LoginPage.css";
import { Link } from "react-router-dom";
import Context from "../ultis/Context";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
const LoginPage = () => {
  let { loginUser } = useContext(Context);
  return (
    <Container id={"login-page"}>
      <h1>Login</h1>
      <Form id="login-form" onSubmit={loginUser}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="text" name="username" placeholder="Username..." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            name="password"
            placeholder="Password..."
          />
        </Form.Group>
        <div className="form-footer">
          <span>
            Don't have Account? <Link to="/register">Register</Link>
          </span>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginPage;
