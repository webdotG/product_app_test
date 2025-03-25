import { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Box,
  Divider
} from '@mui/material';
import { useProductStore } from '../store/products';

interface ProductFormProps {
  initialData?: {
    id?: number;
    title: string;
    description: string;
    price: number;
    image: string;
  };
  isEditing?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, isEditing = false }) => {
  const { addProduct, editProduct } = useProductStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    image: initialData?.image || '',
  });
  
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });
  
  const validate = () => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      price: '',
      image: '',
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      valid = false;
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      valid = false;
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
      valid = false;
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
      valid = false;
    } else if (!/^https?:\/\/.+\..+/.test(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      if (isEditing && initialData?.id) {
        await editProduct(initialData.id, formData);
      } else {
        await addProduct(formData);
      }
      router.push('/products');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };
  
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEditing ? 'Edit Product' : 'Create New Product'}
      </Typography>
      
      <Divider sx={{ mb: 4 }} />
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
          
          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            error={!!errors.price}
            helperText={errors.price}
            required
          />
          
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleChange}
            error={!!errors.image}
            helperText={errors.image}
            required
          />
          
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={() => router.push('/products')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
};

export default ProductForm;