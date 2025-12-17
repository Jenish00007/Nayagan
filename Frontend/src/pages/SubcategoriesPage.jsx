import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { AiOutlineSearch, AiOutlineArrowLeft, AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const SubcategoriesPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get("categoryId");
  const categoryName = searchParams.get("categoryName");
  
  const [activeTab, setActiveTab] = useState("All");
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsPerPage] = useState(20); // Products per page

  // Fetch subcategories for the selected category
  useEffect(() => {
    if (categoryId) {
      fetchSubcategories();
    } else if (categoryName) {
      // If only categoryName is provided, find the category by name first
      findCategoryByName();
    }
  }, [categoryId, categoryName]);

  // Fetch products when subcategory changes
  useEffect(() => {
    if (!isSearching && (categoryId || selectedSubcategoryId)) {
      setCurrentPage(1); // Reset to first page when changing subcategory
      fetchProducts();
    }
  }, [selectedSubcategoryId, isSearching, categoryId]);

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "" && (categoryId || selectedSubcategoryId)) {
        setCurrentPage(1); // Reset to first page when searching
        fetchSearchResults(searchTerm);
      } else {
        setIsSearching(false);
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, categoryId, selectedSubcategoryId]);

  // Fetch products when page changes
  useEffect(() => {
    if (!isSearching && (categoryId || selectedSubcategoryId)) {
      if (searchTerm.trim() !== "") {
        fetchSearchResults(searchTerm);
      } else {
        fetchProducts();
      }
    }
  }, [currentPage]);

  const findCategoryByName = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/categories`);
      if (response.data.success && response.data.data) {
        const category = response.data.data.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        if (category) {
          // Update the URL with the found category ID
          const newUrl = `/subcategories?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`;
          window.history.replaceState(null, '', newUrl);
          // Fetch subcategories for the found category
          await fetchSubcategories(category._id);
        } else {
          console.error("Category not found:", categoryName);
        }
      }
    } catch (error) {
      console.error("Error finding category by name:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (id = categoryId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/categories/${id}`);
      if (response.data.success && response.data.data.subcategories) {
        setSubcategories(response.data.data.subcategories);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const categoryIdToUse = selectedSubcategoryId || categoryId;
      if (!categoryIdToUse) {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
        return;
      }
      
      const response = await axios.get(
        `${server}/product/categories/items/${categoryIdToUse}?limit=${itemsPerPage}&offset=${currentPage}&type=all`
      );
      
      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setTotalProducts(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (searchText) => {
    if (searchText.trim() === "") {
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setLoading(true);
      const categoryIdToUse = selectedSubcategoryId || categoryId;
      if (!categoryIdToUse) {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
        return;
      }
      
      const response = await axios.get(
        `${server}/product/items/search?name=${encodeURIComponent(searchText)}&category_id=${categoryIdToUse}&limit=${itemsPerPage}&offset=${currentPage}`
      );

      if (response.data.success && Array.isArray(response.data.products)) {
        setProducts(response.data.products);
        setTotalProducts(response.data.total || 0);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    if (tab === "All") {
      setSelectedSubcategoryId(null);
    } else {
      const subcategory = subcategories.find((sub) => sub.name === tab);
      if (subcategory) {
        setSelectedSubcategoryId(subcategory._id);
      }
    }
    setActiveTab(tab);
    // Reset search when changing tabs
    if (searchTerm.trim() !== "") {
      setSearchTerm("");
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTabNames = () => {
    const tabs = ["All"];
    if (subcategories && subcategories.length > 0) {
      subcategories.forEach((subcategory) => {
        if (subcategory.name && subcategory.isActive) {
          tabs.push(subcategory.name);
        }
      });
    }
    return tabs;
  };

  const tabs = getTabNames();

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading && products.length === 0) {
    return <Loader />;
  }

  return (
    <>
      <Header activeHeading={3} />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className={`${styles.section} py-6`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <AiOutlineArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {categoryName || "Category"}
                  </h1>
                  <p className="text-gray-600">
                    {totalProducts} products found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b">
          <div className={`${styles.section} py-4`}>
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Subcategory Tabs */}
        {subcategories.length > 0 && (
          <div className="bg-white border-b">
            <div className={`${styles.section} py-4`}>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={`${styles.section} py-8`}>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-8">
                    {products.map((product, index) => (
                      <ProductCard data={product} key={index} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center mt-8">
                      <div className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                        {/* Previous Button */}
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md transition-colors ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <AiOutlineLeft size={16} />
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((page, index) => (
                          <button
                            key={index}
                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                            disabled={page === '...'}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              page === currentPage
                                ? "bg-blue-600 text-white"
                                : page === '...'
                                ? "text-gray-400 cursor-default"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </button>
                        ))}

                        {/* Next Button */}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md transition-colors ${
                            currentPage === totalPages
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <AiOutlineRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Page Info */}
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <AiOutlineSearch size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm
                        ? "Try adjusting your search terms"
                        : "No products available in this category"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SubcategoriesPage; 