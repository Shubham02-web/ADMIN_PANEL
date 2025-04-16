import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap';
import { FaEye, FaRegTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import './main.css';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import placeholder from '../../assets/images/placeholder.jpg';
import { Url, APP_PREFIX_PATH } from '../../config/constant';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ManageBanner = () => {
  const [blogDetails, setBlogDetails] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [filteredBlogDetails, setFilteredBlogDetails] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(placeholder);
  const [editDetails, setEditDetails] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Url}/api/categories`);
      setCategoryDetails(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${Url}/api/blogs`);
      const blogs = response.data.blogs;
      setBlogDetails(blogs);
      setFilteredBlogDetails(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelect = (eventKey, blogId) => {
    if (eventKey === 'delete') {
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'Do you want to delete this blog?',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteBlog(blogId);
        }
      });
    }
    if (eventKey === 'edit') {
      fetchEditDetails(blogId);
      setShowEditModal(true);
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = blogDetails.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.category?.CategoryName?.toLowerCase().includes(searchTerm) ||
        formatDate(blog.createdAt).toLowerCase().includes(searchTerm)
    );
    setFilteredBlogDetails(filtered);
  };

  const deleteBlog = async (blogId) => {
    try {
      await axios.delete(`${Url}/api/blogs/${blogId}`);
      fetchBlogs();
      Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
    } catch (error) {
      Swal.fire('Error!', 'Failed to delete blog.', 'error');
    }
  };

  const fetchEditDetails = async (blogId) => {
    try {
      const response = await axios.get(`${Url}/api/blogs/${blogId}`);
      const blogData = response.data.blog;
      setEditDetails(blogData);
      setSelectedImage(blogData.image ? `${Url}/uploads/${blogData.image}` : placeholder);
    } catch (error) {
      console.error('Error fetching blog details:', error);
    }
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        Swal.fire('Error!', 'Please select an image file', 'error');
        return;
      }
      setSelectedImage(URL.createObjectURL(file));
      setFieldValue('image', file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('CategoryName', values.CategoryName);

      if (values.action === 'edit') {
        formData.append('id', values.id);
      }

      if (values.image instanceof File) {
        formData.append('image', values.image);
      } else if (values.action === 'add') {
        throw new Error('Image is required');
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const url = values.action === 'edit' ? `${Url}/api/blogs/${values.id}` : `${Url}/api/blogs`;

      const method = values.action === 'edit' ? 'put' : 'post';

      const response = await axios[method](url, formData, config);

      if (response.data.success) {
        Swal.fire('Success!', `Blog ${values.action === 'edit' ? 'updated' : 'created'} successfully.`, 'success');
        setShowAddModal(false);
        setShowEditModal(false);
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error!', error.response?.data?.message || error.message || 'Something went wrong', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }

  return (
    <div>
      <Breadcrumb>
        <Link to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Link>
        <Link to={`${APP_PREFIX_PATH}/dashboard`}>Dashboard</Link>
        <Breadcrumb.Item active>Manage Blog</Breadcrumb.Item>
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
                    <Button onClick={() => setShowAddModal(true)}>
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
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Image</th>
                      <th style={{ textAlign: 'center' }}>Title</th>
                      <th style={{ textAlign: 'center' }}>Category</th>
                      <th style={{ textAlign: 'center' }}>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog, index) => (
                      <tr key={blog.id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`${blog.id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, blog.id)}
                            className="btn-action"
                          >
                            <Dropdown.Item as={Link} to={`${APP_PREFIX_PATH}/view_banner/${blog.id}`}>
                              <FaEye className="icon" style={{ marginRight: '8px' }} />
                              View
                            </Dropdown.Item>
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
                            src={`${Url}/uploads/${blog.image}`}
                            alt="Blog"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          />
                        </td>
                        <td style={{ textAlign: 'center' }}>{blog.title}</td>
                        <td style={{ textAlign: 'center' }}>{blog.category?.CategoryName}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(blog.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TablePagination
                  component="div"
                  count={filteredBlogDetails.length}
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

      {/* Add Blog Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              title: '',
              description: '',
              CategoryName: '',
              image: null,
              action: 'add'
            }}
            validationSchema={Yup.object().shape({
              title: Yup.string().required('Title is required'),
              description: Yup.string().required('Description is required'),
              CategoryName: Yup.string().required('Category is required'),
              image: Yup.mixed().required('Image is required')
            })}
            onSubmit={handleSubmit}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="CategoryName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.CategoryName}
                    isInvalid={touched.CategoryName && !!errors.CategoryName}
                  >
                    <option value="">Select Category</option>
                    {categoryDetails.map((category) => (
                      <option key={category.CategoryName} value={category.CategoryName}>
                        {category.CategoryName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.CategoryName}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && !!errors.title}
                  />
                  <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && !!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <div className="mb-3">
                  <img src={selectedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    isInvalid={touched.image && !!errors.image}
                  />
                  <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Edit Blog Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDetails && (
            <Formik
              initialValues={{
                id: editDetails.id,
                title: editDetails.title,
                description: editDetails.description,
                CategoryName: editDetails.CategoryName,
                image: null,
                action: 'edit'
              }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Title is required'),
                description: Yup.string().required('Description is required'),
                CategoryName: Yup.string().required('Category is required')
              })}
              onSubmit={handleSubmit}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="CategoryName"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.CategoryName}
                      isInvalid={touched.CategoryName && !!errors.CategoryName}
                    >
                      <option value="">Select Category</option>
                      {categoryDetails.map((category) => (
                        <option key={category.CategoryName} value={category.CategoryName}>
                          {category.CategoryName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.CategoryName}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.title && !!errors.title}
                    />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.description && !!errors.description}
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="mb-3">
                    <img src={selectedImage} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Image (Leave empty to keep current)</Form.Label>
                    <Form.Control type="file" name="image" accept="image/*" onChange={(e) => handleFileChange(e, setFieldValue)} />
                  </Form.Group>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageBanner;
