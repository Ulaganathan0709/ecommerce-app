import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div className="stars">
      {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className="fas fa-star" style={{ color: '#ffc107' }} />)}
      {halfStar === 1 && <i className="fas fa-star-half-alt" style={{ color: '#ffc107' }} />}
      {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className="far fa-star" style={{ color: '#e4e5e9' }} />)}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
