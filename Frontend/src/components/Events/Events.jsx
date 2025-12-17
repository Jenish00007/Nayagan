import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import EventCard from "./EventCard";
import { AiOutlineCalendar } from "react-icons/ai";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>

          <div className="w-full grid">
            {allEvents.length !== 0 ? (
              <EventCard data={allEvents && allEvents[0]} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <AiOutlineCalendar size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Available</h3>
                <p className="text-gray-500 text-center max-w-sm">
                  There are currently no events to display. Check back later for exciting promotions and offers!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
