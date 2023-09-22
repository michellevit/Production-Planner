import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ClosedOrders.css";
import UnshipButton from "./UnshipButton";
import Pagination from "./Pagination"; // Import the Pagination component

const ClosedOrders = () => {
  const [closedOrders, setClosedOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [fadingRows, setFadingRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);
  useEffect(() => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString(undefined, options);
    setCurrentDate(formattedDate);
    axios
      .get("http://127.0.0.1:8000/closed-orders/")
      .then((response) => {
        const filteredClosedOrders = response.data.filter(
          (order) => order.shipped
        );
        filteredClosedOrders.sort((a, b) =>
          a.ship_date < b.ship_date ? 1 : -1
        );
        setClosedOrders(filteredClosedOrders);
      })
      .catch((error) => {
        console.error("Error getting data", error);
      });
  }, []);
  const handleUnship = (orderId) => {
    setFadingRows((prevFadingRows) => [...prevFadingRows, orderId]);
    axios
      .put(`http://127.0.0.1:8000/closed-orders/${orderId}/`, {
        shipped: false,
      })
      .then((response) => {
        const updatedOrders = closedOrders.filter((o) => o.id !== orderId);
        setClosedOrders(updatedOrders);
        setFadingRows((prevFadingRows) =>
          prevFadingRows.filter((rowId) => rowId !== orderId)
        );
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
      pageNumber > Math.ceil(closedOrders.length / ordersPerPage)
    ) {
      return;
    }
    setCurrentPage(pageNumber);
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = closedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  return (
    <div className="main-div">
      <header>
        <h1>Closed Orders</h1>
      </header>
      <h2>{currentDate}</h2>
      <table className="closed-orders-table">
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
                    {order.packages_array.map((packageItem, index) => (
                      <tr
                        key={order.id}
                        className={
                          fadingRows.includes(order.id) ? "row-fade-out" : ""
                        }
                      >
                        <td id="box-number">{index + 1}</td>
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
                {order.shipped === 1 ? (
                  "No"
                ) : (
                  <UnshipButton order={order} handleUnship={handleUnship} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(closedOrders.length / ordersPerPage)}
        onPageChange={onPageChange}
        itemsPerPage={ordersPerPage}
      />
    </div>
  );
};
export default ClosedOrders;
