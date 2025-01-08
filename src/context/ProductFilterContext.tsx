import React, { createContext, useContext, useState } from 'react';

interface ProductFilterContextProps {
  searchQuery: string;
  category: string;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
}

const ProductFilterContext = createContext<ProductFilterContextProps | undefined>(undefined);

export const ProductFilterProvider: React.FC = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Products');

  return (
    <ProductFilterContext.Provider value={{ searchQuery, category, setSearchQuery, setCategory }}>
      {children}
    </ProductFilterContext.Provider>
  );
};

export const useProductFilter = () => {
  const context = useContext(ProductFilterContext);
  if (!context) throw new Error('useProductFilter must be used within a ProductFilterProvider');
  return context;
};
