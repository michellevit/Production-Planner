import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllOrders.css";
import OrderNav from "../../components/OrderNav";
import EditShipDateButton from "./EditShipDateButton";
import UnshipButton from "./UnshipButton";
import DeleteButton from "./DeleteButton";
import QuoteFlag from "./QuoteFlag";
import Pagination from "./Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faStar } from "@fortawesome/free-solid-svg-icons";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [fadingRows, setFadingRows] = useState([]);
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numberOfFilters, setNumberOfFilters] = useState("");
  const ordersPerPage = 20;
  // Sort Filters: Select + Search
  const [currentView, setCurrentView] = useState(
    JSON.parse(localStorage.getItem("allOrders_currentView")) || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  // Sort Filters: Checkboxes
  const [confirmedChecked, setConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_confirmedChecked")) || false
  );
  const [notConfirmedChecked, setNotConfirmedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_notConfirmedChecked")) || false
  );
  const [readyChecked, setReadyChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_readyChecked")) || false
  );
  const [notReadyChecked, setNotReadyChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_notReadyChecked")) || false
  );
  const [shippedChecked, setShippedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_shippedChecked")) || false
  );
  const [notShippedChecked, setNotShippedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_notShippedChecked")) || false
  );
  const [delayedChecked, setDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_delayedChecked")) || false
  );
  const [notDelayedChecked, setNotDelayedChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_notDelayedChecked")) || false
  );
  const [quoteChecked, setQuoteChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_quoteChecked")) || false
  );
  const [notQuoteChecked, setNotQuoteChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_notQuoteChecked")) || false
  );
  const [oldestChecked, setOldestChecked] = useState(
    JSON.parse(localStorage.getItem("allOrders_oldestChecked")) || false
  );

  useEffect(() => {
    const formattedDate = new Date();
    formattedDate.setHours(0, 0, 0, 1);
    setCurrentDate(formattedDate);
    countNumberOfFilters();
    const fetchOrders = async () => {
      try {
        const filterParams = [
          `confirmed_checked=${confirmedChecked}`,
          `not_confirmed_checked=${notConfirmedChecked}`,
          `ready_checked=${readyChecked}`,
          `not_ready_checked=${notReadyChecked}`,
          `shipped_checked=${shippedChecked}`,
          `not_shipped_checked=${notShippedChecked}`,
          `delayed_checked=${delayedChecked}`,
          `not_delayed_checked=${notDelayedChecked}`,
          `quote_checked=${quoteChecked}`,
          `not_quote_checked=${notQuoteChecked}`,
          `oldest_checked=${oldestChecked}`,
        ]
          .filter((param) => param.endsWith("_checked=true"))
          .join("&");
        const requestUrl = `http://127.0.0.1:8000/orders-filtered/?type=all&filter=${currentView}&search=${searchQuery}&page=${currentPage}&${filterParams}`;
        const response = await axios.get(requestUrl);
        setOrders(response.data.results);
        setTotalPages(Math.ceil(response.data.count / ordersPerPage));
      } catch (error) {
        console.error("Error getting data", error);
      }
    };

    fetchOrders();
    setRefreshOrders(false);
  }, [
    refreshOrders,
    currentView,
    searchQuery,
    currentPage,
    confirmedChecked,
    notConfirmedChecked,
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    notDelayedChecked,
    quoteChecked,
    notQuoteChecked,
    oldestChecked,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    localStorage.setItem("allOrders_currentView", JSON.stringify(currentView));
    localStorage.setItem("allOrders_confirmedChecked", JSON.stringify(confirmedChecked));
    localStorage.setItem(
      "allOrders_notConfirmedChecked",
      JSON.stringify(notConfirmedChecked)
    );
    localStorage.setItem("allOrders_readyChecked", JSON.stringify(readyChecked));
    localStorage.setItem("allOrders_notReadyChecked", JSON.stringify(notReadyChecked));
    localStorage.setItem("allOrders_shippedChecked", JSON.stringify(shippedChecked));
    localStorage.setItem(
      "allOrders_notShippedChecked",
      JSON.stringify(notShippedChecked)
    );
    localStorage.setItem("allOrders_delayedChecked", JSON.stringify(delayedChecked));
    localStorage.setItem("allOrders_notDelayedChecked", JSON.stringify(notDelayedChecked));
    localStorage.setItem("allOrders_quoteChecked", JSON.stringify(quoteChecked));
    localStorage.setItem("allOrders_notQuoteChecked", JSON.stringify(notQuoteChecked));
    localStorage.setItem("allOrders_oldestChecked", JSON.stringify(oldestChecked));
  }, [
    currentView,
    confirmedChecked,
    notConfirmedChecked,
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    notDelayedChecked,
    quoteChecked,
    notQuoteChecked,
    oldestChecked,
  ]);

  const countNumberOfFilters = () => {
    const filterStates = [
      confirmedChecked,
      notConfirmedChecked,
      readyChecked,
      notReadyChecked,
      shippedChecked,
      notShippedChecked,
      delayedChecked,
      notDelayedChecked,
      quoteChecked,
      notQuoteChecked,
    ];
    const numberOfActiveFilters = filterStates.filter(
      (state) => state === true
    ).length;
    setNumberOfFilters(
      numberOfActiveFilters > 0 ? `(${numberOfActiveFilters})` : ""
    );
  };

  const handleSortChange = (filterChoice) => {
    setCurrentPage(1);
    setCurrentView(filterChoice);
    localStorage.setItem("currentView", JSON.stringify(filterChoice));
  };

  const handleSearchOrders = (query) => {
    setCurrentPage(1);
    setSearchQuery(query);
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
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === currentOrderID ? updatedOrder : o))
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
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === currentOrderID ? updatedOrder : o))
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
      <OrderNav
        handleSortChange={handleSortChange}
        handleSearchOrders={handleSearchOrders}
        currentView={currentView}
        numberOfFilters={numberOfFilters}
        confirmedChecked={confirmedChecked}
        setConfirmedChecked={setConfirmedChecked}
        notConfirmedChecked={notConfirmedChecked}
        setNotConfirmedChecked={setNotConfirmedChecked}
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
        notDelayedChecked={notDelayedChecked}
        setNotDelayedChecked={setNotDelayedChecked}
        quoteChecked={quoteChecked}
        setQuoteChecked={setQuoteChecked}
        notQuoteChecked={notQuoteChecked}
        setNotQuoteChecked={setNotQuoteChecked}
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
              <th id="confirmed">Confirmed</th>
              <th id="ready">Ready</th>
              <th id="shipped">Shipped</th>
              <th id="delete-col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-orders-message">
                  No orders to display
                </td>
              </tr>
            ) : (
              orders.map((order) => (
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
                  <td id="confirmed">
                    {order.confirmed === true ? (
                      <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    ) : (
                      <FontAwesomeIcon icon={faClose} className="x-icon" />
                    )}
                  </td>
                  <td id="ready">
                    {order.ready === true && order.quote === true ? (
                      <FontAwesomeIcon icon={faStar} className="star-icon" />
                    ) : order.ready === true ? (
                      <FontAwesomeIcon icon={faCheck} className="check-icon" />
                    ) : (
                      <FontAwesomeIcon icon={faClose} className="x-icon" />
                    )}
                  </td>
                  <td id="shipped">
                    <div id="shipped-status-div">
                      {order.shipped === true ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="check-icon"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faClose} className="x-icon" />
                      )}
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
                      setOrders={setOrders}
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
