import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { backend_url } from "../../server";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const formatIndianPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#0000004b] z-50">
      <div className="fixed top-0 right-0 h-full w-[95%] sm:w-[85%] md:w-[60%] lg:w-[30%] bg-white flex flex-col justify-between shadow-lg overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-400">
        {cart.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <RxCross1
              size={25}
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpenCart(false)}
            />
            <h5 className="text-lg text-gray-700">Cart is empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-end p-4">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>

              <div className="flex items-center p-4 gap-2">
                <IoBagHandleOutline size={24} />
                <h5 className="text-[17px] font-semibold">
                  {cart.length} item{cart.length > 1 && "s"}
                </h5>
              </div>

              <div className="w-full border-t">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="p-4">
              <Link to="/checkout">
                <div className="bg-[#e44343] hover:bg-[#d13a3a] transition duration-200 text-center text-white py-3 rounded-md">
                  Checkout Now ({formatIndianPrice(totalPrice)})
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const formatIndianPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);

  const increment = (data) => {
    if (data.stock <= value) {
      toast.error("Product stock limited!");
    } else {
      const qty = value + 1;
      setValue(qty);
      quantityChangeHandler({ ...data, qty });
    }
  };

  const decrement = (data) => {
    const qty = value > 1 ? value - 1 : 1;
    setValue(qty);
    quantityChangeHandler({ ...data, qty });
  };

  const getImageUrl = () => {
    if (!data.images || data.images.length === 0) {
      return "https://via.placeholder.com/130x130?text=No+Image";
    }

    const image = data.images[0];
    if (typeof image === "string" && image.startsWith("http")) return image;
    if (typeof image === "string") return `${backend_url}/${image}`;
    if (image?.url?.startsWith("http")) return image.url;
    return `${backend_url}/${image?.url}`;
  };

  return (
    <div className="border-b p-4 hover:bg-gray-50 transition">
      <div className="flex flex-col xs:flex-row gap-4 items-center">
        {/* Quantity Control */}
        <div className="flex flex-row xs:flex-col items-center gap-2">
          <button
            onClick={() => increment(data)}
            className="w-8 h-8 flex items-center justify-center bg-[#e44343] hover:bg-[#d13a3a] text-white rounded-full"
          >
            <HiPlus />
          </button>
          <span className="font-medium text-sm">{value}</span>
          <button
            onClick={() => decrement(data)}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
          >
            <HiOutlineMinus />
          </button>
        </div>

        {/* Product Image */}
        <img
          src={getImageUrl()}
          alt={data.name}
          className="w-[90px] h-[90px] object-cover rounded-md"
        />

        {/* Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-base font-semibold text-gray-800">
              {data.name}
            </h1>
            <RxCross1
              size={18}
              className="text-gray-600 hover:text-red-500 cursor-pointer"
              onClick={() => removeFromCartHandler(data)}
            />
          </div>
          <p className="text-sm text-gray-500">
            {formatIndianPrice(data.discountPrice)} × {value}
          </p>
          <p className="text-base font-semibold text-[#d02222]">
            {formatIndianPrice(totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
