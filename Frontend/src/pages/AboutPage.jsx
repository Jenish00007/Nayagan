import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const AboutPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <About />
      <Footer />
    </div>
  );
};

const About = () => {
  return (
    <div className="w-11/12 mx-auto min-h-[500px] py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>
        <div className="space-y-4 text-gray-700 text-lg">
            <p>
                Welcome to our store! We are passionate about providing high-quality T-shirts that allow you to express yourself.
            </p>
            <p>
                Our mission is to bring you the best designs from movies, pop culture, and more. We believe that what you wear should reflect who you are.
            </p>
            <p>
                Founded in 2023, we have been serving customers with dedication and commitment to quality. Our team works hard to curate collections that you'll love.
            </p>
            <p>
                Thank you for choosing us. We hope you enjoy our products as much as we enjoy offering them to you.
            </p>
        </div>
    </div>
  );
};

export default AboutPage;
