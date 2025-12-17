import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../server";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(`${server}/order/admin-all-orders`, { withCredentials: true })
      .then((res) => {
        const fetchedOrders = res.data?.orders;
        if (Array.isArray(fetchedOrders)) {
          setOrders(fetchedOrders);
        } else {
          setOrders([]); // fallback to empty array
        }
      })
      .catch((err) => {
        console.error("Failed to fetch orders", err);
        setOrders([]); // fallback on error
      });
  }, []);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const filteredOrders = orders.length > 0
    ? orders.filter((order) => {
        const customerName = order.user?.name?.toLowerCase() || "";
        const orderId = order._id?.toLowerCase() || "";
        const status = order.status?.toLowerCase() || "";
        const search = searchTerm.toLowerCase();

        const matchesSearch =
          customerName.includes(search) ||
          orderId.includes(search) ||
          status.includes(search);

        const orderDate = new Date(order.createdAt);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesDate =
          (!start || orderDate >= start) &&
          (!end || orderDate <= new Date(end.setDate(end.getDate() + 1)));

        return matchesSearch && matchesDate;
      })
    : [];

  const row = filteredOrders.map((item) => {
    return {
      id: item._id || "",
      status: item.status || "N/A",
      itemsQty: Array.isArray(item.cart) ? item.cart.length : 0,
      total: item.totalPrice ? `₹${item.totalPrice}` : "N/A",
      createdAt: item.createdAt,
    };
  });

  const columns = [
    { field: "id", headerName: "Order ID", width: 200 },
    { field: "status", headerName: "Status", width: 130 },
    { field: "itemsQty", headerName: "Items Qty", width: 130 },
    { field: "total", headerName: "Total", width: 130 },
    {
      field: "createdAt",
      headerName: "Order Time",
      width: 200,
      valueFormatter: (params) => formatTime(params.value),
    },
  ];

  return (
    <div className="w-full p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen overflow-hidden">
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-auto"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-auto"
        />
      </div>

      <div className="w-full min-h-[70vh] relative overflow-hidden">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
          className="!border-none"
          getRowHeight={() => "auto"}
          rowHeight={90}
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              background: "transparent",
              borderRadius: "20px",
              overflow: "hidden",
            },
            "& .MuiDataGrid-row": {
              minHeight: "90px",
              borderRadius: "12px",
              transition: "all 0.3s ease",
            },
            "& .MuiDataGrid-row:hover": {
              background: "rgba(255, 255, 255, 0.9)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowX: "hidden !important",
            },
            "& .MuiDataGrid-footerContainer": {
              overflowX: "hidden !important",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AllOrders;
