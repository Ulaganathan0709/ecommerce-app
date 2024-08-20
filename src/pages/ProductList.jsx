import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/products/productSlice';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';
import StarRating from '../components/StarRating';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const cart = useSelector((state) => state.cart.items);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  useEffect(() => {
    dispatch(fetchProducts()).then(() => setLoading(false));
  }, [dispatch]);

  const openModal = (images, index) => {
    setModalState({ isOpen: true, images, currentIndex: index });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ id: productId })); // Ensure the payload has the correct structure
    toast.success(`Product added to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    toast.info(`Product removed from cart!`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products available</div>;
  }

  return (
    <div className="product-list">
      <h1>Product List</h1>
      <div className="products">
        {products.map((product) => {
          const discountedPrice = (
            product.price -
            product.price * (product.discountPercentage / 100)
          ).toFixed(0);
          const discountAmount = (
            product.price * (product.discountPercentage / 100)
          ).toFixed(0);
          const isInCart = cart.some((item) => item.id === product.id);

          return (
            <div key={product.id} className="product-card">
              <button
                className="image-button"
                onClick={() => openModal(product.images, 0)}
                aria-label={`Open images of ${product.title}`}
              >
                <img src={product.thumbnail} alt={product.title} />
              </button>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <StarRating rating={product.rating} />
              <p>Available Stock: {product.stock}</p>
              <p>
                Original Price: <s>${product.price.toFixed(0)}</s>
              </p>
              <p>Discount: ${discountAmount}</p>
              <p className="highlighted-price price">
                Discounted Price: ${discountedPrice}
              </p>
              <button
                onClick={() => {
                  if (isInCart) {
                    handleRemoveFromCart(product.id);
                  } else {
                    handleAddToCart(product.id);
                  }
                }}
                aria-label={
                  isInCart
                    ? `Remove ${product.title} from cart`
                    : `Add ${product.title} to cart`
                }
              >
                {isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
      <ToastContainer />
      {modalState.isOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={closeModal} aria-label="Close modal">
              &times;
            </button>
            <img
              src={modalState.images[modalState.currentIndex]}
              alt={`Product ${modalState.currentIndex + 1}`}
            />
            <button
              className="prev"
              onClick={() =>
                setModalState({
                  ...modalState,
                  currentIndex:
                    (modalState.currentIndex - 1 + modalState.images.length) %
                    modalState.images.length,
                })
              }
            >
              &lt;
            </button>
            <button
              className="next"
              onClick={() =>
                setModalState({
                  ...modalState,
                  currentIndex:
                    (modalState.currentIndex + 1) % modalState.images.length,
                })
              }
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
