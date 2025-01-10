import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults: React.FC = () => {
  const location = useLocation();
  const searchResults = location.state?.searchResults || [];

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Search Results</h2>
      {searchResults.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((product: any) => (
            <div
              key={product.name}
              className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
            >
              <img
                src={product.image_url || "https://via.placeholder.com/150"}
                alt={product.name}
                className="object-cover w-full h-48 mb-4 rounded-md"
              />
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="mt-2 font-bold text-green-700">
                ₹{product.variations[0]?.price?.toFixed(2) || "Not Available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
