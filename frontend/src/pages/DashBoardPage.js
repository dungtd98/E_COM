import React,{useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

import Collapse from 'react-bootstrap/Collapse';
import API from '../ultis/API'
import moment from "moment";
import '../static/DashboardStyle.css' 

export const OrderSummary = ({item})=>{
    const [orderItem, setOrderItem] = useState('')
    useEffect(()=>{
        let getItemName = async()=>{
            try{
                let resp = await API.get(`/products/${item.product}`)
                setOrderItem(resp.data.name)
            }catch(error){

            }
        }
        getItemName() // eslint-disable-next-line
    },[])
    return (
        <div className='tbody'>
            <div className='col1 col'>{orderItem}</div>
            <div className='col2 col'>{item.quantity}</div>
            <div className='col3 col'>${item.total}</div>
        </div>
    )
}

export const OrderDetail = ({item, toggle, open}) => {
    const [ orderItems, setOrderItems] = useState([])
    const [ address, setAddress] = useState({})
    let getDate = (date)=>{
        return moment(date).utc().format('YYYY-MM-DD')
    }
    let getOrderItem = async ()=>{
        try{
            let resp = await API.get(`/orderitems/`,{
                params:{
                    order:item.id
                }
            })
            setOrderItems(resp.data)
            
        }catch(error){
            console.log(error)
        }
    }

    let getShippingAddress = async ()=>{
        try{
            let resp = await API.get(`/address/${item.address}/`)
            setAddress(resp.data)
        }catch(error){

        }
    }
    useEffect(()=>{
        getOrderItem() 
        getShippingAddress()//eslint-disable-next-line
    },[])

    return (
        <div >
            <li onClick={()=>toggle(item.id)} className={open[item.id]?'tbody active':'tbody'}>
                <div className='col col1 '>order {item.id}</div>
                <div className='col col2 '>{item.order_total_items}</div>
                <div className='col col3 '>${item.order_total_cost}</div>
                <div className='col col4 '>{item.customer}</div>
                <div className='col col5 '>{getDate(item.date_ordered)}</div>
                <div className='col col6 '>{item.complete?'Completed':'InCompleted'}</div>  
            </li>
            <Collapse in={open[item.id]} mountOnEnter unmountOnExit>
                <div className='order-summary'>
                    <div id='order-summary-table'>
                        <h3>Order Summary</h3>
                        <div className='thead'>
                            <div className='col1 col'>Product's Name</div>
                            <div className='col2 col'>Quantity</div>
                            <div className='col3 col'>Total</div>
                        </div>
                        {orderItems.map((item)=>(
                           <OrderSummary key={item.id} item={item} />
                        ))}
                    </div>
                    <div id='order-shipping-address'>
                        <h3>Shipping Address</h3>
                        <div>Number: {address.address}</div>
                        <div>District: {address.district}</div>
                        <div>City: {address.city}</div>
                    </div>
                </div>
            </Collapse>
        </div>
    )
}

const DashBoardPage = () => {
    const [orders, setOrders] = useState([])
    const [open, setOpen] = useState({})
    
    let getOrders = async ()=>{
        try{
            let resp = await API.get(`/orders/`)
            setOrders(resp.data)
            
        } catch(error){
            console.log("GET ORDERS ERROR>>>",error)
        }
    }

    let toggle=(index)=>{
        setOpen((open)=>({
            ...open,
            [index]:!open[index]
        }))
    }

    useEffect(()=>{
        getOrders() //eslint-disable-next-line 
    },[])
    return (
        <Container id='dashboard-page'>
            <h1>ORDER TABLE</h1>
            <Row>
                <ul id='orders-table'>
                    <li className='thead'>
                        <div className='col col1 '></div>
                        <div className='col col2 '>Total Items</div>
                        <div className='col col3 '>Total Cost</div>
                        <div className='col col4 '>Customer</div>
                        <div className='col col5 '>Date Ordered</div>
                        <div className='col col6 '>Status</div>   
                    </li>
                    {orders.map(item=>(
                        <OrderDetail key={item.id} item={item} toggle={toggle} open={open}/>
                    ))}
                </ul>
            </Row>
        </Container>
    )
}

export default DashBoardPage

