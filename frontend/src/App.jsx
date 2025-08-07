import "./App.css"
import Navbar from "./components/Navbar"
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import "./index.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthThunk } from "./features/authSlice";
import ItemDetail from "./components/ItemDetail";
import AddItem from "./pages/AddItem";


export default function App()
{
  const dispatch = useDispatch();
    useEffect(()=>{
      dispatch(checkAuthThunk());
    },[]);

    
    return(
      <>
      <BrowserRouter>
        <AppContent/>
       </BrowserRouter>
      </>
      
    )
}

function AppContent()
{
  //const location = useLocation();
  return(

    <div>
      {/* {(location.pathname==="/" || location.pathname==="/itemId/:itemId" || location.pathname==="/profile") && <Navbar/>} */}
      <Navbar/>

     <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/profile" element={<MyProfile/>}/>
    <Route path="/signup" element={<SignUp/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/itemId/:itemId" element={<ItemDetail/>}/>
    <Route path="/addItem" element={<AddItem/>} />

     </Routes>
    </div>

    
  )
    
     
}


