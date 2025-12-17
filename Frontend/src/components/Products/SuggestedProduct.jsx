import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { productData } from '../../static/data'
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard"




const SuggestedProduct = ({ data }) => {
    const [products, setProducts] = useState([])
    const { allProducts } = useSelector((state) => state.products);
    const [productData, setProductData] = useState();

    // Proudect is filter when the cataegory is same as the current product when page is loaded
    useEffect(() => {
        const d = allProducts && allProducts.filter((i) => i.category === data.category)
        setProductData(d)
    }, [])

    return (
        <div>
            {
                data ? (
                    <div
                        className={`p-4 ${styles.section}`}>
                        <h2
                            className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
                        >
                            Related Products
                        </h2>
                        <div className="grid grid-cols-2 gap-[15px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-12">
                            {
                                productData && productData.map((i, index) => (
                                    <ProductCard data={i} key={index} />
                                ))
                            }
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default SuggestedProduct