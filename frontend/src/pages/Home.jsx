import Card from "../components/Card";
import { useEffect,useState } from "react";
import axios from "axios";


function Home()
{
    const [items,setItems]=useState([]);

    useEffect(()=>{

        async function fetchItems(){
            const response= await axios.get("http://localhost:5000/api/v1/item/getAllItems");
            setItems(response.data.allItems);
        }

        fetchItems();
    },[])


    if(items.length===0)
    {
        return(
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
            We're having trouble loading this page. Please try again.
        </p>
        <button onClick={()=>{window.location.reload();}} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Try Again
        </button>
    </div>
</div>
        )
    }
    
    return(
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                items.map((item)=>{
                return <Card item={item} />
                })
            }       
        </div>
    )
}

export default Home;