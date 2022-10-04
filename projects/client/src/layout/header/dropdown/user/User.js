import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropdownToggle, DropdownMenu, Dropdown, Button } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import UserAvatar from "../../../../components/user/UserAvatar";
import { logoutAdmin } from "../../../../redux/actions/admin";
import ProfPic from "../../../../images/Ramu-profile-default.png";
import { Link, Redirect } from "react-router-dom";

const User = () => {
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  const user = JSON.parse(window.localStorage.getItem("profile"));

  const handleSignout = () => {
    if (admin.id) {
      dispatch(logoutAdmin());
    } else if (user) {
      localStorage.clear();
    }
  };

  if (admin.id || user) {
    return (
      <Dropdown
        isOpen={user ? open : !open}
        className="user-dropdown"
        toggle={toggle}
      >
        <DropdownToggle
          tag="a"
          href={user ? "#toggle" : `${process.env.PUBLIC_URL}/auth-login`}
          className="dropdown-toggle"
          onClick={(ev) => {
            ev.preventDefault();
          }}
        >
          <div className="user-toggle">
            {/* <UserAvatar icon="user-alt" className="sm" /> */}
            <div className="user-info d-none d-md-block">
              {admin.id ? (
                <div className="user-status">{admin.role}</div>
              ) : null}
              <span className="user-name dropdown-indicator">
                {admin.id
                  ? `${admin.first_name} ${admin.last_name}`
                  : user
                  ? `${user.first_name} ${user.last_name}`
                  : null}
              </span>
            </div>
          </div>
        </DropdownToggle>
        <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
          <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
            <div className="user-card sm">
              <UserAvatar image={ProfPic} className="sm" />
              <div className="user-info">
                <span className="lead-text">
                  {admin.id
                    ? `${admin.first_name} ${admin.last_name}`
                    : user
                    ? `${user.first_name} ${user.last_name}`
                    : "LOG IN"}
                </span>
                <span className="sub-text">
                  {user ? `${user.email}` : admin.id ? `${admin.email}` : " "}
                </span>
              </div>
            </div>
          </div>
          <div className="dropdown-inner">
            <LinkList>
              {user ? (
                <LinkItem
                  link="/user-profile-regular"
                  icon="user-alt"
                  onClick={toggle}
                >
                  Profile Data
                </LinkItem>
              ) : null}

              {admin.id ? (
                <LinkItem link="/admin" icon="dashboard" onClick={toggle}>
                  Admin Dashboard
                </LinkItem>
              ) : null}
            </LinkList>
          </div>
          <div className="dropdown-inner">
            <LinkList>
              <a href={"/"} onClick={handleSignout}>
                <Icon name="signout"></Icon>
                <span>Log Out</span>
              </a>
            </LinkList>
          </div>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Link className="user-name" to={"/auth-login"}>
      LOG IN
    </Link>
  );
};

export default User;
