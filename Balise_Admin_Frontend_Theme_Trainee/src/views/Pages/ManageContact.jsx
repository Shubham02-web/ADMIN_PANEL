import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { Button, Form, Modal, FormControl } from 'react-bootstrap';
import TablePagination from '@mui/material/TablePagination';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';

import './main.css';
import { IoMdSend } from 'react-icons/io';
// import avatar1 from 'assets/images/user/avatar-1.jpg';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { Url } from 'config/constant';

const ManageContact = () => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(10);
  const [userDetails, setUserDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  // const [selectedActions, setSelectedActions] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // State to store messages
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  // const [searchTerm, setSearchTerm] = useState('');
  // const [show, setShow] = useState('false');

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function getContactUsDetails() {
    axios
      .get(Url + '/get_contact')
      .then((response) => {
        if (response.data.success) {
          // const sortedDetails = response.data.res.sort((a, b) => b.contact_id - a.contact_id);
          console.log('response', response.data.data.users);

          setUserDetails(response.data.data.users);
        } else {
          console.error('Failed to fetch user details:', response.data.msg);
        }
      })
      .catch((error) => {
        console.log('Error fetching user details:', error);
      });
  }

  useEffect(() => {
    getContactUsDetails();
  }, []);

  const handleSelect = (action, user) => {
    // setSelectedActions({ ...selectedActions, [index]: action });
    if (action === 'reply') {
      setSelectedUser(user);
      setShowModal(true);
      setName(user.name);
      setEmail(user.email);
      setError('');
    }
    if (action === 'view') {
      setShowMsgModal(true);
      setSelectedUser(user);
      fetchMessages(user.contact_id); // Fetch messages when viewing
    }
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

  const sendReplyEmail = () => {
    if (!name || !email || !title || !message) {
      setError('* All fields are required');
      return;
    }
    setShowModal(false);

    if (selectedUser && selectedUser.email) {
      const { email: userEmail, contact_id } = selectedUser;
      console.log('hey',contact_id,  userEmail, name,  title, message)
      axios
        .post(Url + '/send_reply', { contact_id, user_email: userEmail, user_name: name,  title, message })
        .then((response) => {
          if (response.data.success) {
            axios
              .post(Url + 'updateStatus', { contact_id, message })
              .then(() => {
                const updatedUserDetails = userDetails.map((user) =>
                  user.contact_id === contact_id ? { ...user, status: 1, replied_date_time: new Date() } : user
                );
                setUserDetails(updatedUserDetails);
                setShowModal(false);
                setError('');
                setTitle('');
                setMessage('');
              })
              .catch((error) => {
                console.log('Error updating user status:', error);
              });
          } else {
            console.log('Failed to send email:', response.data.msg);
          }
        })
        .catch((error) => {
          console.log('Error sending email:', error);
        });
    } else {
      console.log("No user selected or user's email is invalid");
    }
  };

  const fetchMessages = (contact_id) => {
    console.log('con', contact_id);
    axios
      .post(Url + 'ViewReplymsg', { contact_id })
      .then((response) => {
        if (response.data.success) {
          setMessages([{ message: response.data.reply }]); // Update state with fetched message
          console.log([{ message: response.data.reply }]); // Update state with fetched message
          setShowMsgModal(true); // Ensure modal is shown after fetching messages
        } else {
          console.error('Failed to fetch messages:', response.data.msg);
        }
      })
      .catch((error) => {
        console.log('Error fetching messages:', error);
      });
  };
  const closeModal = () => {
    setShowModal(false);
    setShowMsgModal(false); // Hide message modal on close
    setMessages([]); 
   setTitle('');
    setMessage('');
  };

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = userDetails.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = userDetails.filter((row) => {
    const name = row.name ? row.name.toLowerCase() : ''; // Change to 'name' directly
    const email = row.email ? row.email.toLowerCase() : ''; // Use 'email' directly
    const message = row.message ? row.message.toLowerCase() : ''; // Use 'message' directly
    const dateMatch = new Date(row.replied_date_time).toLocaleDateString().includes(searchQuery);
    const query = searchQuery.toLowerCase();

    return name.includes(query) || email.includes(query) || dateMatch || message.includes(query);
  });

  const paginatedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, userDetails.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item to="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item to="#">Dashboard</Breadcrumb.Item>

        <Breadcrumb.Item to="#">Manage Contact</Breadcrumb.Item>
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
                      value={searchQuery}
                      onChange={handleSearch}
                      style={{ maxWidth: '220px', width: '100%' }}
                    />
                  </Col>
                </Row>
              </Form>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-card" style={{ height: '500px' }}>
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>S.No</th>
                
                      <th style={{ textAlign: 'center' }}>Action</th>
                      <th style={{ textAlign: 'center' }}>Name</th>
                      <th style={{ textAlign: 'center' }}>Email</th>
                      <th style={{ textAlign: 'center' }}>Message</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Replied Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((user, index) => (
                      <tr key={user.contact_id}>

                        <td style={{ textAlign: 'center' }}>{index + 1}</td>

                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton
                            title="Action"
                            id={`dropdown-${user.contact_id}`}
                            onSelect={(eventKey) => handleSelect(eventKey, user)}
                            className="btn-action"
                          >
                            <Dropdown.Item eventKey="reply">
                              <IoMdSend className="icon" style={{ marginRight: '8px' }} /> Reply
                            </Dropdown.Item>

                            {/* <Dropdown.Item eventKey="view">
                              <FaEye className="icon" style={{ marginRight: '8px' }} /> View
                            </Dropdown.Item> */}
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>{user.name}</td>
                        <td style={{ textAlign: 'center' }}>{user.email}</td>
                        <td style={{ textAlign: 'center' }}>{user.message}</td>
                        <td style={{ textAlign: 'center' }}>
                          {user.status === 0 ? <span className="btn-pending">Pending</span> : <span className="btn-active">Replied</span>}
                        </td>
                        <td style={{ textAlign: 'center' }}>{user.reply_datetime ? formatDate(user.reply_datetime) : 'NA'}</td>
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
                  count={userDetails.length}
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
      {/* reply modal */}

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header >
          <Modal.Title>Reply to Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="enter message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
          </Form>
          {error && <span style={{ color: 'red' }}>{error}</span>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={sendReplyEmail}>
            Reply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for viewing messages */}
      <Modal show={showMsgModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Messages</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messages.map((msg, index) => (
            <div key={index}>
              <p>{msg.message}</p>
              {/* If sent_date_time is available in the API response */}
              {/* <p>Sent Date: {formatDate(msg.sent_date_time)}</p> */}
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageContact;
