import React from 'react'

const AddShoeTag = () => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(1.0);
  const [selectedProduct, setSelectedProduct] = useState("");
  
  // Sample products (in a real app, these would come from an API)
  const products = [
    { id: 1, name: "Air Max 90" },
    { id: 2, name: "Ultraboost" },
    { id: 3, name: "574 Classic" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      weight: parseFloat(weight),
      productId: parseInt(selectedProduct)
    });
    alert("Tag added successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Add Product Tag</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          step="0.1"
          min="0.1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="text-sm text-gray-500 mt-1">Importance of this tag for the product</p>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Add Tag
        </button>
      </div>
    </form>
  );

}

export default AddShoeTag
