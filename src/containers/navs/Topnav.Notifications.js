import React, { useState, useEffect  } from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { connect } from 'react-redux';
import {
  resetNotificationCount }
from '../../redux/reporting/actions';
 
import notifications from "../../data/notifications";
import { array } from "yup";

const NotificationItem = ({ img, title, date }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom">
      {/* <a href="/app/pages/details">
        <img
          src={img}
          alt={title}
          className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
        />
      </a> */}
      <div className="pl-3 pr-2">
        <a href="/app/pages/details">
          <p className="font-weight-medium mb-1">{title}</p>
          <p className="text-muted mb-0 text-small">{date}</p>
        </a>
      </div>
    </div>
  );
};

const TopnavNotifications = ({ data, notificationCount, resetNotificationCount }) => {
  const [count, setCount] = useState(0);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (data && length == 0) {
      let count = data.length;
      setLength(count);
    }

    if (data && length > 0) {
      let count = data.length - length;
      setCount(count);
    }
  }, []);

  function onClickHandler(e) {
    resetNotificationCount();
  }

  return (
    <div className="position-relative d-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
          onClick={onClickHandler}
        >
          {
            notificationCount > 0 ? (
            <div>
            <i className="simple-icon-bell" />
            <span className="count">{notificationCount}</span> </div> ) :
            (<div><i className="simple-icon-bell" />
            </div>)
          }
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          right
          id="notificationDropdown"
        >
          <PerfectScrollbar
            options={{ suppressScrollX: true, wheelPropagation: false }}
          >
            {data?.map((notification, index) => {
              return <NotificationItem key={index} {...notification} />;
            })}
          </PerfectScrollbar>
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

const mapStateToProps = state => ({
  notifications: state.notifications,
});

const mapActionsToProps = { resetNotificationCount };

export default connect(mapStateToProps, mapActionsToProps)(TopnavNotifications);

