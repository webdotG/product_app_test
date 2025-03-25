import { useRouter } from 'next/router';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  Divider,
  Stack,
  Rating,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Favorite, FavoriteBorder, Delete, Edit } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { useProductStore } from '../../store/products';
import { useEffect } from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { 
    products, 
    toggleLike, 
    deleteProduct, 
    loading, 
    error, 
    fetchProducts 
  } = useProductStore();
  
  const product = products.find(p => p.id === Number(id));
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]); // Добавлены зависимости

  if (loading && products.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Link href="/products" passHref>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
            Back to products
          </Button>
        </Link>
      </Container>
    );
  }

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
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Link href="/products" passHref>
          <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
            Back to products
          </Button>
        </Link>
      </Box>
      
      <Card>
        <Box sx={{ display: { xs: 'block', md: 'flex' } }}>
          <Box sx={{ 
            width: { xs: '100%', md: '50%' }, 
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'background.paper'
          }}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.title}
              sx={{
                maxHeight: 400,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '50%' }, p: 3 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {product.title}
                  </Typography>
                  <Chip 
                    label={product.category} 
                    color="primary" 
                    size="small" 
                    sx={{ mb: 2 }}
                  />
                </Box>
                
                <Stack direction="row" spacing={1}>
                  <IconButton 
                    onClick={() => toggleLike(product.id)}
                    aria-label={product.liked ? "Remove from favorites" : "Add to favorites"}
                  >
                    {product.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                  
                  <Link href={`/products/${product.id}/edit`} passHref>
                    <IconButton aria-label="Edit product">
                      <Edit />
                    </IconButton>
                  </Link>
                  
                  <IconButton 
                    onClick={() => {
                      deleteProduct(product.id);
                      router.push('/products');
                    }}
                    aria-label="Delete product"
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              {product.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Rating
                    value={product.rating.rate}
                    precision={0.1}
                    readOnly
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {product.rating.count} reviews
                  </Typography>
                </Box>
              )}
              
              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ${product.price}
              </Typography>
              
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                {product.description}
              </Typography>
            </CardContent>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}