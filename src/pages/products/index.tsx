import ProductList from '../../components/ProductList';
import { useEffect } from 'react';
import { useProductStore } from '../../store/products';

export default function ProductsPage() {
  const { products, fetchProducts } = useProductStore();
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  return <ProductList />;
}