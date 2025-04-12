import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Tabs, Modal, Tab, Form, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import './main.css';
import { Url } from '../../config/constant';
import Swal from 'sweetalert2';

function Managebroadcast() {
  const [key, setKey] = useState('allCustomers');
  const [content, setContent] = useState(0);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selecterror, setselecterror] = useState('');

  const contentTypes = {
    all: 0,
    specific: 1,
  };

  useEffect(() => {
    axios
      .get(`${Url}/Users`)
      .then((response) => {
        const userOptions = response.data.res.map((user) => ({
          value: user.user_id,
          label: user.name,
        }));
        setUsers(userOptions);
      })
      .catch((error) => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  const validateFields = () => {
    const newErrors = {};

    // if (selectedUsers.length === 0) {
    //   newErrors.selectedUsers = 'Select User';
    // }
    if (!title.trim()) {
      newErrors.title = 'Enter title';
    }
    if (!message.trim()) {
      newErrors.message = 'Enter message';
    }
    if (content === contentTypes.specific && selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Select user';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const SendBroadcast = () => {
    if (!validateFields()) return;

    const data = {
      action: 'send',
      subject: title,
      message,
      select_arr: content === contentTypes.specific ? JSON.stringify(selectedUsers.map((user) => user.value)) : [],
      userType: content === contentTypes.all ? 'all' : 'user',
    };

    setIsButtonDisabled(true);
    axios
      .post(`${Url}send_broadcast`, data)
      .then(() => {

        setShowModal(true);
        setErrors({});
      })
      .catch(() => {
        setShowModal(true);
        setErrors({});
      })
      .finally(() => {
        setIsButtonDisabled(false);

      });
  };

  const handleModalClose = () => {
    setTitle('');
    setMessage('');
    setSelectedUsers([]);
    setIsButtonDisabled(false);
    setShowModal(false);

  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Manage Broadcast</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="p-3">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          style={{ borderBottom: '0' }}
        >
          <Tab eventKey="allCustomers" title="All Customers">
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setErrors({ ...errors, title: '' });
                        }}
                        isInvalid={errors.title}
                      />
                      {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter your message"
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setErrors({ ...errors, message: '' });
                        }}
                        isInvalid={!!errors.message}
                      />
                      {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                    </Col>
                  </Form.Group>
                  <Button className="btn btn-primary" type="button" onClick={SendBroadcast} disabled={isButtonDisabled}>
                    Submit
                  </Button>
                </Form>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="selectCustomers" title="Select Customers">
            <Row>
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-3" controlId="formSelectUsers">
                    <Form.Label>Select Customer</Form.Label>

                    <Col sm={10}>
                      <Select
                        isMulti
                        options={users}
                        value={selectedUsers}
                        onChange={(e) => {
                          setSelectedUsers(e);
                          setselecterror('');
                        }}
                        isInvalid={!!errors.selectedUsers}
                        placeholder="Select users"
                      />
                      {errors.selectedUsers && <Form.Control.Feedback type="invalid">{errors.selectedUsers}</Form.Control.Feedback>}
                    </Col>

                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formTitle">
                    <Form.Label>Title</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          setErrors({ ...errors, title: '' });
                        }}
                        isInvalid={!!errors.title}
                      />
                      {errors.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                    </Col>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        as="textarea"
                        placeholder="Enter your message"
                        rows={3}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          setErrors({ ...errors, message: '' });
                        }}
                        isInvalid={!!errors.message}
                      />
                      {errors.message && <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>}
                    </Col>
                  </Form.Group>
                  <Button className="btn btn-primary" type="button" onClick={SendBroadcast} disabled={isButtonDisabled}>
                    Send
                  </Button>
                </Form>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Card>

      {/* For notify after Broadcast sent */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Broadcast Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Broadcast has been sent successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Managebroadcast;
