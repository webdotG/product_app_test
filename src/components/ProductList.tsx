import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  ToggleButton, 
  ToggleButtonGroup,
  Button,
  Box,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ProductCard from './ProductCard';
import { useProductStore } from '../store/products';
import Link from 'next/link';
import { SelectChangeEvent } from '@mui/material/Select';

const ITEMS_PER_PAGE = 5;

const ProductList = () => {
  const { products, fetchProducts, loading, error } = useProductStore();
  const [filter, setFilter] = useState<'all' | 'liked'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [page, setPage] = useState(1);
  
  const { toggleLike, deleteProduct } = useProductStore();
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const categories: string[] = ['all', ...Array.from(new Set(products
    .map(p => p.category)
    .filter((category): category is string => !!category)
  ))];

  const filteredProducts = products
    .filter(product => 
      filter === 'all' || product.liked
    )
    .filter(product =>
      categoryFilter === 'all' || product.category === categoryFilter
    )
    .filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (priceSort === 'asc') return a.price - b.price;
      if (priceSort === 'desc') return b.price - a.price;
      return 0;
    });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };

  const handlePriceSortChange = (event: SelectChangeEvent) => {
    setPriceSort(event.target.value as 'none' | 'asc' | 'desc');
    setPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: { xs: 'flex-start', md: 'center' }, 
            justifyContent: 'space-between',
            gap: 2,
            mb: 3
          }}
        >
          <Typography variant="h4" component="h1">
            Products
            {products.length > 0 && (
              <Chip 
                label={`${filteredProducts.length} items`} 
                size="small" 
                sx={{ ml: 2 }} 
              />
            )}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            width: { xs: '100%', md: 'auto' },
            justifyContent: { xs: 'flex-start', md: 'flex-end' }
          }}>
<TextField
  placeholder="Search products..."
  variant="outlined"
  size="small"
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }}
  slotProps={{
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    },
  }}
  sx={{ minWidth: 250 }}
/>
            
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={categoryFilter}
                onChange={handleCategoryChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select category' }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.filter(c => c !== 'all').map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={priceSort}
                onChange={handlePriceSortChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Sort by price' }}
              >
                <MenuItem value="none">Default sorting</MenuItem>
                <MenuItem value="asc">Price: Low to High</MenuItem>
                <MenuItem value="desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
            
            <ToggleButtonGroup
              value={filter}
              exclusive
              onChange={(_, newFilter) => {
                if (newFilter) {
                  setFilter(newFilter);
                  setPage(1);
                }
              }}
              size="small"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="liked">Favorites</ToggleButton>
            </ToggleButtonGroup>
            
            <Link href="/create-product" passHref>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Add Product
              </Button>
            </Link>
          </Box>
        </Box>
        
        {filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No products found
            </Typography>
          </Box>
        ) : (
          <>
      <Grid container spacing={3}>
        {paginatedProducts.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onLike={toggleLike}
              onDelete={deleteProduct}
            />
          </Grid>
        ))}
      </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={1}
                boundaryCount={1}
              />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ProductList;