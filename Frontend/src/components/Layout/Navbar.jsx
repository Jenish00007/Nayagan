import React from 'react'
import { Link } from 'react-router-dom'
import { navItems } from '../../static/data'
import styles from '../../styles/styles'
import { useSelector } from 'react-redux'
import { AiOutlineCalendar } from 'react-icons/ai'

const Navbar = ({ active }) => {
    const { allEvents } = useSelector((state) => state.events);

    return (
        <div className={`block 800px:${styles.noramlFlex}`}>
            {
                navItems.map((i, index) => (
                    <div className='flex relative group' key={index}>
                        <Link to={i.url}
                            className={`${active === index + 1 ? "text-[#17dd1f]" : "text-black 800px:text-[#fff]"} pb-[30px] 800px:pb-0 font-[500] px-6 cursor-pointer`}
                        >
                            {i.title}
                        </Link>
                        {i.title === "Events" && allEvents?.length === 0 && (
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                <div className="flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                        <AiOutlineCalendar size={24} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-1">No Events Available</h3>
                                    <p className="text-xs text-gray-500 text-center">
                                        Check back later for exciting promotions!
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default Navbar