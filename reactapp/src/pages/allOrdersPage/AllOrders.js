import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AllOrders.css";
import AllOrdersNav from "./AllOrdersNav";
import EditShipDateButton from "./EditShipDateButton";
import UnshipButton from "./UnshipButton";
import DeleteButton from "./DeleteButton";
import Pagination from "./Pagination";


const AllOrders = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [isRemoving, setIsRemoving] = useState(false);
  const [sortOption, setSortOption] = useState("All");
  const [currentDate, setCurrentDate] = useState("");
  const [refreshOrders, setRefreshOrders] = useState(false);
  const [readyChecked, setReadyChecked] = useState(true);
  const [notReadyChecked, setNotReadyChecked] = useState(true);
  const [shippedChecked, setShippedChecked] = useState(true);
  const [notShippedChecked, setNotShippedChecked] = useState(true);
  const [delayedChecked, setDelayedChecked] = useState(true);
  const [oldestChecked, setOldestChecked] = useState(false);
  const [fadingRows, setFadingRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const formattedDate = new Date();
    formattedDate.setHours(0, 0, 0, 1);
    setCurrentDate(formattedDate);
    const fetchAllOrders = () => {
      axios
        .get("http://127.0.0.1:8000/all-orders/")
        .then((response) => {
          let filteredAllOrders = response.data;
          if (searchQuery !== "") {
            filteredAllOrders = handleSearchOrders(searchQuery);
          } else {
            filteredAllOrders = applySorting(filteredAllOrders);
          }
          setAllOrders(filteredAllOrders);
          const newTotalPages = Math.ceil(
            (filteredAllOrders?.length || 0) / ordersPerPage
          );
          if (currentPage > newTotalPages) {
            setCurrentPage(1);
          }
        })
        .catch((error) => {
          console.error("Error getting data", error);
        })
    };
    fetchAllOrders();

  }, [
    sortOption,
    readyChecked,
    notReadyChecked,
    shippedChecked,
    notShippedChecked,
    delayedChecked,
    oldestChecked,
    searchQuery,
    currentPage,
    refreshOrders,
  ]);

  const applySorting = (filteredAllOrders) => {
    let filterByAll = false;
    let filterByUpcoming = false;
    let filterByPast = false;
    let filterByToday = false;
    let filterByTomorrow = false;
    let filterByThisWeek = false;
    let filterByNextWeek = false;
    let filterByThisMonth = false;
    let filterByLastWeek = false;
    let filterByLastMonth = false;
    switch (sortOption) {
      case "All":
        filterByAll = true;
        break;
      case "Upcoming":
        filterByUpcoming = true;
        break;
      case "Past":
        filterByPast = true;
        break;
      case "Today":
        filterByToday = true;
        break;
      case "Tomorrow":
        filterByTomorrow = true;
        break;
      case "This-Week":
        filterByThisWeek = true;
        break;
      case "Next-Week":
        filterByNextWeek = true;
        break;
      case "This-Month":
        filterByThisMonth = true;
        break;
      case "Last-Week":
        filterByLastWeek = true;
        break;
      case "Last-Month":
        filterByLastMonth = true;
        break;
      default:
        filterByAll = true;
    }
    if (readyChecked && notReadyChecked && delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready != null
      );
    }
    if (readyChecked && !notReadyChecked && !delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready === true
      );
    }
    if (readyChecked && notReadyChecked && !delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready != null && order.delay_date === null
      );
    }
    if (readyChecked && !notReadyChecked && delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready === true
      );
    }
    if (!readyChecked && notReadyChecked && delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready === false
      );
    }
    if (!readyChecked && notReadyChecked && !delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready === false && order.delay_date === null
      );
    }
    if (!readyChecked && !notReadyChecked && delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.delay_date != null
      );
    }
    if (!readyChecked && !notReadyChecked && !delayedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.ready === null
      );
    }
    if (shippedChecked && notShippedChecked) {
    } else if (shippedChecked && !notShippedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.shipped === true
      );
    } else if (!shippedChecked && notShippedChecked) {
      filteredAllOrders = filteredAllOrders.filter(
        (order) => order.shipped === false
      );
    } else {
      filteredAllOrders = [];
    }
    if (filterByUpcoming) {
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        const today = new Date(currentDate);
        today.setUTCHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        return orderDateTimestamp >= todayTimestamp;
      });
    }
    if (filterByPast) {
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        const today = new Date(currentDate);
        today.setUTCHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();
        return orderDateTimestamp < todayTimestamp;
      });
    }
    if (filterByToday) {
      const today = new Date(currentDate);
      today.setUTCHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        return orderDateTimestamp === todayTimestamp;
      });
    }
    if (filterByTomorrow) {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const tomorrowTimestamp = tomorrow.getTime();
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        const orderDateTimestamp = orderDate.getTime();
        return orderDateTimestamp === tomorrowTimestamp;
      });
    }
    if (filterByThisWeek) {
      const today = new Date(currentDate);
      const currentDayOfWeek = today.getDay();
      const daysUntilSunday = 7 - currentDayOfWeek;
      let startOfWeek = new Date(today);
      let endOfWeek = new Date(today);
      if (currentDayOfWeek === 0) {
        startOfWeek.setDate(today.getDate());
        endOfWeek.setDate(today.getDate() + 6);
      } else {
        startOfWeek.setDate(today.getDate() - currentDayOfWeek);
        endOfWeek.setDate(today.getDate() + daysUntilSunday - 1);
      }
      startOfWeek.setUTCHours(0, 0, 0, 0);
      endOfWeek.setUTCHours(23, 59, 59, 999);
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
    }
    if (filterByNextWeek) {
      const today = new Date(currentDate);
      const currentDayOfWeek = today.getDay();
      const daysUntilSunday = 7 - currentDayOfWeek;
      let startOfNextWeek = new Date(today);
      let endOfNextWeek = new Date(today);
      if (currentDayOfWeek === 0) {
        startOfNextWeek.setDate(today.getDate() + 7);
        endOfNextWeek.setDate(today.getDate() + 13);
      } else {
        startOfNextWeek.setDate(today.getDate() + daysUntilSunday);
        endOfNextWeek.setDate(today.getDate() + daysUntilSunday + 6);
      }
      startOfNextWeek.setUTCHours(0, 0, 0, 0);
      endOfNextWeek.setUTCHours(23, 59, 59, 999);
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfNextWeek && orderDate <= endOfNextWeek;
      });
    }
    if (filterByThisMonth) {
      const startOfMonth = new Date(currentDate);
      startOfMonth.setDate(1);
      startOfMonth.setUTCHours(0, 0, 0, 0);
      const endOfMonth = new Date(currentDate);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setUTCHours(23, 59, 59, 999);
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= startOfMonth && orderDate <= endOfMonth;
      });
    }
    if (filterByLastWeek) {
      const today = new Date(currentDate);
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - today.getDay());
      currentWeekStart.setUTCHours(0, 0, 0, 0);
      const lastWeekEnd = new Date(currentWeekStart);
      lastWeekEnd.setDate(currentWeekStart.getDate() - 1);
      lastWeekEnd.setUTCHours(23, 59, 59, 999);
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
      lastWeekStart.setUTCHours(0, 0, 0, 0);
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
      });
    }
    if (filterByLastMonth) {
      const today = new Date(currentDate);
      const currentMonthStart = new Date(today);
      currentMonthStart.setUTCHours(0, 0, 0, 0);
      currentMonthStart.setDate(1);
      const lastMonthEnd = new Date(currentMonthStart - 1);
      lastMonthEnd.setUTCHours(23, 59, 59, 999);
      lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
      const lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setDate(1);
      lastMonthStart.setUTCHours(0, 0, 0, 0);
      filteredAllOrders = filteredAllOrders.filter((order) => {
        const orderDate = new Date(order.ship_date);
        orderDate.setUTCHours(0, 0, 0, 0);
        return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
      });
    }
    if (oldestChecked) {
      filteredAllOrders.sort((a, b) => (a.ship_date > b.ship_date ? 1 : -1));
    } else {
      filteredAllOrders.sort((a, b) => (a.ship_date < b.ship_date ? 1 : -1));
    }
    return filteredAllOrders;
  };

  const handleSortChange = (event) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
  };

  const handleSearchOrders = (query) => {
    if (query === "") {
      setSearchQuery("");
    } else {
      axios
        .get(`http://127.0.0.1:8000/all-orders-search/?search=${query}`)
        .then((response) => {
          let filteredAllOrders = response.data;
          filteredAllOrders = applySorting(filteredAllOrders);
          setAllOrders(filteredAllOrders);
          return filteredAllOrders;
        })
        .catch((error) => {
          console.error("Error searching orders:", error);
        });
    }
  };

  const editShipDate = async (order, date) => {
    try {
      const formattedDate = date ? date.toISOString().split("T")[0] : null;
      const updatedOrder = order;
      updatedOrder.ship_date = formattedDate;
      await axios.put(
        `http://127.0.0.1:8000/all-orders/${order.id}/`,
        updatedOrder
      );
      setRefreshOrders(true);
    } catch (error) {
      console.error("Error updating order:", error);
    }
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
    setCurrentPage(() => pageNumber);
  };
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = allOrders
    ? allOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    : [];
  const totalPages =
    allOrders && allOrders.length > 0
      ? Math.ceil(allOrders.length / ordersPerPage)
      : 0;

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
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-orders-message">
                  No orders to display
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className={
                    fadingRows.includes(order.id) ? "row-fade-out" : ""
                  }
                >
                  <td id="ship-date">
                    <EditShipDateButton
                      order={order}
                      editShipDate={editShipDate}
                    />
                    {order.delay_date !== null ? (
                      <div style={{ fontSize: "smaller", color: "red" }}>
                        *Delayed: {order.delay_date}
                      </div>
                    ) : null}
                  </td>
                  <td id="order-number">{order.order_number}</td>
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
                              <td id="weight">{packageItem.weight} lb</td>
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
                  <td id="ready">{order.ready === false ? "No" : "Yes"}</td>
                  <td id="shipped">
                    {order.shipped === false ? (
                      "No"
                    ) : (
                      <UnshipButton order={order} handleUnship={handleUnship} />
                    )}
                  </td>
                  <td id="delete-col">
                      <DeleteButton 
                        order={order}
                        allOrders={allOrders}
                        setAllOrders={setAllOrders}
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
        totalPages={totalPages}
        onPageChange={onPageChange}
        itemsPerPage={ordersPerPage}
      />
    </div>
  );
};
export default AllOrders;
