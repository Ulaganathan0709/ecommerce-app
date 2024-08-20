import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ImageModal.css';

const ImageModal = ({ images, currentIndex, setCurrentIndex, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
    return () => {
      if (dialogRef.current) {
        dialogRef.current.close();
      }
    };
  }, []);

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-content">
        <button className="close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <img
          src={images[currentIndex]}
          alt={`Product image ${currentIndex + 1}`}
        />
        <button className="prev" onClick={previousImage}>
          &lt;
        </button>
        <button className="next" onClick={nextImage}>
          &gt;
        </button>
      </div>
    </dialog>
  );
};

ImageModal.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageModal;
