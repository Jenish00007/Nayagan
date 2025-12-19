import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const ShippingPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <Shipping />
      <Footer />
    </div>
  );
};

const Shipping = () => {
  return (
    <div className="w-11/12 mx-auto min-h-[500px] py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Shipping Information</h1>
        <div className="space-y-4 text-gray-700">
             <h2 className="text-xl font-semibold mt-4">Shipping Policy</h2>
            <p>
                We offer shipping to most locations. Please allow 1-2 business days for order processing.
            </p>
             <h2 className="text-xl font-semibold mt-4">Shipping Rates</h2>
            <p>
                Shipping rates are calculated at checkout based on your location and the weight of your order.
            </p>
            <h2 className="text-xl font-semibold mt-4">Delivery Times</h2>
            <p>
                Standard shipping typically takes 3-5 business days within the country. International shipping may take 7-14 business days.
            </p>
            <h2 className="text-xl font-semibold mt-4">Tracking</h2>
            <p>
                Once your order ships, you will receive a tracking number via email so you can monitor its progress.
            </p>
        </div>
    </div>
  );
};

export default ShippingPage;
