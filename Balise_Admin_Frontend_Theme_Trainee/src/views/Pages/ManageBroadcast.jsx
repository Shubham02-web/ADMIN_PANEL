import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Url } from 'config/constant';

const Managebroadcast = () => {
  const [key, setKey] = useState('allCustomers');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    productName: '',
    price: '',
    quantity: '',
    description: '',
    email: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${Url}/api/broadcast/customers`);
      const userOptions = response.data.customers.map((user) => ({
        value: user.id,
        label: user.username
      }));
      setUsers(userOptions);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    if (key === 'selectCustomers' && selectedUsers.length === 0) {
      newErrors.selectedUsers = 'Please select at least one customer';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const SendBroadcast = () => {
    if (!validateFields()) return;

    const isAll = key === 'allCustomers';

    const data = {
      title,
      message,
      selectedCustomerIds: isAll ? [] : selectedUsers.map((user) => user.value)
    };

    console.log('Payload being sent:', data); // 🔍 Debug log

    setIsButtonDisabled(true);

    axios
      .post(`${Url}/api/broadcast/create`, data)
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

  const handleCreateBooking = async () => {
    try {
      const response = await axios.post(`${Url}/bookings`, newBooking);
      setBookings([...bookings, response.data.data]);
      setShowCreateModal(false);
      setNewBooking({
        productName: '',
        price: '',
        quantity: '',
        description: '',
        email: ''
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
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
        <Tabs activeKey={key} onSelect={setKey} className="mb-3">
          <Tab eventKey="allCustomers" title="All Customers">
            <Form className="mt-3">
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
          </Tab>

          <Tab eventKey="selectCustomers" title="Select Customers">
            <Form className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>Select Users</Form.Label>
                <Select
                  isMulti
                  options={users}
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  className={errors.selectedUsers ? 'is-invalid' : ''}
                />
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
          </Tab>
        </Tabs>
      </Card>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                value={newBooking.productName}
                onChange={(e) => setNewBooking({ ...newBooking, productName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={newBooking.price}
                onChange={(e) => setNewBooking({ ...newBooking, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={newBooking.quantity}
                onChange={(e) => setNewBooking({ ...newBooking, quantity: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={newBooking.description}
                onChange={(e) => setNewBooking({ ...newBooking, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newBooking.email}
                onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateBooking}>
            Create Booking
          </Button>

          <Button variant="success" onClick={() => setShowCreateModal(true)}>
            Create New Booking
          </Button>
        </Modal.Footer>
      </Modal>

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
};

export default Managebroadcast;
