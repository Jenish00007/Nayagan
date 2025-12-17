import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { AiOutlineAppstore, AiOutlineSearch } from "react-icons/ai";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${server}/categories`);
      const categoriesData = response.data.data || [];
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/subcategories?categoryId=${category._id}&categoryName=${encodeURIComponent(category.name)}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header activeHeading={3} />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b">
          <div className={`${styles.section} py-8`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mr-4">
                  <AiOutlineAppstore size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Shop by Categories</h1>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explore our wide range of product categories and find exactly what you're looking for
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border-b">
          <div className={`${styles.section} py-6`}>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={`${styles.section} py-12`}>
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="aspect-square overflow-hidden">
                    {category.image ? (
                      <img
                        src={category.image}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        alt={category.name}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <AiOutlineAppstore size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <AiOutlineSearch size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No categories found" : "No categories available"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "There are currently no categories available"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesPage; 