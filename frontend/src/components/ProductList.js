import React,{useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import ProductCard from "../components/ProductCard";
import API from '../ultis/API'

const ProductList = ({ category }) => {
    const[productList, setProductList] = useState([])
    let getProducts = async ()=>{
        try{
            let resp = await API.get(`products/`,{
                params:{
                    category:category.id,
                }
            })
            setProductList(resp.data)
        }catch(error){
            console.log('GET PRODUCTLIST ERROR>>>',error)
        }
    }

    useEffect(()=>{
        getProducts()//eslint-disable-next-line
    },[])

    return (
        <Row xl={4} md={2}>
            {productList.map(item=>(
                <ProductCard key={item.id} product={item} />
            ))}
        </Row>
    );
};

export default ProductList;
