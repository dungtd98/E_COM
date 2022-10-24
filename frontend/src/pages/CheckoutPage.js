import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Context from "../ultis/Context";
import API from "../ultis/API";
import "../static/CheckoutPageStyle.css";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export const AddressDropDown = ({
  address,
  activeAddress,
  setActiveAddress,
}) => {
  let handleSelectedItem = (key) => {
    if (key === "newAddress") {
      setActiveAddress({
        id: "newAddress",
        address: "",
        district: "",
        city: "",
      });
      return;
    } else {
      let index = address.findIndex((obj) => obj.id === Number(key));
      setActiveAddress(address[index]);
    }
  };

  return (
    <DropdownButton
      variant="primary"
      title={"Address"}
      onSelect={(key) => handleSelectedItem(key)}
    >
      {address.map((item) => (
        <Dropdown.Item
          key={item.id}
          eventKey={item.id}
          className={activeAddress.id === item.id ? "active" : ""}
        >
          {item.address}/{item.district}/{item.city}
        </Dropdown.Item>
      ))}
      <Dropdown.Divider />
      <Dropdown.Item
        eventKey="newAddress"
        onSelect={() => handleSelectedItem("newAddress")}
        className={activeAddress.id === "newAddress" ? "active" : ""}
      >
        Add address
      </Dropdown.Item>
    </DropdownButton>
  );
};

export const OrderSummaryItem = ({ item }) => {
  const [img, setImg] = useState(null);
  const [name, setName] = useState(null);
  let getItemImg = async () => {
    try {
      let resp = await API.get(`products/${item.productID}/`);
      setImg(resp.data.image);
      setName(resp.data.name);
    } catch (error) {
      console.log("GET ORDER SUMMARY ITEM ERROR", error);
    }
  };
  //eslint-disable-next-line
  useEffect(() => {
    getItemImg(); //eslint-disable-next-line
  }, []);
  return (
    <>
      <tr>
        <td>
          <img src={img} alt="" />
        </td>
        <td>{name}</td>
        <td>${item.cost}</td>
        <td>{item.quantity}</td>
      </tr>
    </>
  );
};

