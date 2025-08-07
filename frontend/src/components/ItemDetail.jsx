import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function ItemDetail() {
  const { itemId } = useParams();
  const [itemDetails, setItemDetails] = useState({});

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/item/getItemDetails",
          { itemId }
        );
        console.log("response", response);

        setItemDetails(response.data.itemDetails);
      } catch (err) {
        console.error("Error fetching item details:", err);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  const { title, description, price, status, image, createdAt, owner = {} } = itemDetails;

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
        {image && <img src={image} alt={title} className="w-full h-80 object-cover rounded-lg" />}

        <h2 className="text-2xl font-bold mt-4">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
        <p className="text-lg font-semibold mt-4 text-green-600">₹{price}</p>
        <p className="mt-2 text-sm text-gray-500">
          Status: <span className="font-medium">{status}</span>
        </p>
        <p className="text-sm text-gray-400">
          Posted on {createdAt && new Date(createdAt).toLocaleDateString()}
        </p>

        <hr className="my-6" />

        <div>
          <h3 className="text-xl font-semibold">Owner Info</h3>
          <p>{owner.firstName} {owner.lastName}</p>
          <p className="text-blue-600">{owner.email}</p>
        </div>

        {/* Optional: More items from this owner */}
        {owner.itemsToSell && owner.itemsToSell.length > 1 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-2">More items from this owner:</h4>
            <ul className="grid grid-cols-2 gap-4">
              {owner.itemsToSell.map((item) => (
                <Link to={`/itemId/${item._id}`}>
                <li key={item._id} className="border p-2 rounded shadow">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-32 w-full object-cover rounded"
                  />
                  <p className="mt-2 font-medium">{item.title}</p>
                </li>
                </Link>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
