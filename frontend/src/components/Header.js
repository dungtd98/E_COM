import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate,useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useContext } from "react";
import Context from "../ultis/Context";

function Header() {
  let { cart, user, logoutUser, setSearchData } = useContext(Context);
  let navigate = useNavigate();
  let location = useLocation();
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="">
          Ecom
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={NavLink} to="/">
              Store
            </Nav.Link>
            
            <Nav.Link as={NavLink} to='/checkout'>
              Checkout
            </Nav.Link>
          </Nav>
          <Form className="d-flex" id='search-bar'>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              name='search'
              onChange={(e)=>setSearchData(e.target.value)}
            />
            <Button variant="outline-success" onClick={()=>navigate('/products')}>Search</Button>
          </Form>
          <Nav>
            {user ? (
              <>
              <Nav.Link >Welcome {user.username}!!!</Nav.Link>
              <Button
                variant="warning"
                id="login-btn"
                onClick={logoutUser}
              >
                Logout
              </Button>
              </>
            ) : (
              <Button
                variant="warning"
                id="login-btn"
                onClick={() => {
                  navigate("/login",{
                    state:location.pathname
                  })
      
                }}
              >
                Login
              </Button>
            )}
            <Nav.Link as={NavLink} to="/cart">
              <FaShoppingCart id="cart-icon" />
            </Nav.Link>
            <p id="cart-total">{cart.length}</p>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
