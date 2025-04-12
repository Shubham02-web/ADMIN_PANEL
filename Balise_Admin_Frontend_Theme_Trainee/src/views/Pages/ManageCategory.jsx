/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap';
import { FaRegTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import './main.css';

import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import placeholder from '../../assets/images/placeholder.jpg';
import { Url, IMAGE_PATH } from '../../config/constant';
import Swal from 'sweetalert2';

import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const ManageCategory = () => {
  const [catDetails, setcatDetails] = useState([]);
  const [categoryDetails, setcategoryDetails] = useState([]);
  const [filteredCategoryDetails, setFilteredCategoryDetails] = useState([]);
  const [categoryToDelete, setcategoryToDelete] = useState(null);
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

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`${Url}/manage_category`);
      const fetchcatDetails = response.data.data.category_details;
      console.log('Response data:', fetchcatDetails);
      setcatDetails(fetchcatDetails);
      setFilteredCategoryDetails(fetchcatDetails); // Initialize the filtered list
    } catch (error) {
      console.error('Error fetching manage banner details:', error);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
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

  const handleSelect = (eventKey, category_id) => {
    console.log('category_id sadfasdf', category_id);
    if (eventKey === 'delete') {

      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Do you want to delete category?',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteCategory(category_id);
        }
      });
    }
    if (eventKey === 'edit') {
      console.log('view', category_id);
      fetchEditDetails(category_id);
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



  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredCategoryDetails.length - page * rowsPerPage);


  const filterResults = (searchTerm) => {
    // Ensure searchTerm is a string and handle cases where it might be null or undefined
    const lowercasedFilter = (searchTerm || '').toLowerCase();

    // Filter userDetails with proper null checks
    const filtered = catDetails.filter((user) => {
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
    setFilteredCategoryDetails(filtered);
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


  const handleShow = () => {
    setSelectedBanner(placeholder);
    setShow(true);
  };
  const handleClose = () => {
    setSelectedBanner(placeholder);
    setShow(false);
  }

  const handleClose2 = () => setShow2(false);


  //edit banner
  const fetchEditDetails = async (category_id) => {
    try {
      const params = {
        action: 'get_edit_category_detail',
        category_id: category_id,
      };
      const response = await axios.get(`${Url}/get_edit_category_detail`, { params });
      const categoryData = response.data.data;
      setSelectedBanner(categoryData.image ? IMAGE_PATH + '/' + categoryData.image : placeholder);
      setEditDetails(categoryData);
      console.log("check code", categoryData);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };


  // Function to delete user
  const deleteCategory = (category_id) => {
    // if (userToDelete) {
    //   console.log('banner_id check deleted', userToDelete);
    const data = { category_id: category_id };
    axios
      .post(Url + '/delete_category', data)
      .then(() => {
        // Update userDetails state to remove the deleted user
        fetchCategoryDetails();
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

    console.log('values data', values);

    const { category_id, name, action, banner } = values;

    //for edit blog
    if (action === 'edit_category') {
      console.log('Choose edit action');

      const data = new FormData();

      data.append('action', 'edit_banner');
      data.append('category_id', category_id);
      data.append('name', name);
      if (banner) {
        data.append('image', banner);
      } else {
        data.append('image', '');
      }

      console.log('data', data);

      axios.post(`${Url}/edit_category`, data, {
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
              text: 'Category Updated successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
              setShow2(false);
              fetchCategoryDetails();
            });
          }
        })
        .catch((err) => console.error('Error fetching banner:', err));

    }
    //for add blog
    else {
      console.log('Choose add action');
      const data = new FormData();
      data.append('action', action);
      data.append('name', name);
      if (banner) {
        data.append('image', banner);
      }

      console.log('data', data);

      axios.post(`${Url}/add_category`, data, {
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
              text: 'Category added successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
              setShow(false);
              fetchCategoryDetails();
            });
          }
        })
        .catch((err) => console.error('Error fetching banner:', err));
    }
  };


  useEffect(() => {

  }, [editDetails]);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item to="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item to="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item to="#">Manage Category</Breadcrumb.Item>
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
                      Add Category
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
                      {/* <th style={{ textAlign: 'center' }}>Title</th> */}
                      <th style={{ textAlign: 'center' }}>Category Name</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? filteredCategoryDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredCategoryDetails
                    ).map((category, index) => (
                      <tr key={category.category_id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        {/* <td style={{ textAlign: 'center' }}>{category.banner_id}</td> */}
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${category.category_id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, category.category_id)}
                            className="btn-action"
                          >


                            <Dropdown.Item eventKey="edit">
                              <FaEdit className="icon" style={{ marginRight: '8px' }} /> Edit
                            </Dropdown.Item>


                            <Dropdown.Item
                              eventKey="delete"
                              onClick={() => {
                                setcategoryToDelete(category.category_id);
                              }}
                            >
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>

                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={category.image ? `${IMAGE_PATH}/${category.image}` : `${placeholder}`}
                            alt="image"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>

                        <td style={{ textAlign: 'center' }}>{category.category_name}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(category.createtime)}</td>
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
                  count={filteredCategoryDetails.length}
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
          <Modal.Title style={{ fontSize: '17px' }}>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ name: '', action: "add_category", banner: null, submit: null }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({

              name: Yup.string().max(255).required('Please enter category name'),

              // image: Yup.mixed().required('Please upload a  image'), // Validation for file input
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>

                {/* Hidden input for action */}
                <input type="hidden" name="action" value="add_category" />


                <div className="form-group mb-2">
                  <label>Category Name</label>
                  <input
                    className="form-control"
                    label="Category Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter category name"
                    value={values.name}
                  />
                  {touched.name && errors.name && <small className="text-danger form-text">{errors.name}</small>}
                </div>
                {/* Banner Image */}

                <div className="mb-3">

                  <img
                    src={selectedBanner}
                    alt="Category"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />

                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category Image
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
          <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              category_id: editDetails ? editDetails.category_id : '',
              name: editDetails ? editDetails.category_name : '',
              action: 'edit_category',
              banner: editDetails ? editDetails.image : null,
              submit: null,
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              category_id: Yup.string().required('Please choose category'),
              name: Yup.string().max(255).required('Please enter name'),
              banner: Yup.mixed().required('Please upload a image'),
            })}
          >

            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <input type="hidden" name="action" value="edit_category" />

                <div className="form-group mb-2">
                  <input
                    className="form-control"
                    name="category_id"
                    type="hidden"
                    value={values.category_id}
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                </div>



                <div className="form-group mb-2">
                  <label>Category Name</label>
                  <input
                    className="form-control"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter title"
                    value={values.name}
                  />
                  <ErrorMessage name="name" component="small" className="text-danger form-text" />
                </div>


                <div className="mb-3 mt-5">
                  <img
                    src={selectedBanner}
                    alt="Category"
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
                    Image
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

export default ManageCategory;
