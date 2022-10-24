import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import API from "../ultis/API";
import Card from "react-bootstrap/Card";

import "../static/ProductDetailPage.css";
import { BsCheckCircleFill } from "react-icons/bs";
import Context from "../ultis/Context";

const ItemDetailPage = () => {
  let { productID } = useParams();
  const [product, setProduct] = useState({});
  const [detail, setDetail] = useState([]);
  const [quantity, setQuantity] = useState(1);
  let {cart, addCartItem } = useContext(Context);
  let getProduct = async () => {
    try {
      let resp = await API.get(`products/${productID}/`);
      setProduct(resp.data);
      setDetail(detailHandler(resp.data.decription));
    } catch (error) {
      console("GET PRODUCT DETAIL ERR>>>", error);
    }
  };
  let detailHandler = (detail) => {
    return detail?.split("/");
  };

  let increaseQuantity = () => {
    setQuantity((q) => Number(q) + 1);
  };

  let decreseQuantity = () => {
    if (quantity === 1) {
      setQuantity(1);
      return;
    }
    setQuantity((q) => Number(q) - 1);
  };

  let validateAmountInput = (e) => {
    if (!/[0-9\b\0]/.test(e.key)) {
      e.preventDefault();
    }
  };

  let handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value))
    console.log("CHANGE AMOUNT");
  };

  useEffect(() => {
    getProduct();// eslint-disable-next-line
  }, []); 

  return (
    <Container id={"item-detail"}>
      <Row md={2}>
        <Col className={"item-image"}>
          <Card style={{ width: "28rem" }}>
            <Card.Img variant="top" src={product?.image} />
            <Card.Body>
              <Card.Title>{product?.name}</Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col className={"item-infor"}>
          <Card style={{ width: "28rem" }}>
            <Card.Body>
              <Card.Title>{product?.name}</Card.Title>
              <Card.Title>Price: ${product?.price}</Card.Title>
              <button className="minus" onClick={decreseQuantity}>
                -
              </button>
              <input
                type="text"
                onKeyPress={(e) => validateAmountInput(e)}
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button className="plus" onClick={increaseQuantity}>
                +
              </button>
              <button className="add-cart-btn" onClick={()=>addCartItem(product, quantity, cart)}>Add to cart</button>
            </Card.Body>
          </Card>
          <Card style={{ width: "28rem"}} id={'item-detail-log'}>
            <Card.Body>
              {detail?.map((item, index) => (
                <Card.Text key={index}>
                  <BsCheckCircleFill /> {item}
                </Card.Text>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDetailPage;
