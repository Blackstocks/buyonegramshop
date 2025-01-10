import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import LoginRegisterModal from './LoginRegisterModal';
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
  const [showModal, setShowModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<any>(null);
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

  const onModalClose = () => {
    setShowModal(false);
    setSelectedProductForModal(null);
  };

  const onLoginSuccess = () => {
    if (selectedProductForModal) {
      const { action, product } = selectedProductForModal;
      if (action === 'addToCart') {
        addToCart(product);
      } else if (action === 'buyNow') {
        navigate('/checkout', {
          state: {
            product: product,
          },
        });
      }
    }
    setShowModal(false);
    setSelectedProductForModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              src="https://i.ibb.co/mXdkbyc/ban2.webp"
              alt="Banner 3"
              className="rounded-lg"
            />
          </div>
          
          <div>
            <img
              src="https://i.ibb.co/wyrWSB3/Buy-One-Gram.png"
              alt="Banner 2"
              className="rounded-lg"
            />
          </div>

          <div>
            <img
              src="https://as1.ftcdn.net/v2/jpg/05/43/25/74/1000_F_543257422_dSaLDOns13TpGsOLEUiYXOKCMq2ixFDj.jpg"
              alt="Banner 1"
              className="rounded-lg"
            />
          </div>
          
        </Carousel>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Our Products</h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {groupedProducts.map((product) => (
              <ProductCard 
                key={product.name} 
                product={product} 
                setShowModal={setShowModal}
                setSelectedProductForModal={setSelectedProductForModal}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <LoginRegisterModal 
          onClose={onModalClose} 
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
};

const ProductCard: React.FC<{ 
  product: GroupedProduct; 
  setShowModal: (show: boolean) => void;
  setSelectedProductForModal: (product: any) => void;
}> = ({ 
  product, 
  setShowModal, 
  setSelectedProductForModal 
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedWeight, setSelectedWeight] = useState(product.variations[0].weight);

  const selectedProduct = product.variations.find((v) => v.weight === selectedWeight);
  const selectedPrice = selectedProduct?.price;

  const handleAddToCart = async () => {
    const cartItem = {
      id: selectedProduct?.id,
      product_id: selectedProduct?.id,
      name: product.name,
      weight: selectedWeight,
      price: selectedPrice || 0,
      quantity: 1,
    };

    if (!user) {
      setSelectedProductForModal({ action: 'addToCart', product: cartItem });
      setShowModal(true);
    } else if (selectedProduct) {
      await addToCart(cartItem);
    }
  };

  const handleBuyNow = () => {
    if (!selectedProduct) {
      console.error('No product selected');
      return;
    }

    const productData = {
      id: selectedProduct.id,
      name: product.name,
      weight: selectedWeight,
      price: selectedPrice,
    };

    if (!user) {
      setSelectedProductForModal({ action: 'buyNow', product: productData });
      setShowModal(true);
    } else {
      navigate('/checkout', {
        state: {
          product: productData,
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
        className="w-full p-2 mt-2 border rounded"
      >
        {product.variations.map((variation) => (
          <option key={variation.weight} value={variation.weight}>
            {variation.weight}
          </option>
        ))}
      </select>
      <p className="mt-2 font-bold text-green-700">
        ₹{selectedPrice !== null ? selectedPrice.toFixed(2) : 'Not Available'}
      </p>
      <div className="flex gap-2 mt-4">
        <button 
          onClick={handleAddToCart} 
          className="flex-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow} 
          className="flex-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
      {product ? (
        <div className="p-4 bg-white rounded shadow">
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Weight:</strong> {product.weight}</p>
          <p><strong>Price:</strong> ₹{product.price.toFixed(2)}</p>
        </div>
      ) : (
        <p className="text-gray-500">No product to display</p>
      )}
    </div>
  );
};

export default Home;
export { Checkout };
