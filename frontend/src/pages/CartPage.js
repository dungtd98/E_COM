import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../static/CartPageStyle.css";
import Context from "../ultis/Context";
import { BsFillXCircleFill } from "react-icons/bs";
import API from "../ultis/API";

export const CartItem = ({ item }) => {
  let { cart, 
    changeCartItemQuantity, 
    removeCartItem } = useContext(Context);
  const [cartItem, setCartItem] = useState({});
  const [cartItemQuantity, setCartItemQuantity] = useState(item.quantity);
  const [cartItemCost, setCartItemCost] = useState(item?.cost);
  let getCartItem = async () => {
    try {
      let resp = await API.get(`products/${item.productID}/`);
      setCartItem(resp.data);
    } catch (error) {
      console.log("GET CARTITEM ERROR>>>", error);
    }
  };

  let increaseQuantity = () => {
    setCartItemQuantity((a) => a + 1);
  };

  let decreaseQuantity = () => {
    if (cartItemQuantity === 1) {
      setCartItemQuantity(1);
      return;
    }
    setCartItemQuantity((a) => a - 1);
  };

  let handleChangeQuantity = () => {
    if (cartItem.price) {
      let cost = Number(cartItem?.price) * Number(cartItemQuantity);
      setCartItemCost(cost);
      changeCartItemQuantity(cartItem, cartItemQuantity, cost, cart);
    }
  };

  

  useEffect(() => {
    getCartItem();//eslint-disable-next-line
  }, []); 

  useEffect(() => {
    handleChangeQuantity();//eslint-disable-next-line
  }, [cartItemQuantity]);
  return (
    <tr>
      <td className="col1">
        <img src={cartItem.image} alt="" />
      </td>
      <td className="col2">{cartItem.name}</td>
      <td className="col3">${cartItem.price}</td>
      <td className="col4">
        <button className="minus-btn" onClick={decreaseQuantity}>
          -
        </button>
        <input
          type="text"
          value={cartItemQuantity}
          disabled
          className="item-quantity"
        />
        <button className="plus-btn" onClick={increaseQuantity}>
          +
        </button>
      </td>
      <td className="col5">${cartItemCost}</td>
      <td className="col6">
        <BsFillXCircleFill onClick={()=>removeCartItem(item)}/>
      </td>
    </tr>
  );
};

const CartPage = () => {
  let navigate = useNavigate();
  let { cart } = useContext(Context);
  const [billCost, setBillCost] = useState(0);

  let calculateBillCost = () => {
    let data = [...cart];
    let totalBillCost = (data.length>0)?data
      .map((item) => item.cost)
      .reduce((prev, next) => prev + next):0;
    setBillCost(totalBillCost);
  };

  useEffect(()=>{
    calculateBillCost() //eslint-disable-next-line
  },[cart])


  return (
    <Container>
      <Row>
        <Col>
          <Button variant="outline-dark" onClick={() => navigate("/")}>
            {" "}
            <BsArrowLeft /> Continue Shopping
          </Button>
          <br />
          <br />
          <Table>
            <thead>
              <tr>
                <th>Items:{cart.length}</th>
                <th>Total:${billCost}</th>
                <th>
                  <Button
                    variant="success"
                    onClick={() => navigate("/checkout")}
                    id="checkout-btn"
                  >
                    Checkout
                  </Button>
                </th>
              </tr>
            </thead>
          </Table>
          <Table id={"cart-item-table"} bordered>
            <thead>
              <tr>
                <th className="col1"></th>
                <th className="col2">Item</th>
                <th className="col3">Price</th>
                <th className="col4">Quantity</th>
                <th className="col5">Total</th>
                <th className="col6">Delete</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <CartItem key={item.productID} item={item} />
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
