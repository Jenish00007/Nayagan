import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const PrivacyPolicyPage = () => {
  return (
    <div>
      <Header activeHeading={5} />
      <PrivacyPolicy />
      <Footer />
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="w-11/12 mx-auto min-h-[500px] py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="space-y-4 text-gray-700">
            <p>
                At our store, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from us.
            </p>
            <h2 className="text-xl font-semibold mt-4">Personal Information We Collect</h2>
            <p>
                When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
            </p>
            <h2 className="text-xl font-semibold mt-4">How Do We Use Your Personal Information?</h2>
            <p>
                We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations).
            </p>
            <h2 className="text-xl font-semibold mt-4">Sharing Your Personal Information</h2>
            <p>
                We share your Personal Information with third parties to help us use your Personal Information, as described above.
            </p>
            <h2 className="text-xl font-semibold mt-4">Contact Us</h2>
            <p>
                For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail.
            </p>
        </div>
    </div>
  );
};

export default PrivacyPolicyPage;
