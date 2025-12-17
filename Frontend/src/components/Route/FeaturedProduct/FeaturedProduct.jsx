import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      // Take first 10 products for featured section
      setFeaturedProducts(allProducts.slice(0, 10));
    }
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading} flex items-center justify-between`}>
          <h1>Featured Products</h1>
          {featuredProducts && featuredProducts.length > 0 && (
            <Link
              to="/view-all/featured"
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
          {featuredProducts && featuredProducts.length !== 0 && (
            <>
              {featuredProducts.map((i, index) => (
                <ProductCard data={i} key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
