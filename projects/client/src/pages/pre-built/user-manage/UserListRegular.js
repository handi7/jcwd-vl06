import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  TooltipComponent,
  RSelect,
} from "../../../components/Component";
import ProfPic from "../../../images/Ramu-profile-default.png";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { filterRole, filterStatus } from "./UserData";
import { bulkActionOptions, findUpper } from "../../../utils/Utils";
import { Link, Redirect } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "./UserContext";
import axios from "axios";

const UserListRegularPage = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;
  console.log(data);

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    balance: "",
    phone: "",
    status: "Active",
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const [user, setUser] = useState([]);

  const [redirect, setRedirect] = useState({ user_id: 0 });

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    let newData;
    newData = data.map((item) => {
      item.checked = false;
      return item;
    });
    setData([...newData]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changing state value when searching name
  useEffect(() => {
    if (onSearchText !== "") {
      const filteredObject = data.filter((item) => {
        return (
          item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
          item.email.toLowerCase().includes(onSearchText.toLowerCase())
        );
      });
      setData([...filteredObject]);
    } else {
      setData([...data]);
    }
  }, [onSearchText, setData]);

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to reset the form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      balance: "",
      phone: "",
      status: "Active",
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = (submitData) => {
    const { name, email, balance, phone } = submitData;
    let submittedData = {
      id: data.length + 1,
      avatarBg: "purple",
      name: name,
      role: "Customer",
      email: email,
      balance: balance,
      phone: phone,
      emailStatus: "success",
      kycStatus: "alert",
      lastLogin: "10 Feb 2020",
      status: formData.status,
      country: "Bangladesh",
    };
    setData([submittedData, ...data]);
    resetForm();
    setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = (submitData) => {
    const { name, email, phone } = submitData;
    let submittedData;
    let newitems = data;
    newitems.forEach((item) => {
      if (item.id === editId) {
        submittedData = {
          id: item.id,
          avatarBg: item.avatarBg,
          name: name,
          image: item.image,
          role: item.role,
          email: email,
          balance: formData.balance,
          phone: "+" + phone,
          emailStatus: item.emailStatus,
          kycStatus: item.kycStatus,
          lastLogin: item.lastLogin,
          status: formData.status,
          country: item.country,
        };
      }
    });
    let index = newitems.findIndex((item) => item.id === editId);
    newitems[index] = submittedData;
    setModal({ edit: false });
    resetForm();
  };

  //////////////////////////////////////////////////////////////
  // function that loads the want to editted data
  // const onEditClick = (uuid) => {
  //   data.forEach((item) => {
  //     if (item.uuid === uuid) {
  //       setFormData({
  //         first_name: item.first_name,
  //         last_name: item.last_name,
  //         email: item.email,
  //         active_status: item.active_status,
  //         phone: item.phone,
  //       });
  //       setModal({ edit: true }, { add: false });
  //       setEditedId(id);
  //     }
  //   });
  // };

  // function to change to suspend property for an item
  const suspendUser = (uuid) => {
    let newData = data;
    let index = newData.findIndex((item) => item.uuid === uuid);
    newData[index].active_status = false;
    setData([...newData]);

    try {
      axios.patch(`http://localhost:2000/admin/user-deactivate/${uuid}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      }
    }
  };

  const activateUser = (uuid) => {
    let newData = data;
    let index = newData.findIndex((item) => item.uuid === uuid);
    newData[index].active_status = true;
    setData([...newData]);

    try {
      axios.patch(`http://localhost:2000/admin/user-activate/${uuid}`);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      }
    }
  };

  ///////////////////////////////////////////////////////////////

  // function to change the check property of an item
  const selectorCheck = (e) => {
    let newData;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function which fires on applying selected action
  const onActionClick = (e) => {
    if (actionText === "suspend") {
      let newData = data.map((item) => {
        if (item.checked === true) item.status = "Suspend";
        return item;
      });
      setData([...newData]);
    } else if (actionText === "delete") {
      let newData;
      newData = data.filter((item) => item.checked !== true);
      setData([...newData]);
    }
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const { errors, register, handleSubmit } = useForm();

  if (redirect.user_id) {
    return <Redirect to={`/admin/user-transactions/${redirect.user_id}`} />;
  }

  return (
    <React.Fragment>
      <Head title="User List - Regular"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} users.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${
                    sm ? "active" : ""
                  }`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? "block" : "none" }}
                >
                  <ul className="nk-block-tools g-3">
                    {/* <li>
                      <Button color="light" outline className="btn-white">
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </Button>
                    </li> */}
                    <li className="nk-block-tools-opt">
                      <Button
                        color="primary"
                        className="btn-icon"
                        onClick={() => setModal({ add: true })}
                      >
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={bulkActionOptions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== "" ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== "" ? false : true}
                          className="btn-dim btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${
                            tablesm ? "active" : ""
                          }`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div
                          className={`toggle-content ${
                            tablesm ? "content-active" : ""
                          }`}
                        >
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button
                                className="btn-icon btn-trigger toggle"
                                onClick={() => updateTableSm(false)}
                              >
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="btn btn-trigger btn-icon dropdown-toggle"
                                >
                                  <div className="dot dot-primary"></div>
                                  <Icon name="filter-alt"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  className="filter-wg dropdown-menu-xl"
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="dropdown-head">
                                    <span className="sub-title dropdown-title">
                                      Filter Users
                                    </span>
                                    <div className="dropdown">
                                      <a
                                        href="#more"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                        className="btn btn-sm btn-icon"
                                      >
                                        <Icon name="more-h"></Icon>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasBalance"
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="hasBalance"
                                          >
                                            {" "}
                                            Have Balance
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasKYC"
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="hasKYC"
                                          >
                                            {" "}
                                            KYC Verified
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">
                                            Role
                                          </label>
                                          <RSelect
                                            options={filterRole}
                                            placeholder="Any Role"
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">
                                            Status
                                          </label>
                                          <RSelect
                                            options={filterStatus}
                                            placeholder="Any Status"
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col size="12">
                                        <FormGroup className="form-group">
                                          <button
                                            type="button"
                                            className="btn btn-secondary"
                                          >
                                            Filter
                                          </button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                      className="clickable"
                                    >
                                      Reset Filter
                                    </a>
                                    <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a>
                                  </div>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  color="tranparent"
                                  className="btn btn-trigger btn-icon dropdown-toggle"
                                >
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  className="dropdown-menu-xs"
                                >
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li
                                      className={
                                        itemPerPage === 10 ? "active" : ""
                                      }
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li
                                      className={
                                        itemPerPage === 15 ? "active" : ""
                                      }
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li
                                      className={sort === "dsc" ? "active" : ""}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li
                                      className={sort === "asc" ? "active" : ""}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className={`card-search search-wrap ${!onSearch && "active"}`}
              >
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search by user or email"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon">
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody>
              <DataTableHead>
                <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="uid"
                    ></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                {/* <DataTableRow size="mb">
                  <span className="sub-text">Balance</span>
                </DataTableRow> */}
                <DataTableRow size="md">
                  <span className="sub-text">Phone</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Verified</span>
                </DataTableRow>
                {/* <DataTableRow size="lg">
                  <span className="sub-text">Last Login</span>
                </DataTableRow> */}
                <DataTableRow size="md">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      color="tranparent"
                      className="btn btn-xs btn-outline-light btn-icon dropdown-toggle"
                    >
                      <Icon name="plus"></Icon>
                    </DropdownToggle>
                    <DropdownMenu right className="dropdown-menu-xs">
                      <ul className="link-tidy sm no-bdr">
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="bl"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="bl"
                            >
                              Balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="ph"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="ph"
                            >
                              Phone
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="vri"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="vri"
                            >
                              Verified
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              id="st"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="st"
                            >
                              Status
                            </label>
                          </div>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item.id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              defaultChecked={item.checked}
                              id={item.id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item.id)}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor={item.id + "uid1"}
                            ></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <Link
                            to={`${process.env.PUBLIC_URL}/user-details-regular/${item.id}`}
                          >
                            <div className="user-card">
                              <UserAvatar image={ProfPic}></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">
                                  {item.first_name} {item.last_name}
                                  <span
                                    className={`dot dot-${
                                      item.active_status === true
                                        ? "success"
                                        : "danger"
                                    } d-md-none ml-1`}
                                  ></span>
                                </span>
                                <span>{item.email}</span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        {/* <DataTableRow size="mb">
                          <span className="tb-amount">
                            {item.balance} <span className="currency">IDR</span>
                          </span>
                        </DataTableRow> */}
                        <DataTableRow size="md">
                          <span>{item.phone}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <ul className="list-status">
                            <li key={item.uuid}>
                              <Icon
                                className={`text-${
                                  item.is_verified === true
                                    ? "success"
                                    : "danger"
                                }`}
                                name={`${
                                  item.is_verified === true
                                    ? "check-circle"
                                    : "alert-circle"
                                }`}
                              ></Icon>{" "}
                              <span>Email</span>
                            </li>
                            {/* <li>
                              <Icon
                                className={`text-${
                                  item.kycStatus === "success"
                                    ? "success"
                                    : item.kycStatus === "pending"
                                    ? "info"
                                    : item.kycStatus === "warning"
                                    ? "warning"
                                    : "secondary"
                                }`}
                                name={`${
                                  item.kycStatus === "success"
                                    ? "check-circle"
                                    : item.kycStatus === "pending"
                                    ? "alarm-alt"
                                    : "alert-circle"
                                }`}
                              ></Icon>{" "}
                              <span>KYC</span>
                            </li> */}
                          </ul>
                        </DataTableRow>
                        {/* <DataTableRow size="lg">
                          <span>{item.lastLogin}</span>
                        </DataTableRow> */}
                        <DataTableRow size="md">
                          <span
                            className={`tb-status text-${
                              item.active_status === true ? "success" : "danger"
                            }`}
                          >
                            {item.active_status === true
                              ? "Active"
                              : "Deactive"}
                          </span>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            {/* <li className="nk-tb-action-hidden" onClick={() => onEditClick(item.uuid)}>
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"edit" + item.uuid}
                                icon="edit-alt-fill"
                                direction="top"
                                text="Edit"
                              />
                            </li> */}
                            {/* {item.active_status !== "Deactive" && (
                              <React.Fragment>
                                <li className="nk-tb-action-hidden" onClick={() => suspendUser(item.uuid)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="btn btn-trigger btn-icon"
                                    id={"suspend" + item.id}
                                    icon="user-cross-fill"
                                    direction="top"
                                    text="Deactivate"
                                  />
                                </li>
                              </React.Fragment>
                            )} */}
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="dropdown-toggle btn btn-icon btn-trigger"
                                >
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li
                                      onClick={() =>
                                        setRedirect({ user_id: item.id })
                                      }
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="tranx"></Icon>
                                        <span>Transactions</span>
                                      </DropdownItem>
                                    </li>
                                    {item.active_status == true && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li
                                          onClick={() => suspendUser(item.uuid)}
                                        >
                                          <DropdownItem
                                            tag="a"
                                            href="deactivate"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Deactivate User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                    {item.active_status == false && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li
                                          onClick={() =>
                                            activateUser(item.uuid)
                                          }
                                        >
                                          <DropdownItem
                                            tag="a"
                                            href="#activate"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="check-circle"></Icon>
                                            <span>Activate User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
        <Modal
          isOpen={modal.add}
          toggle={() => setModal({ add: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a
              href="#close"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add User</h5>
              <div className="mt-4">
                <Form
                  className="row gy-4"
                  noValidate
                  onSubmit={handleSubmit(onFormSubmit)}
                >
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && (
                        <span className="invalid">{errors.name.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <span className="invalid">{errors.email.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Balance</label>
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        defaultValue={formData.balance}
                        placeholder="Balance"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balance && (
                        <span className="invalid">
                          {errors.balance.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={formData.phone}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.phone && (
                        <span className="invalid">{errors.phone.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{ value: "Active", label: "Active" }}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.value })
                          }
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={modal.edit}
          toggle={() => setModal({ edit: false })}
          className="modal-dialog-centered"
          size="lg"
        >
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form
                  className="row gy-4"
                  onSubmit={handleSubmit(onEditSubmit)}
                >
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter name"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.name && (
                        <span className="invalid">{errors.name.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email</label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "This field is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <span className="invalid">{errors.email.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Balance</label>
                      <input
                        className="form-control"
                        type="number"
                        name="balance"
                        disabled
                        defaultValue={parseFloat(
                          formData.balance.replace(/,/g, "")
                        )}
                        placeholder="Balance"
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.balance && (
                        <span className="invalid">
                          {errors.balance.message}
                        </span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={Number(formData.phone)}
                        ref={register({ required: "This field is required" })}
                      />
                      {errors.phone && (
                        <span className="invalid">{errors.phone.message}</span>
                      )}
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{
                            value: formData.status,
                            label: formData.status,
                          }}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.value })
                          }
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
    </React.Fragment>
  );
};
export default UserListRegularPage;
