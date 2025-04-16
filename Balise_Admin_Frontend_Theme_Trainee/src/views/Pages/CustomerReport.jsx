/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import './main.css';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { APP_PREFIX_PATH, Url, IMAGE_PATH } from '../../config/constant';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { encode } from 'base-64';
import { FaEye, FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const CustomerReport = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [userToDelete, setUserToDelete] = useState(null);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const handleSubmit = async (values) => {
    const { from_date, to_date } = values;

    // const data = new FormData();
    // data.append('s_date', from_date);
    // data.append('e_date', to_date);

    // console.log('data', data);

    const check = await axios
      .get(`${Url}/api/Tabular/date-range`, {
        params: {
          startDate: from_date,
          endDate: to_date
        }
      })
      .then((response) => {
        console.log(response.data.data);
        if (response.data.success) {
          const fectchdata = response.data.data;

          setUserDetails(fectchdata); // Assuming `data` contains the array of users
        } else {
          console.error('Error fetching user details:', response.data.msg);
        }
      })
      .catch((err) => console.error('Error fetching banner:', err));
  };

  // Function to handle action selection
  const handleActionChange = (index, eventKey, user_id) => {
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
          deleteUser(id);
        }
      });
    } else if (eventKey === 'View') {
      // const encode_user_id = encode(user_id);
      // // console.log('Url is link : ',`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`);
      // const navigate_url=`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`;
      // navigate(navigate_url);
      // console.log('view page',`${APP_PREFIX_PATH}/view-customer/${encode_user_id}`);
      // Handle view action if needed
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const formatDate = (date) => {
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
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      userDetails.map((user, index) => ({
        'S. No.': index + 1,
        Name: user.username,
        'Profile Image': user.profilePicture ? `${Url}/uploads/${user.profilePicture}` : `${Url}/uploads/image-1720095670109.png`,
        Email: user.email,
        'Create Date & Time': formatDate(user.createdAt)
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UserReport');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'UserReport.xlsx');
  };

  // Function to delete user
  const deleteUser = (id) =>
    axios
      .post(Url + `/api/customers/register${id}`)
      .then(() => {
        // // Update userDetails state to remove the deleted user
        // setUserDetails(fectchdata);
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
  // }

  return (
    <>
      <div>
        <Breadcrumb>
          <Link to="/dashboard">
            <i className="feather icon-home" />
          </Link>
          <span>{'/'}</span>
          <Link to={`${APP_PREFIX_PATH}/dashboard`}> Dashboard </Link> <span>{'/'}</span>
          <Link active>Customer Report</Link>
        </Breadcrumb>

        <Card className="p-3">
          <Formik
            initialValues={{ from_date: '', to_date: '' }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              from_date: Yup.string().required('Please enter date'),
              to_date: Yup.string()
                .required('Please enter date')
                .test('date-validation', 'To date should not be earlier than from date', function (value) {
                  const { from_date } = this.parent;
                  return new Date(value) >= new Date(from_date);
                })
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Row>
                  <Col md={5}>
                    <div className="form-group mb-2">
                      <label>From Date</label>
                      <input
                        className="form-control"
                        name="from_date"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        placeholder="Enter date"
                        value={values.from_date}
                      />
                      {touched.from_date && errors.from_date && <small className="text-danger form-text">{errors.from_date}</small>}
                    </div>
                  </Col>

                  <Col md={5}>
                    <div className="form-group mb-2">
                      <label>To Date</label>
                      <input
                        className="form-control"
                        name="to_date"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="date"
                        placeholder="Enter date"
                        value={values.to_date}
                      />
                      {touched.to_date && errors.to_date && <small className="text-danger form-text">{errors.to_date}</small>}
                    </div>
                  </Col>
                  {errors.submit && (
                    <Col sm={12}>
                      <Alert variant="danger">{errors.submit}</Alert>
                    </Col>
                  )}
                  <Col md={2} className="text-center mt-4">
                    <button className="btn btn-block btn-primary mb-4" disabled={isSubmitting} size="large" type="submit">
                      Submit
                    </button>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </Card>
      </div>

      {userDetails?.length > 0 && (
        <Button variant="success" onClick={exportToExcel} className="mb-3" style={{ backgroundColor: '#5A6268', border: 'none' }}>
          Export to Excel
        </Button>
      )}

      <Card>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Action</th>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                {/* <th>Address</th> */}
                <th>Create Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {userDetails && userDetails.length > 0 ? (
                userDetails.slice(indexOfFirstItem, indexOfLastItem).map((row, index) => (
                  <tr key={index}>
                    <td scope="row">{index + 1}</td>
                    <td>
                      <DropdownButton
                        title="Action"
                        id={`dropdown-${row.id}`}
                        onSelect={(eventKey) => handleActionChange(index, eventKey, row.id)}
                        className="btn-action"
                      >
                        <Dropdown.Item
                          eventKey="View"
                          id={`view-${row.id}`}
                          onClick={() => {
                            setUserToDelete(row.id);
                          }}
                        >
                          {/* <FaEye className="icon" style={{ marginRight: '8px' }} />
                              View */}
                          <Link to={`${APP_PREFIX_PATH}/viewcustomer/${row.id}`}>
                            <FaEye className="icon" style={{ marginRight: '8px' }} />
                            View
                          </Link>
                        </Dropdown.Item>

                        <Dropdown.Item
                          eventKey="delete"
                          onClick={() => {
                            setUserToDelete(row.id);
                          }}
                        >
                          <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                        </Dropdown.Item>
                      </DropdownButton>
                    </td>
                    <td>{row.username}</td>
                    <td>
                      <img
                        src={row.profilePicture ? `${Url}/uploads/${row.profilePicture}` : `${Url}/uploads/image-1720095670109.png`}
                        alt="Profile"
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{row.email}</td>
                    {/* <td>{row.address}</td> */}
                    <td>{formatDate(new Date(row.createdAt))}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <ul className="pagination d-flex justify-content-end">
            {Array.from({
              length: Math.ceil((userDetails?.length || 0) / itemsPerPage)
            }).map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(index + 1)} className="page-link">
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </>
  );
};

export default CustomerReport;
