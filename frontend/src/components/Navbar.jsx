
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import userIcon from "../assets/people.png"
import addIcon from "../assets/add.png"
import SearchBar from "./SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { authLogoutThunk } from "../features/authSlice";


function Navbar()
{
    const navigate = useNavigate();
    const [showDropDown,setShowDropDown]=useState(false);
    const isLoggedIn = useSelector((state)=>{
        return state.auth.isLoggedIn
    })
    console.log("Navbar isLoggedIn:", isLoggedIn);
    const user = useSelector((state)=>{
        return {
            name :state.auth.firstName+" "+state.auth.lastName,
            email:state.auth.email
        }
    })
    const dispatch=useDispatch();

    const handleLogoutClick = ()=>{
        dispatch(authLogoutThunk());
    }



    return (
        <div>
        
            <nav className="bg-white border-gray-200 shadow-sm">

                <div className="px-2 py-1 flex justify-between items-center">

                    <div className="font-bold text-xl">
                        <Link to="/">
                         olx LNMIIT
                        </Link>
                       </div>


                    {location.pathname==="/" && <div>
                        <SearchBar/>
                    </div>}


                    <div className="flex justify-between">

                        <div className="px-2">
                            
                            {
                                isLoggedIn?<div>

                                    <button  onClick={()=>{
                                        setShowDropDown(!showDropDown);
                                    }} className="flex items-center space-x-2 rounded-full bg-white p-1 focus:ring-2 focus:ring-gray-300 cursor-pointer">

                                    <img src={userIcon} className="h-8 w-8 rounded-full"  alt="User Avatar"/>
                                    

                                    </button>

                                    {
                                        showDropDown&&(
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-sm z-10 " >
                                                
                                                <div className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>

                                                </div>

                                                <ul className="py-1 text-sm text-gray-700">
                                                    <li>
                                                        {
                                                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                                                                My Profle
                                                            </Link>
                                                        }
                                                    </li>

                                                    <li>
                                                        <button onClick={handleLogoutClick} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer">

                                                            Log out

                                                        </button>
                                                    </li>


                                                </ul>

                                            </div>
                                        )
                                    }
                                    

                                </div>


                                :<div className="text-blue-600 font-semibold py-3 pr-3">

                                    <Link to="/login">
                                        Log in
                                    </Link>

                                
                                    <button >
                                       
                                    </button>
                                

                                </div>
                            }
                            
                            
                        </div>

                        <span className="relative inline-flex items-center px-4 py-2 font-semibold text-blue-800 bg-white rounded-full overflow-hidden group shadow-sm">


                                <button onClick={()=>{
                                    navigate("/addItem");
                                }} className="relative z-10 flex items-center space-x-2 cursor-pointer">
                                    <img src={addIcon} alt="plus" className="h-4 w-4" />
                                <span className="text-bold font-semibold">SELL</span>

    
                            </button>

                            </span>

                        


                    </div>
                    

                </div>

      
            </nav>

            

        </div>
    )
}



export default Navbar;