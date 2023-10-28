import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllOrders.css";
import AllOrdersNav from "./AllOrdersNav";
import EditShipDateButton from "./EditShipDateButton";
import UnshipButton from "./UnshipButton";
import DeleteButton from "./DeleteButton";
import QuoteFlag from "./QuoteFlag";
import Pagination from "./Pagination";

const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [fadingRows, setFadingRows] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 20;
  // Sort Filters: Select + Search
  const [currentView, setCurrentView] = useState("all-orders-filtered");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryFormatted, setSearchQueryFormatted] = useState("");
  const [urlCharacter, setURLCharacter] = useState("/?");
  // Sort Filters: Checkboxes
  const [readyChecked, setReadyChecked] = useState(true);
  const [notReadyChecked, setNotReadyChecked] = useState(true);
  const [shippedChecked, setShippedChecked] = useState(true);
  const [notShippedChecked, setNotShippedChecked] = useState(true);
  const [delayedChecked, setDelayedChecked] = useState(true);
  const [oldestChecked, setOldestChecked] = useState(false);

  useEffect(() => {
    const formattedDate = new Date();
    setCurrentDate(formattedDate);
    const fetchAllOrders = () => {
      const filterParams = [
        `ready_checked=${readyChecked}`,
        `not_ready_checked=${notReadyChecked}`,
        `shipped_checked=${shippedChecked}`,
        `not_shipped_checked=${notShippedChecked}`,
        `delayed_checked=${delayedChecked}`,
        `oldest_checked=${oldestChecked}`,
      ].filter(param => param.endsWith('_checked=true')).join('&');
      axios
        .get(
          `http://127.0.0.1:8000/${currentView}${searchQueryFormatted}${urlCharacter}page=${currentPage}&${filterParams}`
        )
        .then((response) => {
          let filteredAllOrders = response.data.results;
          setTotalPages(Math.ceil(response.data.count / ordersPerPage));
          setAllOrders(filteredAllOrders);
        })
        .catch((error) => {
          console.error("Error getting data", error);
        });
    };
    fetchAllOrders();
    setRefreshOrders(false);
  }, [
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    oldestChecked,
    refreshOrders,
    currentPage,
  ]);

  const handleSortChange = (filterChoice) => {
    setCurrentPage(1); 
    setCurrentView(`all-orders-filtered/?filter=${filterChoice}`);
    setURLCharacter("&");
    setRefreshOrders(true);
  };

  const handleSearchOrders = (query) => {
    if (query === "") {
      setSearchQuery("");
      setSearchQueryFormatted("");
      setCurrentView("all-orders-filtered");
      setURLCharacter("/?");
      setRefreshOrders(true);
    } else {
      setCurrentPage(1);
      setCurrentView(`all-orders-search`);
      setSearchQueryFormatted(`/?search=${query}`);
      setURLCharacter("&");
      setRefreshOrders(true);
    }
  };

  const editShipDate = async (order, date) => {
    try {
      setFadingRows((prevFadingRows) => [...prevFadingRows, order.id]);
      const formattedDate = date ? date.toISOString().split("T")[0] : null;
      const updatedOrder = order;
      updatedOrder.ship_date = formattedDate;
      updatedOrder.delay_date = null;
      updatedOrder.delay_tbd = false;
      setTimeout(async () => {
        await axios.put(
          `http://127.0.0.1:8000/all-orders/${order.id}/`,
          updatedOrder
        );
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((id) => id !== order.id)
          );
          setRefreshOrders(true);
        }, 700);
      }, 700);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const editDelayDate = async (order, date) => {
    try {
      setFadingRows((prevFadingRows) => [...prevFadingRows, order.id]);
      const formattedDate = date ? date.toISOString().split("T")[0] : null;
      const updatedOrder = order;
      updatedOrder.delay_date = formattedDate;
      updatedOrder.delay_tbd = false;
      setTimeout(async () => {
        await axios.put(
          `http://127.0.0.1:8000/all-orders/${order.id}/`,
          updatedOrder
        );
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((id) => id !== order.id)
          );
          setRefreshOrders(true);
        }, 700);
      }, 700);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const editDelayTBD = async (order, tbdStatus) => {
    try {
      setFadingRows((prevFadingRows) => [...prevFadingRows, order.id]);
      const updatedOrder = order;
      updatedOrder.delay_tbd = tbdStatus;
      updatedOrder.ready = false;
      setTimeout(async () => {
        await axios.put(
          `http://127.0.0.1:8000/all-orders/${order.id}/`,
          updatedOrder
        );
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((id) => id !== order.id)
          );
          setRefreshOrders(true);
        }, 700);
      }, 700);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  const handleUnship = async (order) => {
    try {
      setFadingRows((prevFadingRows) => [...prevFadingRows, order.id]);
      let currentOrderID = order.id;
      const updatedOrder = { ...order };
      updatedOrder.shipped = !order.shipped;
      updatedOrder.ready = true;
      setTimeout(async () => {
        await axios.put(
          `http://127.0.0.1:8000/all-orders/${order.id}/`,
          updatedOrder
        );
        setAllOrders((prevAllOrders) =>
          prevAllOrders.map((o) => (o.id === currentOrderID ? updatedOrder : o))
        );
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((id) => id !== order.id)
          );
        }, 400);
      }, 400);
    } catch (error) {
      console.error(
        "Error updating the order. Server responded with:",
        error.response.status
      );
    }
  };

  const handleUnquote = async (order) => {
    try {
      setFadingRows((prevFadingRows) => [...prevFadingRows, order.id]);
      let currentOrderID = order.id;
      const updatedOrder = order;
      updatedOrder.quote = false;
      updatedOrder.ready = false;
      setTimeout(async () => {
        await axios.put(
          `http://127.0.0.1:8000/all-orders/${order.id}/`,
          updatedOrder
        );
        setAllOrders((prevAllOrders) =>
          prevAllOrders.map((o) => (o.id === currentOrderID ? updatedOrder : o))
        );
        setTimeout(() => {
          setFadingRows((prevFadingRows) =>
            prevFadingRows.filter((id) => id !== order.id)
          );
        }, 400);
      }, 400);
    } catch (error) {
      console.error(
        "Error updating the order. Server responded with:",
        error.response.status
      );
    }
  };

  const extractTextBeforeParentheses = (text) => {
    const splitText = text.split(" (");
    return splitText[0];
  };

  return (
    <div className="all-main-div">
      <AllOrdersNav
        handleSortChange={handleSortChange}
        handleSearchOrders={handleSearchOrders}
        readyChecked={readyChecked}
        setReadyChecked={setReadyChecked}
        notReadyChecked={notReadyChecked}
        shippedChecked={shippedChecked}
        setShippedChecked={setShippedChecked}
        notShippedChecked={notShippedChecked}
        setNotShippedChecked={setNotShippedChecked}
        setNotReadyChecked={setNotReadyChecked}
        delayedChecked={delayedChecked}
        setDelayedChecked={setDelayedChecked}
        oldestChecked={oldestChecked}
        setOldestChecked={setOldestChecked}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
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
              <th id="ready">Ready</th>
              <th id="shipped">Shipped</th>
              <th id="delete-col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-orders-message">
                  No orders to display
                </td>
              </tr>
            ) : (
              allOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`${
                    fadingRows.includes(order.id) || order.isRemoving
                      ? "fade-out"
                      : ""
                  }`}
                >
                  <td id="ship-date">
                    <EditShipDateButton
                      order={order}
                      currentDate={currentDate}
                      editShipDate={editShipDate}
                      editDelayDate={editDelayDate}
                      editDelayTBD={editDelayTBD}
                    />
                  </td>
                  <td id="order-number">
                    {order.order_number}
                    {order.quote ? (
                      <QuoteFlag handleUnquote={handleUnquote} order={order} />
                    ) : null}
                  </td>
                  <td id="customer-name">{order.customer_name}</td>
                  <td id="items">
                    <table className="item-table">
                      <tbody>
                        {Object.keys(order.item_subtype_dict).map(
                          (itemType, index) => (
                            <tr key={index}>
                              <td id="item">
                                {extractTextBeforeParentheses(itemType)}
                              </td>
                              <td id="qty">
                                {order.item_subtype_dict[itemType]}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </td>
                  <td id="packages">
                    <table className="package-table">
                      <tbody>
                        {Array.isArray(order.packages_array) &&
                          order.packages_array.map((packageItem, index) => (
                            <tr
                              key={index}
                              className={
                                fadingRows.includes(order.id)
                                  ? "row-fade-out"
                                  : ""
                              }
                            >
                              <td id="box-number">{index + 1}</td>
                              <td id="dimensions">{packageItem.dimensions}</td>
                              <td id="weight">
                                {packageItem.weight === "" && <span></span>}
                                {packageItem.dimensions !== "TBD" &&
                                  packageItem.weight === "TBD" && (
                                    <span>TBD</span>
                                  )}
                                {packageItem.dimensions === "TBD" &&
                                  packageItem.weight === "TBD" && <span></span>}
                                {packageItem.weight !== "TBD" &&
                                  packageItem.weight !== "" &&
                                  packageItem.weight + " lb"}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </td>
                  <td id="notes">
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
                  <td id="ready">
                    {order.ready === false || order.quote ? "No" : "Yes"}
                  </td>
                  <td id="shipped">
                    <div id="shipped-status-div">
                      {order.shipped === false ? "No" : "Yes"}
                      {order.quote ? null : (
                        <UnshipButton
                          order={order}
                          handleUnship={handleUnship}
                        />
                      )}
                    </div>
                  </td>
                  <td id="delete-col">
                    <DeleteButton
                      order={order}
                      setAllOrders={setAllOrders}
                      isRemoving={isRemoving}
                      setIsRemoving={setIsRemoving}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};
export default AllOrders;
