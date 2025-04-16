/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import './main.css';
import placeholder from '../../assets/images/placeholder.jpg';
import { IMAGE_PATH, APP_PREFIX_PATH } from '../../config/constant';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Breadcrumb } from 'react-bootstrap';

const ViewCustomer = () => {
  const Url = 'http://localhost:8000/api/Question';
  const { question_id } = useParams();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log(question_id);
    axios
      .get(`${Url}/get_edit_question_detail/${question_id}`)
      .then((response) => {
        console.log('API Response:', response.data);
        // Adjust based on your API response structure
        setUser(response.data.data || {}); // Assuming data is in response.data.data
      })
      .catch((error) => {
        console.error('Error fetching question details:', error);
      });
  }, [question_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/ManageQuestion`}>
          Manage Question
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Question</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col sm={12}>
          <Card className="p-4">
            <Row>
              <Col md={12}>
                <h6>Question Details</h6>
                <div className="profile mt-2">
                  <div className="user-detail row">
                    <div className="col-lg-12">
                      {/* Question Section */}
                      <div className="row mb-3">
                        <div className="col-lg-3">
                          <p className="mb-0">Question</p>
                        </div>
                        <div className="col-lg-9">
                          <p className="text-muted mb-0">{user.question || 'NA'}</p>
                        </div>
                      </div>

                      {/* Answer Section */}
                      <div className="row mb-3">
                        <div className="col-lg-3">
                          <p className="mb-0">Answer</p>
                        </div>
                        <div className="col-lg-9">
                          <p className="text-muted mb-0">{user.answer || 'NA'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img
            src={user.profilePicture ? `${Url}/uploads/${user.profilePicture}` : placeholder}
            alt="Preview"
            style={{ width: '100%', height: '345px', objectFit: 'cover' }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewCustomer;
