import { Link } from "react-router-dom"

export default function Card({item})
{
    return(
            <div className="group"> 
            <Link
                key={item._id}
                to={`/itemId/${item._id}`}
                className="block bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
                {/* Image Container with Overlay */}
                <div className="relative overflow-hidden">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                   
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                        {item.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {item.description}
                    </p>

                     {/* Status Badge */}
                    <div className="">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                item.status === "Available" 
                                    ? "bg-green-500/20 text-green-700 border border-green-200" 
                                    : "bg-red-500/20 text-red-700 border border-red-200"
                            }`}
                        >
                            {item.status}
                        </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">₹{item.price}</span>
                        </div>


                        
                        {/* Arrow Icon */}
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                            <svg 
                                className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors duration-200" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Bottom Accent */}
                <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
        </div>
    )
}