import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiOutlineShareAlt,
  AiOutlineTag,
  AiOutlineFire,
  AiOutlineStar,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
import { motion } from "framer-motion";

const ProductDetails = ({ data }) => {
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  // Function to format currency in Indian format
  const formatIndianCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  useEffect(() => {
    if (!data?.shop?._id) {
      console.log("No valid shop ID found");
      return;
    }

    dispatch(getAllProductsShop(data.shop._id));
    
    if (wishlist && data?._id) {
      const isInWishlist = wishlist.find((i) => i._id === data._id);
      setClick(!!isInWishlist);
    } else {
      setClick(false);
    }
  }, [data, wishlist, dispatch]);

  const removeFromWishlistHandler = (data) => {
    if (!data?._id) {
      toast.error("Invalid product data");
      return;
    }
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    if (!data?._id) {
      toast.error("Invalid product data");
      return;
    }
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const incrementCount = () => {
    if (count < data.stock) {
      setCount(count + 1);
    } else {
      toast.error("Maximum stock limit reached!");
    }
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + (product.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) || 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/400x400?text=No+Image";
    
    if (typeof image === 'string') {
      if (image.startsWith('http')) {
        return image;
      }
      return `${backend_url}/${image}`;
    }
    
    if (image.url) {
      if (image.url.startsWith('http')) {
        return image.url;
      }
      return `${backend_url}/${image.url}`;
    }

    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  if (!data || !data._id) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Image gallery */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main image */}
            <div className="w-full lg:w-[70%]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={getImageUrl(data?.images?.[select])}
                  alt={data?.name || "Product Image"}
                  className="w-full h-full object-center object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                  }}
                />
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="w-full lg:w-[30%]">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {data?.images?.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => setSelect(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${data?.name || "Product"} - ${index + 1}`}
                      className="w-full h-full object-center object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                    {select === index && (
                      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {data?.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <div className="flex items-center space-x-4">
                  <p className="text-3xl text-gray-900 font-bold">
                    {formatIndianCurrency(data?.discountPrice)}
                  </p>
                  {data?.originalPrice && (
                    <p className="text-xl text-gray-500 line-through">
                      {formatIndianCurrency(data?.originalPrice)}
                    </p>
                  )}
                  {data?.originalPrice && (
                    <div className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p className="ml-2 text-sm text-gray-500">
                    ({data?.reviews?.length} reviews)
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="text-base text-gray-700 space-y-6">
                  <p>{data?.description}</p>
                </div>
              </div>

              {/* Stock and Sold */}
              <div className="mt-6 flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <AiOutlineFire className="w-5 h-5 mr-1" />
                  <span>{data?.sold_out} sold</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <AiOutlineTag className="w-5 h-5 mr-1" />
                  <span>{data?.stock} in stock</span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-8">
                <div className="flex items-center">
                  <button
                    onClick={decrementCount}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="mx-4 text-gray-600">{count}</span>
                  <button
                    onClick={incrementCount}
                    className="bg-gray-100 text-gray-600 hover:bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCartHandler(data?._id)}
                  className="flex-1 bg-blue-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <AiOutlineShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToWishlistHandler(data)}
                  className="flex-1 bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {click ? (
                    <AiFillHeart className="w-5 h-5 mr-2 text-red-500" />
                  ) : (
                    <AiOutlineHeart className="w-5 h-5 mr-2" />
                  )}
                  {click ? "Remove from Wishlist" : "Add to Wishlist"}
                </motion.button>
              </div>

              {/* Share and Message */}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={handleMessageSubmit}
                  className="flex items-center text-gray-500 hover:text-gray-700"
                >
                  <AiOutlineMessage className="w-5 h-5 mr-2" />
                  Message Seller
                </button>
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                  <AiOutlineShareAlt className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>

              {/* Shop info */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="flex items-center">
                  <img
                    src={getImageUrl(data?.shop?.avatar)}
                    alt={data?.shop?.name || "Shop Avatar"}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50x50?text=Shop";
                    }}
                  />
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      {data?.shop?.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Ratings rating={data?.shop?.ratings} />
                      <span className="ml-2 text-sm text-gray-500">
                        ({data?.shop?.ratings} rating)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(1)}
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={
              "text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            }
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line  ">
            {data.description}
          </p>
        </>
      ) : null}

      {/* Product Rev */}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${backend_url}/${item.user.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}

      {active === 3 ? (
        <>
          <div className="w-full block 800px:flex p-5 ">
            <div className="w-full 800px:w-[50%]">
              <div className="flex items-center">
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <div className="flex items-center">
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      className="w-[50px] h-[50px] rounded-full"
                      alt=""
                    />
                    <div className="pl-3">
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        ({averageRating}/5) Ratings
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>

              <p className="pt-2">{data.shop.description}</p>
            </div>

            <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
              <div className="text-left">
                <h5 className="font-[600]">
                  Joined on:{" "}
                  <span className="font-[500]">
                    {data.shop?.createdAt?.slice(0, 10)}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Total Products:{" "}
                  <span className="font-[500]">
                    {products && products.length}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Total Reviews:{" "}
                  <span className="font-[500]">{totalReviewsLength}</span>
                </h5>
                <Link to="/">
                  <div
                    className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                  >
                    <h4 className="text-white">Visit Shop</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDetails;
