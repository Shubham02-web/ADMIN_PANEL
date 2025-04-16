import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Button, Form, Modal } from 'react-bootstrap';
import { Dropdown, DropdownButton, FormControl } from 'react-bootstrap';
import TablePagination from '@mui/material/TablePagination';
import { FaEye } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Url } from '../../config/constant';
import './main.css';

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${Url}/api/messages`);

      // Debugging logs
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      // Handle different response structures
      let messagesData = [];

      if (Array.isArray(response.data)) {
        // If backend returns direct array
        messagesData = response.data;
      } else if (response.data && Array.isArray(response.data.messages)) {
        // If backend returns { messages: [] }
        messagesData = response.data.messages;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // If backend returns { success: true, data: [] }
        messagesData = response.data.data;
      } else {
        throw new Error('Unexpected response format');
      }

      setMessages(messagesData);
      setFilteredMessages(messagesData);
    } catch (error) {
      console.error('Fetch error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      Swal.fire({
        icon: 'error',
        title: 'Failed to load messages',
        text: error.response?.data?.message || error.message
      });
    }
  };
  useEffect(() => {
    console.log('Making API call to:', `${Url}/api/messages`);
    fetchMessages();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = messages.filter((msg) => {
      return (
        msg.customerName.toLowerCase().includes(query) ||
        msg.customerEmail.toLowerCase().includes(query) ||
        msg.message.toLowerCase().includes(query) ||
        (msg.reply && msg.reply.toLowerCase().includes(query)) ||
        msg.status.toLowerCase().includes(query)
      );
    });
    setFilteredMessages(filtered);
    setPage(0); // Reset to first page when searching
  };

  // Handle reply to message
  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  // Handle view message
  const handleView = (message) => {
    setSelectedMessage(message);
    setShowViewModal(true);
  };

  // Send reply
  const sendReply = async () => {
    if (!replyContent.trim()) {
      Swal.fire('Error!', 'Reply content cannot be empty', 'error');
      return;
    }

    try {
      const response = await axios.put(`${Url}/api/messages/${selectedMessage.id}`, {
        reply: replyContent
      });

      if (response.data.success) {
        Swal.fire('Success!', 'Reply sent successfully', 'success');
        setShowReplyModal(false);
        setReplyContent('');
        fetchMessages(); // Refresh the list
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      Swal.fire('Error!', 'Failed to send reply', 'error');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedMessages = filteredMessages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredMessages.length - page * rowsPerPage);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Manage Contact Messages</Breadcrumb.Item>
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
                      placeholder="Search messages..."
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
                      <th style={{ textAlign: 'center' }}>Actions</th>
                      <th style={{ textAlign: 'center' }}>Name</th>
                      <th style={{ textAlign: 'center' }}>Email</th>
                      <th style={{ textAlign: 'center' }}>Message</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'center' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMessages.map((message, index) => (
                      <tr key={message.id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton title="Actions" id={`dropdown-${message.id}`} size="sm">
                            <Dropdown.Item onClick={() => handleView(message)}>
                              <FaEye className="icon" style={{ marginRight: '8px' }} /> View
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleReply(message)} disabled={message.status === 'replied'}>
                              <IoMdSend className="icon" style={{ marginRight: '8px' }} /> Reply
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>{message.customerName}</td>
                        <td style={{ textAlign: 'center' }}>{message.customerEmail}</td>
                        <td style={{ textAlign: 'center' }}>
                          {message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${message.status === 'pending' ? 'bg-warning' : 'bg-success'}`}>{message.status}</span>
                        </td>
                        <td style={{ textAlign: 'center' }}>{formatDate(message.createdAt)}</td>
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
                  component="div"
                  count={filteredMessages.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPageOptions={[5, 10, 25]}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reply Modal */}
      <Modal show={showReplyModal} onHide={() => setShowReplyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reply to Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>From</Form.Label>
              <Form.Control type="text" value={selectedMessage?.customerName || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" value={selectedMessage?.customerEmail || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Original Message</Form.Label>
              <Form.Control as="textarea" rows={3} value={selectedMessage?.message || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Your Reply</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReplyModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={sendReply}>
            Send Reply
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Message Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMessage && (
            <div>
              <div className="mb-3">
                <h6>From: {selectedMessage.customerName}</h6>
                <p>Email: {selectedMessage.customerEmail}</p>
                <p>Date: {formatDate(selectedMessage.createdAt)}</p>
              </div>

              <div className="mb-3 p-3 bg-light rounded">
                <h5>Original Message:</h5>
                <p>{selectedMessage.message}</p>
              </div>

              {selectedMessage.reply && (
                <div className="p-3 bg-light rounded">
                  <h5>Your Reply:</h5>
                  <p>{selectedMessage.reply}</p>
                  <small className="text-muted">Replied on: {formatDate(selectedMessage.updatedAt)}</small>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageContact;
