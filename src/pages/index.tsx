import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProductStore } from '../store/products';

export default function Home() {
  const router = useRouter();
  const { fetchProducts } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
    router.push('/products');
  }, [fetchProducts, router]);

  return null;
}