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
import { Description, LocalConvenienceStoreOutlined } from '@mui/icons-material';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';

const ManageQuestion = () => {
 
const [questionDetails, setquesitonDetails] = useState([]);
const [questionfilteredDetails, setQuestionFilteredDetails] = useState([]);
const [show, setShow] = useState(false);
 const [show2, setShow2] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  
  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.get(`${Url}/manage_question`);
      const fetchquestionDetails = response.data.data.question_details;
      console.log('Response data:', fetchquestionDetails);
      setquesitonDetails(fetchquestionDetails);
      setQuestionFilteredDetails(fetchquestionDetails); // Initialize the filtered list
    } catch (error) {
      console.error('Error fetching manage banner details:', error);
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, []);



  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterResults(event.target.value);
  };



  const emptyRows = rowsPerPage - Math.min(rowsPerPage, questionfilteredDetails.length - page * rowsPerPage);


  const filterResults = (searchTerm) => {
    // Ensure searchTerm is a string and handle cases where it might be null or undefined
    const lowercasedFilter = (searchTerm || '').toLowerCase();

    // Filter userDetails with proper null checks
    const filtered = questionDetails.filter((user) => {
      // Check if username and email exist and are strings before calling toLowerCase
      const question = (user.question || '').toString().toLowerCase();
      const question_created_by = (user.question_created_by==0 ? "Admin" :"User");
      const createtime = user.createtime ? formatDate(user.createtime).toLowerCase() : '';

      // Return whether any of the conditions match the lowercased filter
      return (
question_created_by.toLowerCase().includes(lowercasedFilter.toLowerCase())
      ||  question.includes(lowercasedFilter) ||question_created_by.includes(lowercasedFilter) ||
        createtime.includes(lowercasedFilter)
      );
    });

    // Update the state with the filtered results
    setQuestionFilteredDetails(filtered);
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

  const handleSubmit = async (values) => {
     console.log('values',values);

    const { question,created_by, action } = values;

if(action === 'add_question'){
    const data = new FormData();
       const user_id= localStorage.getItem('userId1');
       console.log('user_id',user_id);
     data.append('user_id', user_id);
      data.append('question', question);
      data.append('action', 'add_question');
      data.append('created_by', created_by);
       console.log('data', data);

      axios.post(`${Url}/add_question`, data, {
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
              text: 'Question added successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
              
            fetchQuestionDetails();
            });
          }
        }) .catch((err) => console.error('Error fetching banner:', err));
  };
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleClose2 = () => setShow2(false);



  //edit banner
  const fetchEditDetails = async (question_id) => {
    try {
      const params = {
        action: 'get_edit_question_detail',
        question_id: question_id,
      };
      const response = await axios.get(`${Url}/get_edit_question_detail`, { params });
      const QuesitonData = response.data.data;
  
      setEditDetails(QuesitonData);
      console.log("check QuesitonData", QuesitonData);
    } catch (error) {
      console.error('Error fetching banner details:', error);
    }
  };



  return (
    <div>
      <Breadcrumb>
        <Link to={`${APP_PREFIX_PATH}` + '/dashboard'}>
          <i className="feather icon-home" />
        </Link>&nbsp;&nbsp;<span>/</span>&nbsp;&nbsp;
        <Link active>Manage Question</Link>
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
                      Add Question
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
                      <th style={{ textAlign: 'center' }}>Question</th>
                      <th style={{ textAlign: 'center' }}>Created By</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0
                      ? questionfilteredDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : questionfilteredDetails
                    ).map((question, index) => (
                      <tr key={question.banner_id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        {/* <td style={{ textAlign: 'center' }}>{banner.banner_id}</td> */}
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${question.banner_id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, question.banner_id)}
                            className="btn-action"
                          >
                            <Dropdown.Item eventKey="view">
                              <Link to={`${APP_PREFIX_PATH}/view_banner/${encode(question.banner_id)}`}>
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
                                setBannerToDelete(question.banner_id);
                              }}
                            >
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                         <td style={{ textAlign: 'center' }}>{question.question ? question.question:"-"}</td>
                          <td style={{ textAlign: 'center' }}>
                          {question.question_created_by == 0 ? <p className="btn-active">Admin</p> : <p className="btn-user">User</p>}
                        </td>
                        <td style={{ textAlign: 'center' }}>{formatDate(question.createtime)}</td>
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
                  count={questionfilteredDetails.length}
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
     {/* for add quesiotn */}
       <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{  question: '',created_by:'admin',  action: "add_question",  submit: null }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              question: Yup.string().max(255).required('Please enter question'),
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>

                {/* Hidden input for action */}
                <input type="hidden" name="action" value="add_question" />
                 <input type="hidden" name="created_by" value="admin" />
              
                <div className="form-group mb-2">
                  <label>Question</label>

                    <textarea
                    className="form-control"
                    name="question"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    rows="5"
                    placeholder="Enter question"
                    value={values.question}
                  />
               
                  {touched.question && errors.question && <small className="text-danger form-text">{errors.question}</small>}
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


      {/* for edit question */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{  question: '',created_by:'admin',  action: "add_question",  submit: null }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
              question: Yup.string().max(255).required('Please enter question'),
            })}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>

                {/* Hidden input for action */}
                <input type="hidden" name="action" value="add_question" />
                 <input type="hidden" name="created_by" value="admin" />
              
                <div className="form-group mb-2">
                  <label>Question</label>

                    <textarea
                    className="form-control"
                    name="question"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    rows="5"
                    placeholder="Enter question"
                    value={values.question}
                  />
               
                  {touched.question && errors.question && <small className="text-danger form-text">{errors.question}</small>}
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
    </div>
  );
};

export default ManageQuestion;
