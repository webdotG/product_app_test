import { Card, CardMedia, CardContent, Typography, IconButton, CardActions, Box, Rating, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import StarIcon from '@mui/icons-material/Star';

interface ProductCardProps {
  product: {
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
  };
  onLike: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onLike, 
  onDelete, 
  onEdit,
  showActions = true 
}) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'box-shadow 0.3s',
      '&:hover': {
        boxShadow: 3
      }
    }}>
      <Link href={`/products/${product.id}`} passHref>
        <Box sx={{ position: 'relative', pt: '100%', cursor: 'pointer' }}>
          <CardMedia
            component="img"
            image={product.image}
            alt={product.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: 'background.paper',
            }}
          />
        </Box>
      </Link>
      
      <CardContent sx={{ flexGrow: 1 }}>
        {product.category && (
          <Chip 
            label={product.category} 
            size="small" 
            sx={{ mb: 1 }} 
          />
        )}
        
        <Link href={`/products/${product.id}`} passHref>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div" 
            noWrap
            sx={{ cursor: 'pointer' }}
          >
            {product.title}
          </Typography>
        </Link>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1,
            height: '2.8em'
          }}
        >
          {product.description}
        </Typography>
        
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.rating.rate}
              precision={0.1}
              readOnly
              size="small"
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({product.rating.count})
            </Typography>
          </Box>
        )}
        
        <Typography variant="h6" color="primary">
          ${product.price}
        </Typography>
      </CardContent>
      
      {showActions && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          <IconButton 
            aria-label={product.liked ? "Remove from favorites" : "Add to favorites"}
            onClick={() => onLike(product.id)}
            size="small"
          >
            {product.liked ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          
          {onEdit && (
            <IconButton 
              aria-label="Edit product"
              onClick={() => onEdit(product.id)}
              size="small"
            >
              <Edit fontSize="small" />
            </IconButton>
          )}
          
          <IconButton 
            aria-label="Delete product"
            onClick={() => onDelete(product.id)}
            size="small"
          >
            <Delete fontSize="small" />
          </IconButton>
        </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;