import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Dropdown, DropdownButton, FormControl } from 'react-bootstrap';
import { FaEye, FaRegTrashAlt, FaEdit, FaPlus } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { APP_PREFIX_PATH } from '../../config/constant';

const ManageQuestion = () => {
  const Url = 'http://localhost:8000/api/Question';
  const [questionDetails, setQuestionDetails] = useState([]);
  const [questionfilteredDetails, setQuestionFilteredDetails] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');

  const fetchQuestionDetails = async () => {
    try {
      const response = await axios.get(`${Url}/manage_question`);
      setQuestionDetails(response.data.data.question_details);
      setQuestionFilteredDetails(response.data.data.question_details);
      console.log(response.data.data.question_details);
    } catch (error) {
      console.error('Error fetching questions:', error);
      Swal.fire('Error!', 'Failed to fetch questions', 'error');
    }
  };

  useEffect(() => {
    fetchQuestionDetails();
  }, []);

  const deleteQuestion = async (question_id) => {
    try {
      const response = await axios.post(`${Url}/delete_question`, { question_id });
      if (response.data.success) {
        Swal.fire('Deleted!', 'Question deleted successfully', 'success');
        fetchQuestionDetails();
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      Swal.fire('Error!', 'Failed to delete question', 'error');
    }
  };

  const handleSelect = (eventKey, question_id) => {
    if (eventKey === 'delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this question?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          deleteQuestion(question_id);
        }
      });
    }
    if (eventKey === 'edit') {
      fetchEditDetails();
    }
  };

  const fetchEditDetails = async (question_id) => {
    try {
      // Validate question_id is a number
      if (!question_id || isNaN(question_id)) {
        throw new Error('Invalid question ID');
      }

      console.log('Question ID before API call:', question_id, typeof question_id);

      const response = await axios.get(`${Url}/get_edit_question_detail${question_id}`);

      const questionData = response.data.data;
      setEditDetails(questionData);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching question details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      Swal.fire('Error!', 'Failed to fetch question details', 'error');
    }
  };
  const handleSubmitQuestion = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${Url}/add_question`, {
        question: values.question,
        answer: values.answer,
        user_id: localStorage.getItem('userId1')
      });

      if (response.data.success) {
        Swal.fire('Success!', 'Question added successfully', 'success');
        setShowAddModal(false);
        resetForm();
        fetchQuestionDetails();
      }
    } catch (error) {
      console.error('Error adding question:', error);
      Swal.fire('Error!', 'Failed to add question', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateQuestion = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${Url}/update_question/${quest}`, {
        question_id: values.question_id,
        question: values.question,
        answer: values.answer
      });

      if (response.data.success) {
        Swal.fire('Success!', 'Question updated successfully', 'success');
        setShowEditModal(false);
        fetchQuestionDetails();
      }
    } catch (error) {
      console.error('Error updating question:', error);
      Swal.fire('Error!', 'Failed to update question', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const filterResults = (searchTerm) => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = questionDetails.filter((q) => {
      const question = q.question?.toLowerCase() || '';
      const answer = q.answer?.toLowerCase() || '';
      return question.includes(lowercasedFilter) || answer.includes(lowercasedFilter);
    });
    setQuestionFilteredDetails(filtered);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <Breadcrumb>
        <Link to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Link>
        <Breadcrumb.Item active>Manage Question</Breadcrumb.Item>
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
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        filterResults(e.target.value);
                      }}
                      style={{ maxWidth: '220px', width: '100%' }}
                    />
                  </Col>
                  <Col md={2}>
                    <Button onClick={() => setShowAddModal(true)}>
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
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Question</th>
                      <th style={{ textAlign: 'center' }}>Answer</th>
                      <th style={{ textAlign: 'center' }}>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questionfilteredDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question, index) => (
                      <tr key={question.question_id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${question.question_id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, question.question_id)}
                          >
                            <Dropdown.Item eventKey="view">
                              <Link to={`${APP_PREFIX_PATH}/view-question/${question.question_id}`}>
                                <FaEye className="icon" style={{ marginRight: '8px' }} />
                                View
                              </Link>
                            </Dropdown.Item>
                            {/* <Dropdown.Item eventKey="edit">
                              <FaEdit className="icon" style={{ marginRight: '8px' }} /> Edit
                            </Dropdown.Item> */}
                            <Dropdown.Item eventKey="delete">
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>{question.question || '-'}</td>
                        <td style={{ textAlign: 'center' }}>{question.answer || '-'}</td>
                        <td style={{ textAlign: 'center' }}>{formatDate(question.createtime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  component="div"
                  count={questionfilteredDetails.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, newPage) => setPage(newPage)}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Question Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{ question: '', answer: '' }}
            validationSchema={Yup.object().shape({
              question: Yup.string().required('Question is required'),
              answer: Yup.string().required('Answer is required')
            })}
            onSubmit={handleSubmitQuestion}
          >
            {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Question</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="question"
                    value={values.question}
                    onChange={handleChange}
                    isInvalid={touched.question && !!errors.question}
                  />
                  <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Answer</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="answer"
                    value={values.answer}
                    onChange={handleChange}
                    isInvalid={touched.answer && !!errors.answer}
                  />
                  <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* Edit Question Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editDetails && (
            <Formik
              initialValues={{
                question_id: editDetails.question_id,
                question: editDetails.question,
                answer: editDetails.answer
              }}
              validationSchema={Yup.object().shape({
                question: Yup.string().required('Question is required'),
                answer: Yup.string().required('Answer is required')
              })}
              onSubmit={handleUpdateQuestion}
            >
              {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="question"
                      value={values.question}
                      onChange={handleChange}
                      isInvalid={touched.question && !!errors.question}
                    />
                    <Form.Control.Feedback type="invalid">{errors.question}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="answer"
                      value={values.answer}
                      onChange={handleChange}
                      isInvalid={touched.answer && !!errors.answer}
                    />
                    <Form.Control.Feedback type="invalid">{errors.answer}</Form.Control.Feedback>
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

export default ManageQuestion;
