/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Alert } from 'react-bootstrap';
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
      const response = await axios.get(`${Url}/api/categories`);
      const cat_details = response.data.categories;
      console.log('category data:', cat_details);
      setcategoryDetails(cat_details);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  const fetchCategoryDetails = async () => {
    try {
      const response = await axios.get(`${Url}/api/categories`);
      const fetchcatDetails = response.data.categories;
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(placeholder);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelect = (eventKey, id) => {
    console.log('category_id', id);
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
          deleteCategory(id);
        }
      });
    }
    if (eventKey === 'edit') {
      console.log('view', id);
      fetchEditDetails(id);
      setShowEditModal(true);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterResults(event.target.value);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredCategoryDetails.length - page * rowsPerPage);

  const filterResults = (searchTerm) => {
    const lowercasedFilter = (searchTerm || '').toLowerCase();
    const filtered = catDetails.filter((user) => {
      const category_name = (user.CategoryName || '').toLowerCase();
      const createtime = user.createdAt ? formatDate(user.createdAt).toLowerCase() : '';
      return category_name.includes(lowercasedFilter) || createtime.includes(lowercasedFilter);
    });
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
    hours = hours ? hours : 12;
    const strHours = padTo2Digits(hours);

    return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
  }

  const handleAddShow = () => {
    setSelectedImage(placeholder);
    setShowAddModal(true);
  };
  const handleAddClose = () => {
    setSelectedImage(placeholder);
    setShowAddModal(false);
  };

  const handleEditClose = () => {
    setSelectedImage(placeholder);
    setShowEditModal(false);
  };

  const fetchEditDetails = async (id) => {
    try {
      const response = await axios.get(`${Url}/api/categories/${id}`);
      const categoryData = response.data.category;
      setEditDetails(categoryData);
      setSelectedImage(categoryData.CategoryImage ? `${Url}/uploads/${categoryData.CategoryImage}` : placeholder);
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  };

  const deleteCategory = (id) => {
    axios
      .delete(Url + `/api/categories/${id}`)
      .then(() => {
        fetchCategoryDetails();
        Swal.fire({
          icon: 'success',
          text: 'Category deleted successfully!',
          confirmButtonText: 'Ok'
        });
      })
      .catch((error) => {
        console.log('Error deleting category:', error);
        Swal.fire({
          icon: 'error',
          text: 'Failed to delete category',
          confirmButtonText: 'Ok'
        });
      });
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFieldValue('CategoryImage', file);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const formData = new FormData();
      formData.append('CategoryName', values.CategoryName);

      if (values.action === 'edit_category') {
        formData.append('id', values.id);
        if (values.CategoryImage instanceof File) {
          formData.append('CategoryImage', values.CategoryImage);
        }

        await axios.patch(`${Url}/api/categories/${values.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setShowEditModal(false);
        fetchCategoryDetails();
        Swal.fire({
          icon: 'success',
          text: 'Category updated successfully!',
          confirmButtonText: 'Ok'
        });
      } else {
        // Add new category
        formData.append('CategoryImage', values.CategoryImage);

        await axios.post(`${Url}/api/categories/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setShowAddModal(false);
        fetchCategoryDetails();
        Swal.fire({
          icon: 'success',
          text: 'Category added successfully!',
          confirmButtonText: 'Ok'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong',
        confirmButtonText: 'Ok'
      });
    } finally {
      setSubmitting(false);
    }
  };

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
                    <Button onClick={handleAddShow}>
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
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Image</th>
                      <th style={{ textAlign: 'center' }}>Category Name</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? filteredCategoryDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredCategoryDetails
                    ).map((category, index) => (
                      <tr key={category.id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${category.id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, category.id)}
                            className="btn-action"
                          >
                            <Dropdown.Item eventKey="edit">
                              <FaEdit className="icon" style={{ marginRight: '8px' }} /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item eventKey="delete">
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <img
                            src={category.CategoryImage ? `${Url}/uploads/${category.CategoryImage}` : `${placeholder}`}
                            alt="image"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>{category.CategoryName}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(category.createdAt)}</td>
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

      {/* Add Category Modal */}
      <Modal show={showAddModal} onHide={handleAddClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              CategoryName: '',
              CategoryImage: null,
              action: 'add_category',
              submit: null
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              CategoryName: Yup.string().max(255).required('Please enter category name'),
              CategoryImage: Yup.mixed().required('Please upload an image')
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <div className="form-group mb-2">
                  <label>Category Name</label>
                  <input
                    className={`form-control ${touched.CategoryName && errors.CategoryName ? 'is-invalid' : ''}`}
                    name="CategoryName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter category name"
                    value={values.CategoryName}
                  />
                  <ErrorMessage name="CategoryName" component="small" className="text-danger form-text" />
                </div>

                <div className="mb-3">
                  <img
                    src={selectedImage}
                    alt="Category"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="CategoryImage" className="form-label">
                    Category Image
                  </label>
                  <input
                    type="file"
                    id="CategoryImage"
                    name="CategoryImage"
                    className={`form-control ${touched.CategoryImage && errors.CategoryImage ? 'is-invalid' : ''}`}
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <ErrorMessage name="CategoryImage" component="div" className="text-danger" />
                </div>

                {errors.submit && (
                  <Col sm={12}>
                    <Alert variant="danger">{errors.submit}</Alert>
                  </Col>
                )}

                <Row>
                  <Col className="text-center mt-4">
                    <button className="btn btn-block btn-primary mb-4" disabled={isSubmitting} type="submit">
                      Submit
                    </button>
                  </Col>
                </Row>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={handleEditClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            enableReinitialize
            initialValues={{
              id: editDetails ? editDetails.id : '',
              CategoryName: editDetails ? editDetails.CategoryName : '',
              action: 'edit_category',
              CategoryImage: editDetails ? editDetails.CategoryImage : null,
              submit: null
            }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              CategoryName: Yup.string().max(255).required('Please enter category name')
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <input type="hidden" name="id" value={values.id} />

                <div className="form-group mb-2">
                  <label>Category Name</label>
                  <input
                    className={`form-control ${touched.CategoryName && errors.CategoryName ? 'is-invalid' : ''}`}
                    name="CategoryName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter category name"
                    value={values.CategoryName}
                  />
                  <ErrorMessage name="CategoryName" component="small" className="text-danger form-text" />
                </div>

                <div className="mb-3">
                  <img
                    src={selectedImage}
                    alt="Category"
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="CategoryImage" className="form-label">
                    Category Image
                  </label>
                  <input
                    type="file"
                    id="CategoryImage"
                    name="CategoryImage"
                    className="form-control"
                    accept="image/*"
                    onChange={(event) => handleFileChange(event, setFieldValue)}
                  />
                  <small className="text-muted">Leave empty to keep current image</small>
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
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageCategory;
