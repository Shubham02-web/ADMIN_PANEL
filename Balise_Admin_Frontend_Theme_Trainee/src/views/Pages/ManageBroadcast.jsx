import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Tabs, Modal, Tab, Form, Breadcrumb } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import './main.css';
import { Url } from '../../config/constant';
import Swal from 'sweetalert2';

function Managebroadcast() {
  const [key, setKey] = useState('allCustomers');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const contentTypes = {
    all: 0,
    specific: 1
  };

  useEffect(() => {
    axios
      .get(`${Url}/broadcast/customers`)
      .then((response) => {
        const userOptions = response.data.data.map((user) => ({
          value: user.id,
          label: user.username
        }));
        setUsers(userOptions);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Enter title';
    if (!message.trim()) newErrors.message = 'Enter message';
    if (key === 'selectCustomers' && selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Select at least one user';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTabChange = (tabKey) => {
    setKey(tabKey);
    setSelectedUsers([]);
    setErrors({});
  };

  const SendBroadcast = () => {
    if (!validateFields()) return;

    const data = {
      subject: title,
      message,
      user_type: key === 'allCustomers' ? 'all' : 'specific',
      select_arr: key === 'selectCustomers' ? JSON.stringify(selectedUsers.map((user) => user.value)) : '[]'
    };

    setIsButtonDisabled(true);
    axios
      .post(`${Url}/api/broadcast/send_broadcast`, data)
      .then((response) => {
        if (response.data.success) {
          setShowModal(true);
          setTitle('');
          setMessage('');
          setSelectedUsers([]);
        } else {
          Swal.fire('Error!', response.data.message || 'Failed to send broadcast', 'error');
        }
      })
      .catch((error) => {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to send broadcast', 'error');
      })
      .finally(() => setIsButtonDisabled(false));
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
        <Tabs activeKey={key} onSelect={handleTabChange} className="mb-3">
          <Tab eventKey="allCustomers" title="All Customers">
            <Row className="mt-3">
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} isInvalid={!!errors.title} />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" onClick={SendBroadcast} disabled={isButtonDisabled}>
                    Send Broadcast
                  </Button>
                </Form>
              </Col>
            </Row>
          </Tab>
          <Tab eventKey="selectCustomers" title="Select Customers">
            <Row className="mt-3">
              <Col md={12}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Users</Form.Label>
                    <Select isMulti options={users} value={selectedUsers} onChange={setSelectedUsers} isInvalid={!!errors.selectedUsers} />
                    {errors.selectedUsers && <div className="text-danger mt-1">{errors.selectedUsers}</div>}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} isInvalid={!!errors.title} />
                    <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      isInvalid={!!errors.message}
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </Form.Group>
                  <Button variant="primary" onClick={SendBroadcast} disabled={isButtonDisabled}>
                    Send Broadcast
                  </Button>
                </Form>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Broadcast has been sent successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Managebroadcast;
