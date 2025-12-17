import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";

const ViewAllProducts = () => {
  const { type } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const { allProducts } = useSelector((state) => state.products);

  const getTitle = () => {
    switch (type) {
      case "recommended":
        return "Recommended Products";
      case "top-offers":
        return "Top Offers";
      case "popular":
        return "Most Popular Products";
      case "latest":
        return "Latest Products";
      case "flash-sale":
        return "Flash Sale";
      case "best-deals":
        return "Best Deals";
      case "featured":
        return "Featured Products";
      default:
        return "All Products";
    }
  };

  const getEndpoint = () => {
    switch (type) {
      case "recommended":
        return "recommended";
      case "top-offers":
        return "top-offers";
      case "popular":
        return "popular";
      case "latest":
        return "latest";
      case "flash-sale":
        return "flash-sale";
      case "best-deals":
        return "all"; // For best deals, we'll use all products and sort by sold_out
      case "featured":
        return "all"; // For featured, we'll use all products
      default:
        return "all";
    }
  };

  const fetchProducts = async (page = 1, isLoadMore = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      let newProducts = [];

      if (type === "best-deals") {
        // For best deals, use Redux data and sort by sold_out
        const allProductsData = allProducts ? [...allProducts] : [];
        const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
        const startIndex = (page - 1) * 20;
        const endIndex = startIndex + 20;
        newProducts = sortedData.slice(startIndex, endIndex);
        setHasMore(endIndex < sortedData.length);
      } else if (type === "featured") {
        // For featured, use Redux data
        const allProductsData = allProducts ? [...allProducts] : [];
        const startIndex = (page - 1) * 20;
        const endIndex = startIndex + 20;
        newProducts = allProductsData.slice(startIndex, endIndex);
        setHasMore(endIndex < allProductsData.length);
      } else {
        const endpoint = getEndpoint();
        const response = await axios.get(
          `${server}/user-products/${endpoint}?page=${page}&limit=20`
        );
        newProducts = response.data.products || [];
        setHasMore(newProducts.length === 20);
      }
      
      if (page === 1) {
        setProducts(newProducts);
      } else {
        setProducts(prev => [...prev, ...newProducts]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [type, allProducts]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(nextPage, true);
    }
  };

  if (loading) {
    return (
      <div>
        <Header activeHeading={1} />
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header activeHeading={1} />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
                <p className="text-gray-600 mt-2">
                  Discover amazing products in our {getTitle().toLowerCase()}
                </p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by browsing our other categories.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {products.map((product) => (
                  <ProductCard key={product._id} data={product} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllProducts; 