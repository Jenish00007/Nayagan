import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import ProductCard from "../Route/ProductCard/ProductCard";

const ProductSections = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [flashSaleItems, setFlashSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const [recommended, offers, popular, latest, flashSale] = await Promise.all([
          axios.get(`${server}/user-products/recommended`),
          axios.get(`${server}/user-products/top-offers`),
          axios.get(`${server}/user-products/popular`),
          axios.get(`${server}/user-products/latest`),
          axios.get(`${server}/user-products/flash-sale`),
        ]);

        setRecommendedProducts(recommended.data.products);
        setTopOffers(offers.data.products);
        setPopularProducts(popular.data.products);
        setLatestProducts(latest.data.products);
        setFlashSaleItems(flashSale.data.flashSaleItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const renderProductSection = (title, products, type) => (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading} flex items-center justify-between`}>
        <h1>{title}</h1>
        {products && products.length > 0 && (
          <Link
            to={`/view-all/${type}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            View All
            <svg
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-12 border-0">
        {products && products.length !== 0 && (
          products.slice(0, 6).map((product) => (
            <ProductCard key={product._id} data={product} />
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
       <div className="h-20"></div>
      {renderProductSection("Recommended Products", recommendedProducts, "recommended")}
      {renderProductSection("Top Offers", topOffers, "top-offers")}
      {renderProductSection("Most Popular", popularProducts, "popular")}
      {renderProductSection("Latest Products", latestProducts, "latest")}
      {renderProductSection("Flash Sale", flashSaleItems, "flash-sale")}
    </div>
    
  );
};

export default ProductSections; 