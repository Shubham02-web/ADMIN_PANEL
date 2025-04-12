/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap';
import { FaEye, FaRegTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import './main.css';
import avatar1 from 'assets/images/user/avatar-1.jpg';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import placeholder from '../../assets/images/placeholder.jpg';
import { Url, IMAGE_PATH, APP_PREFIX_PATH } from '../../config/constant';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { encode } from 'base-64';
import { Description } from '@mui/icons-material';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';

const ManageBanner = () => {
  const [bannerDetails, setbannerDetails] = useState([]);
  const [categoryDetails, setcategoryDetails] = useState([]);
  const [filteredBannerDetails, setFilteredbannerDetails] = useState([]);
  const [bannerToDelete, setBannerToDelete] = useState(null);
  const [editDetails, setEditDetails] = useState(null);




  const SelectCategory = async () => {
    try {
      const response = await axios.get(`${Url}/category_details`);
      const cat_details = response.data.data.category_details;
      console.log('category data:', cat_details);
      setcategoryDetails(cat_details);
    }
    catch (error) {
      console.error('Error fetching category details:', error);
    }
  }

  const fetchBannerDetails = async () => {
    try {
      const response = await axios.get(`${Url}/manage_banner`);
      const fetchbannerDetails = response.data.data.banner_details;
      console.log('Response data:', fetchbannerDetails);
      setbannerDetails(fetchbannerDetails);
      setFilteredbannerDetails(fetchbannerDetails); // Initialize the filtered list
    } catch (error) {
      console.error('Error fetching manage banner details:', error);
    }
  };

  useEffect(() => {
    fetchBannerDetails();
  }, []);

  useEffect(() => {
    SelectCategory();
  }, []);

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(placeholder);
  const [editBannerDetails, setEditBannerDetails] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelect = (eventKey, banner_id) => {
    console.log('banner_id sadfasdf', banner_id);
    if (eventKey === 'delete') {

      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Do you want to delete banner?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteBanner(banner_id);
        }
      });
    }
    if (eventKey === 'edit') {
      console.log('view', banner_id);
      fetchEditDetails(banner_id);
      setShow2(true);

    }
    else {
      // Handle other dropdown item selections if needed
      console.log(`Selected item: ${eventKey}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterResults(event.target.value);
  };



  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredBannerDetails.length - page * rowsPerPage);


  const filterResults = (searchTerm) => {
    // Ensure searchTerm is a string and handle cases where it might be null or undefined
    const lowercasedFilter = (searchTerm || '').toLowerCase();

    // Filter userDetails with proper null checks
    const filtered = bannerDetails.filter((user) => {
      // Check if username and email exist and are strings before calling toLowerCase
      const category_name = (user.category_name || '').toLowerCase();
      const createtime = user.createtime ? formatDate(user.createtime).toLowerCase() : '';

      // Return whether any of the conditions match the lowercased filter
      return (
        category_name.includes(lowercasedFilter) ||
        createtime.includes(lowercasedFilter)
      );
    });

    // Update the state with the filtered results
    setFilteredbannerDetails(filtered);
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


  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleClose2 = () => setShow2(false);


  //edit banner
  const fetchEditDetails = async (banner_id) => {
    try {
      const params = {
        action: 'get_edit_banner_detail',
        banner_id: banner_id,
      };
      const response = await axios.get(`${Url}/get_edit_banner_detail`, { params });
      const bannerData = response.data.data;
      setSelectedBanner(bannerData.image ? IMAGE_PATH + '/' + bannerData.image : placeholder);
      setEditDetails(bannerData);
      console.log("check code", bannerData);
    } catch (error) {
      console.error('Error fetching banner details:', error);
    }
  };


  // Function to delete user
  const deleteBanner = (banner_id) => {
    // if (userToDelete) {
    //   console.log('banner_id check deleted', userToDelete);
    const data = { banner_id: banner_id };
    axios
      .post(Url + '/delete_banner', data)
      .then(() => {
        // Update userDetails state to remove the deleted user
        fetchBannerDetails();
      })
      .catch((error) => {
        console.log('Error deleting user:', error);
      });
    // }
  };




  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedBanner(URL.createObjectURL(file));
      setFieldValue('banner', file); // Update Formik's field value
    }
  };

  const handleSubmit = async (values) => {

    const { banner_id, action, category_id, title, description, banner } = values;

    //for edit blog
    if (action === 'edit_banner') {
      console.log('Choose edit action');

      const data = new FormData();
      data.append('blog_id', banner_id);
      data.append('action', 'edit_banner');
      data.append('category_id', category_id);
      data.append('title', title);
      data.append('description', description);
      if (banner) {
        data.append('image', banner);
      } else {
        data.append('image', '');
      }

      console.log('data', data);

      axios.post(`${Url}/edit_banner`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          // setData1(res.data.data);
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
              // title: 'Login',
              text: 'Blog Updated successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
              setShow2(false);
              fetchBannerDetails();
            });
          }
        })
        .catch((err) => console.error('Error fetching banner:', err));

    }
    //for add blog
    else {
      console.log('Choose add action');
      const data = new FormData();
      data.append('action', 'add_banner');
      data.append('category_id', category_id);
      data.append('title', title);
      data.append('description', description);
      if (banner) {
        data.append('image', banner);
      }

      console.log('data', data);

      axios.post(`${Url}/add_banner`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          // setData1(res.data.data);
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
              // title: 'Login',
              text: 'Blog added successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
              setShow(false);
              fetchBannerDetails();
            });
          }
        })
        .catch((err) => console.error('Error fetching banner:', err));
    }
  };

  // You can log the editDetails in a useEffect to see the updated state
  useEffect(() => {

  }, [editDetails]);

  return (
    <div>
      <Breadcrumb>
        <Link to={`${APP_PREFIX_PATH}` + '/dashboard'}>
          <i className="feather icon-home" />
        </Link>
        <Link to={`${APP_PREFIX_PATH}` + '/dashboard'}>Dashboard</Link>
        <Link active>Manage Blog</Link>
      </Breadcrumb>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Form className="p-2">
                <Row className="justify-content-between">
                  <Col md={10}>
                    <FormControl
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ maxWidth: '220px', width: '100%' }}
                    />
                  </Col>
                  <Col md={2}>
                    <Button onClick={handleShow}>
                      <FaPlus style={{ marginRight: '5px' }} />
                      Add Blog
                    </Button>
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
                      {/* <th style={{ textAlign: 'center' }}>ID</th> */}
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Image</th>
                      <th style={{ textAlign: 'center' }}>Title</th>
                      <th style={{ textAlign: 'center' }}>Category Name</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? filteredBannerDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredBannerDetails
                    ).map((banner, index) => (
                      <tr key={banner.banner_id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        {/* <td style={{ textAlign: 'center' }}>{banner.banner_id}</td> */}
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${banner.banner_id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, banner.banner_id)}
                            className="btn-action"
                          >
                            <Dropdown.Item eventKey="view">
                              <Link to={`${APP_PREFIX_PATH}/view_banner/${encode(banner.banner_id)}`}>
                                <FaEye className="icon" style={{ marginRight: '8px' }} />
                                View
                              </Link>
                            </Dropdown.Item>

                            <Dropdown.Item eventKey="edit">
                              <FaEdit className="icon" style={{ marginRight: '8px' }} /> Edit
                            </Dropdown.Item>


                            <Dropdown.Item
                              eventKey="delete"
                              onClick={() => {
                                setBannerToDelete(banner.banner_id);
                              }}
                            >
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={banner.image_html ? `${IMAGE_PATH}/${banner.image_html}` : `${placeholder}`}
                            alt="image"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>{banner.title}</td>
                        <td style={{ textAlign: 'center' }}>{banner.category_name}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(banner.createtime)}</td>
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
                  count={filteredBannerDetails.length}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ category_id: '', title: '', description: '', action: "add_banner", banner: null, submit: null }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              category_id: Yup.string().required('Please choose catergory'),
              title: Yup.string().max(255).required('Please enter title'),
              description: Yup.string().max(255).required('Please enter description'),
              banner: Yup.mixed().required('Please upload a banner image'), // Validation for file input
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>

                {/* Hidden input for action */}
                <input type="hidden" name="action" value="add_banner" />

                <div className="form-group mb-3">

                  <label>Choose Categroy Name</label>
                  <select
                    className="form-control"
                    name="category_id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.category_id}
                  >
                    <option value=''>-- Select --</option>
                    {categoryDetails.map(option => (
                      <>

                        <option key={option.category_id} value={option.category_id}>
                          {option.category_name}
                        </option></>
                    ))}
                  </select>
                  {touched.category_id && errors.category_id && (
                    <small className="text-danger form-text">{errors.category_id}</small>
                  )}
                </div>
                <div className="form-group mb-2">
                  <label>Title</label>
                  <input
                    className="form-control"
                    label="Title"
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter title"
                    value={values.title}
                  />
                  {touched.title && errors.title && <small className="text-danger form-text">{errors.title}</small>}
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    rows="3"
                    placeholder="Enter description"
                    value={values.description}
                  />
                  {touched.description && errors.description && (
                    <small className="text-danger form-text">{errors.description}</small>
                  )}
                </div>

                {/* Banner Image */}


                <div className="mb-3">
                  <img
                    src={selectedBanner}
                    alt="Banner"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="banner" className="form-label">
                    Banner Image
                  </label>
                  <Form.Control
                    type="file"
                    name="banner"
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  {touched.banner && errors.banner && (
                    <small className="text-danger form-text">{errors.banner}</small>
                  )}
                </div>



                {errors.submit && (
                  <Col sm={12}>
                    <Alert variant="danger">{errors.submit}</Alert>
                  </Col>
                )}
                <Row >
                  <Col mt={5} className="text-center mt-4">
                    <button className="btn btn-block btn-primary mb-4" disabled={isSubmitting} size="large" type="submit">
                      Submit
                    </button>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* edit banner modal */}

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              banner_id: editDetails ? editDetails.blog_id : '',
              category_id: editDetails ? editDetails.category_id : '',
              title: editDetails ? editDetails.title : '',
              description: editDetails ? editDetails.description : '',
              action: 'edit_banner',
              banner: editDetails ? editDetails.image : null,
              submit: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              category_id: Yup.string().required('Please choose category'),
              title: Yup.string().max(255).required('Please enter title'),
              description: Yup.string().max(255).required('Please enter description'),
              banner: Yup.mixed().required('Please upload a banner image'),
            })}
          >

            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <input type="hidden" name="action" value="edit_banner" />

                <div className="form-group mb-2">
                  <input
                    className="form-control"
                    name="banner_id"
                    type="hidden"
                    value={values.banner_id}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group mb-3">
                  <label>Choose Category Name</label>
                  <select
                    className="form-control"
                    name="category_id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.category_id}
                  >
                    <option value=''>-- Select --</option>
                    {categoryDetails.map(option => (
                      <option key={option.category_id} value={option.category_id}>
                        {option.category_name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage name="category_id" component="small" className="text-danger form-text" />
                </div>

                <div className="form-group mb-2">
                  <label>Title</label>
                  <input
                    className="form-control"
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter title"
                    value={values.title}
                  />
                  <ErrorMessage name="title" component="small" className="text-danger form-text" />
                </div>

                <div className="form-group mb-2">
                  <label htmlFor="description">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter description"
                    value={values.description}
                  />
                  <ErrorMessage name="description" component="small" className="text-danger form-text" />
                </div>

                <div className="mb-3">
                  <img
                    src={selectedBanner}
                    alt="Banner"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="banner" className="form-label">
                    Banner Image
                  </label>
                  <input
                    type="file"
                    name="banner"
                    className="form-control"
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <ErrorMessage name="banner" component="small" className="text-danger form-text" />
                </div>

                {errors.submit && (
                  <Col sm={12}>
                    <Alert variant="danger">{errors.submit}</Alert>
                  </Col>
                )}

                <Row>
                  <Col className="text-center mt-4">
                    <button className="btn btn-block btn-primary mb-4" disabled={isSubmitting} type="submit">
                      Update
                    </button>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </Modal.Body>


      </Modal>
      {/* edit banner modal */}
    </div>
  );
};

export default ManageBanner;
