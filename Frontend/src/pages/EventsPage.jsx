import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { AiOutlineCalendar, AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { getAllEvents } from "../redux/actions/event";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (allEvents) {
      let filtered = allEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort events
      switch (sortBy) {
        case "newest":
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "oldest":
          filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "price-low":
          filtered.sort((a, b) => a.discountPrice - b.discountPrice);
          break;
        case "price-high":
          filtered.sort((a, b) => b.discountPrice - a.discountPrice);
          break;
        default:
          break;
      }

      setFilteredEvents(filtered);
    }
  }, [allEvents, searchTerm, sortBy]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Header activeHeading={4} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">All Events</h1>
              <p className="text-lg text-gray-600">Discover amazing deals and exclusive offers</p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  />
                  <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event._id} active={true} data={event} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <AiOutlineCalendar size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">No Events Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {searchTerm ? "No events match your search criteria. Try different keywords." : "There are currently no events to display. Check back later for exciting promotions and offers!"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
