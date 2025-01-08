import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Plus, X, Edit, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    weight: "500",
    price: "",
    image_url: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.from("products").select("*");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image_url) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase.from("products").insert(newProduct);
      if (error) {
        toast.error("Failed to add product.");
        console.error(error);
      } else {
        toast.success("Product added successfully.");
        setShowAddProductModal(false);
        setProducts((prev) => [...prev, newProduct]);
        setNewProduct({ name: "", weight: "500", price: "", image_url: "" });
      }
    } catch (error) {
      console.error("Unexpected error adding product:", error);
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.image_url) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      const { error } = await supabase
        .from("products")
        .update(editingProduct)
        .eq("id", editingProduct.id);

      if (error) {
        toast.error("Failed to update product.");
        console.error(error);
      } else {
        toast.success("Product updated successfully.");
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id ? editingProduct : product
          )
        );
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Unexpected error editing product:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        toast.error("Failed to delete product.");
        console.error(error);
      } else {
        toast.success("Product deleted successfully.");
        setProducts((prev) => prev.filter((product) => product.id !== productId));
      }
    } catch (error) {
      console.error("Unexpected error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Products</h3>
        <button
          onClick={() => setShowAddProductModal(true)}
          className="flex items-center px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Weight</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.weight} gm</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Add Product</h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <select
              value={newProduct.weight}
              onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="500">500 gm</option>
              <option value="1">1 kg</option>
              <option value="5">5 kg</option>
              <option value="30">30 kg</option>
            </select>
            <input
              type="text"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newProduct.image_url}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image_url: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handleAddProduct}
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <select
              value={editingProduct.weight}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, weight: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="500">500 gm</option>
              <option value="1">1 kg</option>
              <option value="5">5 kg</option>
              <option value="30">30 kg</option>
            </select>
            <input
              type="text"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, price: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editingProduct.image_url}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, image_url: e.target.value })
              }
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handleEditProduct}
              className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
