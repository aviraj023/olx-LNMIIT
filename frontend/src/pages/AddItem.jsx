/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/api";

export default function AddItem() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    status: "Available",
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/item/getCategories");
        setCategories(response.data.categories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }

      const response = await axiosInstance.post("/item/addItem", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Item added successfully");
      navigate("/");
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Title"
          className="w-full border px-4 py-2 rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="w-full border px-4 py-2 rounded"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          className="w-full border px-4 py-2 rounded"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          name="status"
          className="w-full border px-4 py-2 rounded"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
        <input  className="w-full border px-4 py-2 rounded"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
