import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  // Format currency in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div className={`w-full block bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${active ? "unset" : "mb-12"} lg:flex`}>
      <div className="w-full lg:w-[50%] relative">
        <img 
          src={data.images && data.images[0] ? (data.images[0].url || data.images[0]) : "https://via.placeholder.com/400x300?text=No+Image"} 
          alt={data.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        {data.discountPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="w-full lg:w-[50%] p-6 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{data.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h5 className="text-lg text-gray-500 line-through">
              {formatPrice(data.originalPrice)}
            </h5>
            <h5 className="text-xl font-bold text-red-500">
              {formatPrice(data.discountPrice)}
            </h5>
          </div>
          <span className="text-sm text-green-600 font-medium">
            {data.sold_out} sold
          </span>
        </div>

        <CountDown data={data} />
        
        <div className="flex items-center space-x-4 mt-6">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
              <AiOutlineEye className="mr-2" />
              See Details
            </button>
          </Link>
          <button
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
            onClick={() => addToCartHandler(data)}
          >
            <AiOutlineShoppingCart className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
