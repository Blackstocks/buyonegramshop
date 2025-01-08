import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface Product {
  id: number;
  name: string;
  weight: string;
  price: number | null;
  image_url: string | null;
}

interface GroupedProduct {
  name: string;
  image_url: string | null;
  variations: {
    id: number;
    weight: string;
    price: number | null;
  }[];
}

const Home: React.FC = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndGroupProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        const grouped = data.reduce((acc: Record<string, GroupedProduct>, product: Product) => {
          if (!acc[product.name]) {
            acc[product.name] = {
              name: product.name,
              image_url: product.image_url,
              variations: [],
            };
          }
          acc[product.name].variations.push({
            id: product.id,
            weight: product.weight,
            price: product.price,
          });
          return acc;
        }, {});
        setGroupedProducts(Object.values(grouped));
      }
      setLoading(false);
    };

    fetchAndGroupProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carousel Section */}
      <div className="mb-8">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          className="rounded-lg shadow"
        >
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Welcome+to+GroceryStore"
              alt="Banner 1"
              className="rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Fresh+Pulses+and+Dals"
              alt="Banner 2"
              className="rounded-lg"
            />
          </div>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Best+Deals+on+Rice"
              alt="Banner 3"
              className="rounded-lg"
            />
          </div>
        </Carousel>
      </div>

      {/* Products Section */}
      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Our Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {groupedProducts.map((product) => (
              <ProductCard key={product.name} product={product} navigate={navigate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard: React.FC<{ product: GroupedProduct; navigate: any }> = ({ product, navigate }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedWeight, setSelectedWeight] = useState(product.variations[0].weight);

  const selectedProduct = product.variations.find((v) => v.weight === selectedWeight);
  const selectedPrice = selectedProduct?.price;

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
    } else if (selectedProduct) {
      const cartItem = {
        id: selectedProduct.id,
        product_id: selectedProduct.id,
        name: product.name,
        weight: selectedWeight,
        price: selectedPrice || 0,
        quantity: 1,
      };
      await addToCart(cartItem); // Updates the cart in the database
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
    } else if (selectedProduct) {
      navigate('/checkout', {
        state: {
          product: {
            id: selectedProduct.id,
            name: product.name,
            weight: selectedWeight,
            price: selectedPrice,
          },
        },
      });
    }
  };

  return (
    <div className="flex flex-col p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
      <img
        src={product.image_url || 'https://via.placeholder.com/150'}
        alt={product.name}
        className="object-cover w-full h-48 mb-4 rounded-md"
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <select
        value={selectedWeight}
        onChange={(e) => setSelectedWeight(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {product.variations.map((variation) => (
          <option key={variation.weight} value={variation.weight}>
            {variation.weight}
          </option>
        ))}
      </select>
      <p className="mt-2 font-bold text-green-700">
        {selectedPrice !== null ? `$${selectedPrice.toFixed(2)}` : 'Not Available'}
      </p>
      <div className="flex gap-2 mt-4">
        <button onClick={handleAddToCart} className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Home;
