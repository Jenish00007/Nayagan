import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import ProductCard from "../components/Route/ProductCard/ProductCard";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (Array.isArray(allProducts)) {
      const sortedProducts = [...allProducts].sort(
        (a, b) => b.sold_out - a.sold_out
      );
      setData(sortedProducts);
      window.scrollTo(0, 0);
    }
  }, [allProducts]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section}`}>
            <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-12">
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BestSellingPage;
