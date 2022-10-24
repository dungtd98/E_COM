import React,{useContext, useEffect, useState} from 'react'
import Context from '../ultis/Context'
import API from '../ultis/API'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import ProductCard from "../components/ProductCard";

const ProductListPage = () => {
    let{searchData} = useContext(Context)
    const [productList, setProductList] = useState([])
    let getData = async ()=>{
        try{
            let resp = await API.get(`/products/?search=${searchData}`)
            setProductList(resp.data)
            console.log(resp.data)
        }catch(error){

        }
    }
    useEffect(()=>{
        getData() //eslint-disable-next-line
    },[searchData])
    return (
        <Container id='products-list-page'>
            <Row xl={4} md={2}>
                {productList.length>0?
                productList.map((item, index)=>(
                    <ProductCard key={index} product={item}/>
                ))
                :<h1>No product is found</h1>}
            </Row>
        </Container>
    )
}

export default ProductListPage