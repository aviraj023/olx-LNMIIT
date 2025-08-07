import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";

export default function MyProfile() {
  const { isLoggedIn, firstName, lastName, email } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editForm, setEditForm] = useState({
    itemId:"",
    title: "",
    description: "",
    price: "",
    status: "Available",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchMyItems();
    }
  }, [isLoggedIn]);

  const fetchMyItems = async () => {
    try {
      const response = await axiosInstance.get("/item/getOwnersItems");
      setItems(response.data.items);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item._id);
    setEditForm({
      itemId:item._id,
      title: item.title,
      description: item.description,
      price: item.price,
      status: item.status,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        
      await axiosInstance.post("/item/updateItem", editForm,{
        headers: {
          "Content-Type": "multipart/form-data",
        }});
      alert("Item updated successfully");
      setEditingItemId(null);
      fetchMyItems();
    } catch (err) {
      console.error("Error updating item", err);
      alert("Failed to update item");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axiosInstance.post("/item/deleteItem",{itemId});
      alert("Item deleted");
      fetchMyItems();
    } catch (err) {
      console.error("Error deleting item", err);
      alert("Failed to delete item");
    }
  };

//   const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   setEditForm((prev) => ({
//     ...prev,
//     image: file,
//   }));
// };

const handleImageChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };


  return (
    <div className="max-w-4xl mx-auto p-4 mt-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div className="mb-6">
        <p><strong>Name:</strong> {firstName} {lastName}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">My Items</h3>

      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item._id} className="p-4 border rounded shadow">
              {editingItemId === item._id ? (
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                  </select>

                  <div>
                <label className="block text-sm font-medium mb-1">Change Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border p-2 rounded"
                />
                </div>



                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingItemId(null)}
                      className="bg-gray-400 text-white px-4 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 className="text-lg font-bold">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="font-semibold">₹{item.price}</p>
                  <p>Status: <span className="font-medium">{item.status}</span></p>
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
