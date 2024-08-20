import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const product = useSelector(state => state.products.items.find(p => p.id === parseInt(id)));

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
      <h1>{product.title}</h1>
      <img src={product.thumbnail} alt={product.title} />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Discount: {product.discountPercentage}%</p>
      <p>Stock: {product.stock}</p>
    </div>
  );
};

export default ProductDetail;
