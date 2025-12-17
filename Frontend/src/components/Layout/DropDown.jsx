import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";

const DropDown = ({ categoriesData, setDropDown }) => {
    const navigate = useNavigate();
    const submitHandle = (i) => {
        navigate(`/subcategories?categoryId=${i.id}&categoryName=${encodeURIComponent(i.title)}`);
        setDropDown(false);
    };
    return (
        <div className="pb-4 w-[400px] bg-[#fff] absolute z-30 rounded-b-md shadow-lg border border-gray-100">
            <div className="grid grid-cols-3 gap-4 p-4">
                {categoriesData &&
                    categoriesData.map((i, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer group"
                            onClick={() => submitHandle(i)}
                        >
                            <div className="w-16 h-16 mb-2 rounded-full bg-gray-100 p-2 group-hover:bg-gray-200 transition-colors duration-300">
                                <img
                                    src={i.image_Url}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        userSelect: "none",
                                    }}
                                    alt={i.title}
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-200">
                                {i.title}
                            </h3>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default DropDown;