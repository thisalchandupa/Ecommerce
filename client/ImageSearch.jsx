import React, { useState } from 'react';
import axios from 'axios';

const ImageSearch = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle image file selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!selectedImage) {
      alert('Please select an image.');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Send image to backend
      const response = await axios.post('/api/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set matching products from the response
      setProducts(response.data);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('An error occurred while processing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Find Similar Products</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {products.length > 0 && (
        <div>
          <h2>Matching Products</h2>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <img src={product.imageUrl} alt={product.productName} width="100" />
                <p>{product.productName} - ${product.price}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
