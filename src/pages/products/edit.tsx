import { useRouter } from 'next/router';
import ProductForm from '../../../src/components/ProductForm';
import useProductStore from '../../../src/store/useStore';
import { Container, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

export default function EditProduct() {
  const router = useRouter();
  const { id } = router.query;
  const { products } = useProductStore();
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Product not found
        </Typography>
        <Link href="/products" passHref>
          <Button variant="outlined" startIcon={<ArrowBackIcon />}>
            Back to products
          </Button>
        </Link>
      </Container>
    );
  }
  
  return <ProductForm initialData={product} isEditing />;
}