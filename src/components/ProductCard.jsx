import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({ id: product.id }));
  };

  return (
    <div className="product-card">
      {product.thumbnail && (
        <img src={product.thumbnail} alt={`Thumbnail of ${product.title}`} />
      )}
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <div className="price">${product.price}</div>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    thumbnail: PropTypes.string,
  }).isRequired,
};

export default ProductCard;