const CheckoutPage = () => {
  let { cart, user } = useContext(Context);
  const [bill, setBill] = useState({});
  const [userAddress, setUserAddress] = useState([]);
  const [activeAddress, setActiveAddress] = useState("");

  let getTotal = () => {
    let data = [...cart];
    let totalBillCost =
      data.length > 0
        ? data.map((item) => item.cost).reduce((prev, next) => prev + next)
        : 0;

    let totalItem =
      data.length > 0
        ? data.map((item) => item.quantity).reduce((prev, next) => prev + next)
        : 0;
    setBill({
      cost: totalBillCost,
      items: totalItem,
    });
  };

  let createAddress = async () => {
    try {
      let resp = await API.post("/address/", {
        customer: user.user_id,
        address: activeAddress.address,
        district: activeAddress.district,
        city: activeAddress.city,
      });
      getUserAddress()
      setActiveAddress(resp.data)
    } catch (error) {
      alert("CHECK YOUR ADDRESS INPUT");
      console.log("CREATE ADDRESS ERROR");
    }
  };

  let updateAddress = async () => {
    try {
      API.put(`/address/${activeAddress.id}/`, {
        customer: user.user_id,
        address: activeAddress.address,
        district: activeAddress.district,
        city: activeAddress.city,
      });
      getUserAddress()
    } catch (error) {
      alert("CHECK YOUR ADDRESS INPUT");
      console.log("CREATE ADDRESS ERROR");
    }
  };

  let deleteAddress = async () => {
    try {
      await API.delete(`/address/${activeAddress.id}/`);
      getUserAddress();
      setActiveAddress(userAddress[0] ? userAddress[0] : "newAddress");
    } catch (error) {}
  };
  let convertSubmitData = (arr, orderID)=>{
    let newArr = arr.map(({cost,...attr})=>attr)
    newArr = newArr.map(({productID:product, ...attr})=>({...attr, product}))
    newArr = newArr.map(item=>({...item, order:orderID}))
    return newArr
  }
  let createOrder = async ()=>{
    try{
      let resp = await API.post(`/orders/`,{
        customer:user.user_id,
        address:activeAddress.id
      })
      let data = await convertSubmitData(cart, resp.data.id)
      await API.post(`/orderitems/`,data)
    }catch(error){
      console.log('CREATE ORDER ERROR', error)
    }
  }

  let handleFormSubmit = async () => {
    if (activeAddress.id === "newAddress") {
      createAddress();
    } else {
      updateAddress();
    }
    createOrder();
    getUserAddress();
  };

  let initializeAddress = async ()=>{
    try {
      let resp = await API.get("/address/", {
        params: {
          userID: Number(user?.user_id),
        },
      });
      setUserAddress(resp.data);
      setActiveAddress(resp.data[0] || "newAddress"); 
    } catch (error) {}
  }

  let getUserAddress = async () => {
    try {
      let resp = await API.get("/address/", {
        params: {
          userID: Number(user?.user_id),
        },
      });
      setUserAddress(resp.data);
      
    } catch (error) {}
  };

  let handleChangeAddressInput = (e) => {
    e.preventDefault()

    let targetName = e.target.name;
    if (targetName === "address") {
      setActiveAddress((item) => ({
        ...item,
        address: e.target.value,
      }));
    } else if (targetName === "district") {
      setActiveAddress((item) => ({
        ...item,
        district: e.target.value,
      }));
    } else if (targetName === "city") {
      setActiveAddress((item) => ({
        ...item,
        city: e.target.value,
      }));
    }
  };

  useEffect(() => {
    getTotal();
    initializeAddress();
    
    // eslint-disable-next-line
  }, []);

  return (
    <Container id="checkout-page">
      <Row>
        <Col>
          <div className="form-wrapper">
            <form
              action=""
              id={"delivery-infor-form"}
              onSubmit={handleFormSubmit}
            >
              <div id="use-info">
                <hr />
                <p>Customer Information:</p>
                <hr />
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  required
                  name="name"
                  defaultValue={user.username}
                  id="name"
                  disabled
                />
              </div>
              <div id="shipping-info">
                <hr />
                Shipping Information:{" "}
                <div>
                  <AddressDropDown
                    address={[...userAddress]}
                    activeAddress={{ ...activeAddress }}
                    setActiveAddress={setActiveAddress}
                  />
                </div>
                <hr />
                <div>Number:</div>
                <input
                  type="text"
                  id="address"
                  required
                  name="address"
                  placeholder="Address.."
                  value={activeAddress?.address || ""}
                  onChange={handleChangeAddressInput}
                />
                <br />
                <br />
                <div>District:</div>
                <input
                  type="text"
                  required
                  name="district"
                  placeholder="District..."
                  value={activeAddress?.district || ""}
                  onChange={handleChangeAddressInput}
                />
                <br />
                <br />
                <div>City:</div>
                <input
                  type="text"
                  required
                  name="city"
                  placeholder="City/Province..."
                  value={activeAddress?.city || ""}
                  onChange={handleChangeAddressInput}
                />
              </div>
              <hr />
              <div id="form-btn-wrapper">
                {activeAddress.id !== "newAddress" ? (
                  <div className="btn del-btn" onClick={() => deleteAddress()}>
                    Delete Address
                  </div>
                ) : null}
                <div
                  className="btn submit-btn"
                  onClick={() => handleFormSubmit()}
                >
                  Confirm
                </div>
              </div>
            </form>
          </div>
        </Col>
        <Col>
          <h2>Order Summary</h2>
          <hr />
          <Table id={"order-summary"}>
            <tbody>
              {cart.map((item) => (
                <OrderSummaryItem key={item.productID} item={item} />
              ))}
            </tbody>
          </Table>
          <h3>Total: ${bill?.cost}</h3>
          <h3>Items: {bill?.items}</h3>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
