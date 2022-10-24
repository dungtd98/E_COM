import { 
  Routes, Route
 } from 'react-router-dom'
import './App.css';
import Header from './components/Header';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ItemDetailPage from './pages/ItemDetailPage';
import StorePage from './pages/StorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashBoardPage from './pages/DashBoardPage';
import ProtectedRoute,{LoginRestrict, AdminRestrict} from './ultis/ProtectedRoute';
import ProductListPage from './pages/ProductListPage'

function App() {
  return ( 
      <div className='app'>
        <Header/>
        <Routes>
          <Route path='/' element={<StorePage/>} />
          <Route path='/cart' element={<CartPage/>} />
          <Route path='/products' element={<ProductListPage/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path='/checkout' element={<CheckoutPage/>} />
          </Route>
          <Route path='/product/:productID/' element={<ItemDetailPage/>} />
          <Route element = {<LoginRestrict/>}>
            <Route path='/login' element={<LoginPage/>} />
            <Route path='/register' element={<RegisterPage/>} />
          </Route>
          <Route element={<AdminRestrict/>}>
            <Route path='/dashboard' element={<DashBoardPage/>} />
          </Route>
          
        </Routes>
      </div>
  );
}

export default App;
