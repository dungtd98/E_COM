import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import React,{useContext} from "react";
import { useNavigate } from "react-router-dom";
import Context from "../ultis/Context";

const ProductCard = ({product}) => {
  let navigate = useNavigate();
  let {addCartItem, cart} = useContext(Context)
  return (
    <Col >
      <Card style={{ width: "18rem" }}>
        <Card.Img variant="top" src={product.image} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>
            {product.decription}
          </Card.Text>
          <Button variant="outline-secondary" className="add-btn" onClick={()=>addCartItem(product,1,cart)}>
            Add to cart
          </Button>
          <Button
            variant="outline-success"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            View
          </Button>
          <h4 className="item-price">${product.price}</h4>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductCard;
