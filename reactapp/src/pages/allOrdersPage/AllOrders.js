import React, { useState, useEffect } from "react";
import axios from "axios";
import AllOrdersNav from "./AllOrdersNav";
import "./AllOrders.css";
import UnshipButton from "./UnshipButton";
import Pagination from "./Pagination"; // Import the Pagination component

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [currentDate, setCurrentDate] = useState("");
  const [fadingRows, setFadingRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);

  useEffect(() => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
    fetchAllOrders();
  }, [sortOption]);

  const fetchAllOrders = () => {
    axios
      .get("http://127.0.0.1:8000/all-orders/")
      .then((response) => {
        const filteredAllOrders = response.data;
        filteredAllOrders.sort((a, b) => (a.ship_date < b.ship_date ? 1 : -1));
        setAllOrders(filteredAllOrders);
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  };

  const handleUnship = (orderId) => {
    setFadingRows([...fadingRows, orderId]);
    axios
      .put(`http://127.0.0.1:8000/all-orders/${orderId}/`, {
        shipped: false,
      })
      .then((response) => {
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((rowId) => rowId !== orderId)
          );
          setAllOrders((prevAllOrders) =>
            prevAllOrders.filter((o) => o.id !== orderId)
          );
        }, 500);
      })
      .catch((error) => {
        console.error(
          "Error deleting the order. Server responded with:",
          error.response.status
        );
      });
  };
  const extractTextBeforeParentheses = (text) => {
    const splitText = text.split(" (");
    return splitText[0];
  };
  const onPageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > Math.ceil(allOrders.length / ordersPerPage)
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleFilterOrders = (query) => {
    if (query === "") {
      fetchAllOrders();
    } else {
      axios
        .get(`http://127.0.0.1:8000/all-orders-search/?search=${query}`)
        .then((response) => {
          const filteredAllOrders = response.data;
          filteredAllOrders.sort((a, b) =>
            a.ship_date < b.ship_date ? 1 : -1
          );
          setAllOrders(filteredAllOrders);
        })
        .catch((error) => {
          console.error("Error searching orders:", error);
        });
    }
  };

  return (
    <div className="all-main-div">
      <AllOrdersNav handleFilterOrders={handleFilterOrders} />
      <div className="all-orders-table-container">
      <table className="all-orders-table">
        <thead>
          <tr>
            <th id="ship-date">Ship Date</th>
            <th id="order-number">Order Number</th>
            <th id="customer">Customer</th>
            <th id="items">Items</th>
            <th id="packages">Packages</th>
            <th id="notes">Notes</th>
            <th id="shipped">Shipped</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr
              key={order.id}
              className={fadingRows.includes(order.id) ? "row-fade-out" : ""}
            >
              <td>{order.ship_date}</td>
              <td>{order.order_number}</td>
              <td>{order.customer_name}</td>
              <td>
                <table className="item-table">
                  <tbody>
                    {Object.keys(order.item_subtype_dict).map(
                      (itemType, index) => (
                        <tr key={index}>
                          <td id="item">
                            {extractTextBeforeParentheses(itemType)}
                          </td>
                          <td id="qty">{order.item_subtype_dict[itemType]}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </td>
              <td>
                <table className="package-table">
                  <tbody>
                    {Array.isArray(order.packages_array) &&
                      order.packages_array.map((packageItem, index) => (
                        <tr
                          key={index}
                          className={
                            fadingRows.includes(order.id) ? "row-fade-out" : ""
                          }
                        >
                          <td id="box-number">{index + 1}</td>TEST!
                          <td id="dimensions">{packageItem.dimensions}</td>
                          <td id="weight">{packageItem.weight} lb</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </td>
              <td>
                {order.notes_array && Array.isArray(order.notes_array) ? (
                  <table className="notes-table">
                    <tbody>
                      {order.notes_array.map((noteItem, index) => (
                        <tr key={index}>
                          <td>{noteItem.noteText}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  ""
                )}
              </td>
              <td id="shipped">
                {order.shipped === false ? (
                  "No"
                ) : (
                  <UnshipButton order={order} handleUnship={handleUnship} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(allOrders.length / ordersPerPage)}
        onPageChange={onPageChange}
        itemsPerPage={ordersPerPage}
      />
    </div>
  );
};
export default AllOrders;
