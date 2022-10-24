import React, { useState, useEffect } from "react";
import "../static/StorePageStyle.css";
import Container from "react-bootstrap/Container";
import API from "../ultis/API";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProductList from '../components/ProductList'

const StorePage = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  
  let getCategories = async () => {
    try {
      let response = await API.get("categories/");
      setCategories(response.data);
      setActiveTab(response.data[0]?.name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);// eslint-disable-next-line

  return (
    <Container>
    <Tabs
      id="controlled-tab-example"
      unmountOnExit={true}
      mountOnEnter={true}
      activeKey={activeTab}
      onSelect={(key) => setActiveTab(key)}
      className="mb-3"
      fill
    >
      {categories.map((item) => (
        <Tab key={item.id} eventKey={item.name} title={item.name} >
            <ProductList category={item}/>
        </Tab>
      ))}
    </Tabs>
    </Container>
  );
};

export default StorePage;
