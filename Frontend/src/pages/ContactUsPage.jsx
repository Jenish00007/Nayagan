import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const ContactUsPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <ContactUs />
      <Footer />
    </div>
  );
};

const ContactUs = () => {
  return (
    <div className="w-11/12 mx-auto min-h-[500px] py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <div className="max-w-2xl mx-auto space-y-6 text-gray-700">
            <p className="text-center text-lg">
                Have questions or need assistance? We're here to help!
            </p>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <div className="space-y-3">
                    <p><strong>Email:</strong> lofigramofficial@gmail.com</p>
                    <p><strong>Phone:</strong> +917418291374</p>
                    <p><strong>Address:</strong> Nagercoil, Tamil Nadu, India</p>
                    <p><strong>Hours:</strong> Mon-Fri, 9am - 5pm EST</p>
                </div>
            </div>
            
            <p className="text-center">
                You can also reach out to us on our social media channels.
            </p>
        </div>
    </div>
  );
};

export default ContactUsPage;
