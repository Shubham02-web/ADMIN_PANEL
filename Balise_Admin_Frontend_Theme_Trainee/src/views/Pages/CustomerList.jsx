/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap';
import { FaEye, FaRegTrashAlt, FaToggleOn } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import './main.css';
import placeholder from '../../assets/images/placeholder.png';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { Url, IMAGE_PATH, APP_PREFIX_PATH } from '../../config/constant';
// import { Link } from 'react-router-dom';
import { encode } from 'base-64';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';


const CustomerList = () => {

  const [userDetails, setUserDetails] = useState([]);
  const [filteredUserDetails, setFilteredUserDetails] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToActivateDeactivate, setUserToActivateDeactivate] = useState(null);
  // const [selectedActions, setSelectedActions] = useState([]);


  // Function to handle action selection
  const handleActionChange = (index, eventKey, user_id, status) => {
    if (eventKey === 'delete') {
      console.log('setUserToDelete', userToDelete);
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Do you want to delete User?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteUser(user_id);
        }
      });
    } else if (eventKey === 'View') {
      // const encode_user_id = encode(user_id);
      // // console.log('Url is link : ',`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`);
      // const navigate_url=`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`;
      // navigate(navigate_url);
      // console.log('view page',`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`);
      // Handle view action if needed
    } else if (eventKey === 'activate') {
      console.log('userToActivateDeactivate', userToActivateDeactivate);
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: status === 1 ? 'you want to deactivate this account?' : 'you want to activate this account?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          ActivateDeactivate(user_id, status);
        }
      });
    } else {
      Swal.fire({
        icon: 'error', // Use 'error' to show the error icon
        title: 'Error', // Add a title for the error message
        text: 'Something went wrong', // Your error message
        confirmButtonText: 'Ok'
      }).then(() => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      });
    }
  };

  const ActivateDeactivate = (user_id, status) => {
    // if (userToActivateDeactivate) {
    const data = { user_id: user_id, status: status == 1 ? (status = 0) : (status = 1) };
    console.log('user_id check activated', data);

    axios
      .post(Url + '/active_deactive', data)
      .then((res) => {
        fetchManageUserDetails();
        console.log('User AD', res);
        // // Update userDetails state to reflect the activation/deactivation
        // if (res.data.success) {
        //   // Update userDetails state to reflect the activation/deactivation
        //   // const updatedUserDetails = userDetails.map((user) =>
        //   //   user.user_id === user_id
        //   //     ? { ...user, status: res.data.newStatus } // Assuming the response contains the new status
        //   //     : user
        //   // );

        //   setUserDetails(updatedUserDetails);
        //   console.log('Updated userDetails:', updatedUserDetails);

        // }
      })
      .catch((error) => {
        console.log('Error updating user status:', error);
      });
    // }
  };

  // Function to delete user
  const deleteUser = (userid) => {
    // if (userToDelete) {
    //   console.log('user_id check deleted', userToDelete);
    const data = { user_id: userid };
    axios
      .post(Url + '/delete_user', data)
      .then(() => {
        // Update userDetails state to remove the deleted user
        fetchManageUserDetails();
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
    // }
  };

  const fetchManageUserDetails = async () => {
    try {
      const response = await axios.get(`${Url}/manage_user`);
      const userDetail = response.data.data.user_detail;

      console.log('Response data:', userDetail);

      setUserDetails(userDetail);
      setFilteredUserDetails(userDetail); // Initialize the filtered list
    } catch (error) {
      console.error('Error fetching manage user details:', error);
    }
  };

  useEffect(() => {
    fetchManageUserDetails();
  }, []);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  // const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleSelect = (,eventKey, user) => {
  //   if (eventKey === 'view') {
  //     navigate(`/view-customer/${user.id}`);
  //   } else {
  //     // Handle other dropdown item selections if needed
  //     console.log(`Selected item: ${eventKey} for user: ${user.name}`);
  //   }
  // };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterResults(term);
  };

  const filterResults = (searchTerm) => {
    // Ensure searchTerm is a string and handle cases where it might be null or undefined
    const lowercasedFilter = (searchTerm || '').toLowerCase();

    // Filter userDetails with proper null checks
    const filtered = userDetails.filter((user) => {
      // Check if username and email exist and are strings before calling toLowerCase
      const username = (user.username || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const createtime = user.createtime ? formatDate(user.createtime).toLowerCase() : '';

      // Return whether any of the conditions match the lowercased filter
      return (
        username.includes(lowercasedFilter) ||
        email.includes(lowercasedFilter) ||
        createtime.includes(lowercasedFilter)
      );
    });

    // Update the state with the filtered results
    setFilteredUserDetails(filtered);
  };


  function formatDate(date) {
    const padTo2Digits = (num) => num.toString().padStart(2, '0');
    const formattedDate = new Date(date);
    const day = padTo2Digits(formattedDate.getDate());
    const month = padTo2Digits(formattedDate.getMonth() + 1);
    const year = formattedDate.getFullYear();
    let hours = formattedDate.getHours();
    const minutes = padTo2Digits(formattedDate.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = padTo2Digits(hours);

    return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredUserDetails.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to="/dashboard">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Manage Customer</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Form className="p-2">
                <Row className="justify-content-end">
                  <Col md={3}>
                    <FormControl type="text" placeholder="Search " className="mr-sm-2" value={searchTerm} onChange={handleSearch} />
                  </Col>
                </Row>
              </Form>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-card" style={{ height: '562px' }}>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>S.No</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Image</th>
                      <th style={{ textAlign: 'center' }}>Name</th>
                      <th style={{ textAlign: 'center' }}>Email</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? filteredUserDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredUserDetails
                    ).map((user, index) => (
                      <tr key={user.id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${user.id}`}
                            onSelect={(eventKey) => handleActionChange(index, eventKey, user.user_id, user.status)}
                            className="btn-action"
                          >
                            <Dropdown.Item
                              eventKey="View"
                              id={`view-${user.user_id}`}
                              onClick={() => {
                                setUserToDelete(user.user_id);
                              }}
                            >
                              {/* <FaEye className="icon" style={{ marginRight: '8px' }} />
                              View */}
                              <Link
                                to={`${APP_PREFIX_PATH}/viewcustomer/${encode(user.user_id)}`}

                              >
                                <FaEye className="icon" style={{ marginRight: '8px' }} />
                                View
                              </Link>
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="activate"
                              onClick={() => {
                                setUserToActivateDeactivate(user.user_id);
                              }}
                            >
                              <FaToggleOn className="icon" style={{ marginRight: '8px' }} />
                              Active/Deactive
                            </Dropdown.Item>
                            <Dropdown.Item
                              eventKey="delete"
                              onClick={() => {
                                setUserToDelete(user.user_id);
                              }}
                            >
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={user.image_html ? `${IMAGE_PATH}${user.image_html}` : `${placeholder}`}
                            alt="image"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>{user.username ? user.username : 'NA'}</td>
                        <td style={{ textAlign: 'center' }}>{user.email}</td>
                        <td style={{ textAlign: 'center' }}>
                          {user.status == 1 ? <p className="btn-active">Active</p> : <p className="btn-deactive">Deactive</p>}
                        </td>
                        <td style={{ textAlign: 'center' }}>{formatDate(user.createtime)}</td>
                      </tr>
                    ))}
                    {emptyRows > 0 && (
                      <tr style={{ height: 53 * emptyRows }}>
                        <td colSpan={7} />
                      </tr>
                    )}
                  </tbody>
                </Table>
                <TablePagination
                  style={{ textAlign: 'right', marginTop: '10px' }}
                  labelRowsPerPage="Showing 1 to 20 of 20 entries:"
                  component="div"
                  count={filteredUserDetails.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[5, 10, 25, 100]}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={12} style={{ textAlign: 'right', marginTop: '10px' }}></Col>
      </Row>
    </div>
  );
};

export default CustomerList;
