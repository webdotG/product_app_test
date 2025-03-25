import { create } from 'zustand';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  liked: boolean;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  toggleLike: (id: number) => void;
  deleteProduct: (id: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'liked'>) => Promise<void>;
  editProduct: (id: number, product: Partial<Product>) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      set({ 
        products: data.map((product: any) => ({
          ...product,
          liked: false
        })),
        loading: false
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false 
      });
    }
  },
  
  toggleLike: (id) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, liked: !product.liked } : product
      ),
    })),
  
  deleteProduct: async (id) => {
    // В реальном приложении здесь был бы DELETE запрос к API
    try {
      await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'DELETE'
      });
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  },
  
  addProduct: async (product) => {
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        body: JSON.stringify(product)
      });
      const newProduct = await response.json();
      
      set((state) => ({
        products: [
          ...state.products,
          {
            ...newProduct,
            liked: false
          },
        ],
      }));
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  },
  
  editProduct: async (id, product) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product)
      });
      const updatedProduct = await response.json();
      
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...updatedProduct } : p
        ),
      }));
    } catch (error) {
      console.error('Failed to edit product:', error);
    }
  },
}));