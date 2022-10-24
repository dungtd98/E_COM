import React from "react";
import { useContext } from "react";
import '../static/RegisterPage.css'
import { Link } from 'react-router-dom'
import Context from "../ultis/Context";
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const RegisterPage = () => {
  let { registerUser } = useContext(Context);
  return (
    <Container id={"register-page"}>
      <h1>REGISTER</h1>
      <Form id='register-form' onSubmit={registerUser}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        
        <Form.Control type="text" name="username" placeholder="Username..." />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Control type="password" name='password' placeholder="Password..." />
      </Form.Group>
      <div className="form-footer">
        <span>
            Already have Account? <Link to='/login'>Login</Link>
        </span>
        <Button variant="primary" type="submit">
            Register
        </Button>
      </div>
      
    </Form>
    </Container>
  );
};

export default RegisterPage;
