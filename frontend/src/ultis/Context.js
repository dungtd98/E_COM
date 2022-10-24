import React, {useState, createContext, useEffect} from 'react'
import API from './API'
import jwt_decode from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom'
const Context = createContext()

export const ContextProvider = ({children})=>{
    let localCart = localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    let navigate = useNavigate()
    let location = useLocation()
    const from = location.state?location.state:"/";
    const [cart, setCart] = useState(()=>localCart)
    const [searchData, setSearchData] = useState('')
    let localAuthToken = localStorage.getItem("authToken")
        ? JSON.parse(localStorage.getItem("authToken"))
        : null;
    let localAuthUser = localStorage.getItem("authToken")
        ? jwt_decode(localStorage.getItem("authToken"))
        : null;
    const [authToken, setAuthToken] = useState(() => localAuthToken);
    const [user, setUser] = useState(() => localAuthUser);
    const [loading, setLoading] = useState(true);

    let saveCart2Local = (cart)=>{
        localStorage.setItem('cart', JSON.stringify(cart))
    }

    let addCartItem = (item, quantity, cart)=>{
        
        let data = [...cart];
        let cost = Number(item.price)*Number(quantity)
        let isFound = data.some(el=>el.productID===item.id)
        if(isFound){
            let itemIndex = data.findIndex(obj=>obj.productID===item.id)
            data[itemIndex].cost += cost;
            data[itemIndex].quantity += quantity;
        } else if(!isFound){
            data.push({
                productID:item.id,
                quantity:quantity,
                cost:cost
            })
        }
        console.log('ITEM ADDED', data)
        setCart(data)
        saveCart2Local(data)
    }

    let changeCartItemQuantity = (item, quantity, cost, cart)=>{
        let data = [...cart];
        let itemIndex = data.findIndex(obj=>obj.productID===item.id)
        data[itemIndex].cost = cost;
        data[itemIndex].quantity = quantity;
        console.log('ITEM Updated', data)
        setCart(data)
        saveCart2Local(data)
    }

    let removeCartItem = (item)=>{
        console.log("DELETE ")
        let data = [...cart]
        let itemIndex = data.findIndex(obj=>obj.productID===item.id)
        data.splice(itemIndex, 1); 
        setCart(data)
        saveCart2Local(data)
    }

    let loginUser = async (e)=>{
        e.preventDefault()
        try{
            let resp = await API.post("token/",{
                username:e.target.username.value,
                password:e.target.password.value
            })
            setAuthToken(resp.data)
            setUser(jwt_decode(resp.data.access))
            localStorage.setItem('authToken', JSON.stringify(resp.data))
            if (jwt_decode(resp.data.access).is_admin){
                navigate('/dashboard')
                return
            }
            navigate(from)
            
            
        }catch(error){
            alert('SOMETHING WRONG, LOGIN FAILED!!!')
            console.log('LOGIN ERROR>>>', error)
        }
    }
    let registerUser = async (e)=>{
        e.preventDefault()
        try{
            await API.post("users/",{
                username:e.target.username.value,
                password:e.target.password.value
            })
            navigate('/login')
        }catch(error){
            alert('SOMETHING WRONG, REGISTER FAILED!!!')
        }
    }
    let logoutUser = async(e)=>{
        setUser(null);
        setAuthToken(null);
        localStorage.removeItem("authToken");
        navigate("/login");
    }

    const updateToken = async () => {
        try {
          let response = await API.post("token/refresh/", {
            refresh: authToken.refresh,
          });
          localStorage.setItem("authToken", JSON.stringify(response.data));
          setAuthToken(response.data);
          setUser(jwt_decode(response.data.access));
        } catch (error) {}
    
        if (loading) {
          setLoading(false);
        }
      };

    useEffect(() => {
    if (loading) {
        updateToken();
    }

    let interval = setInterval(() => {
        if (authToken) {
        updateToken();
        }
    }, 1000 * 60 * 4);
    return () => clearInterval(interval);// eslint-disable-next-line
    }, [authToken, loading]);

    const contextData = {
        user,
        loginUser,
        logoutUser,
        registerUser,
        cart, 
        setCart, 
        addCartItem, 
        changeCartItemQuantity,
        removeCartItem,
        setSearchData,
        searchData
    }
    return(
        <Context.Provider value={contextData}>
            {loading?<p>Loading</p>:children}
        </Context.Provider>
    )
}

export default Context