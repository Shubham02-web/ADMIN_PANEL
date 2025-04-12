import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Modal } from 'react-bootstrap';
import { Dropdown, DropdownButton, Form, FormControl } from 'react-bootstrap';
import { FaEye, FaRegTrashAlt } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import './main.css';
import avatar1 from 'assets/images/user/avatar-1.jpg';
import { Breadcrumb } from 'react-bootstrap';

const ManageBooking = () => {
  const users = [
    { id: 1, email: 'test@gmail.com', name: 'Henri', price: '$5000', qty:'3',desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 2, email: 'demo@gmail.com', name: 'John', price: '$5000',qty:'3' , desc:'Lorem ipsum dolor sit amet',createDate: '14-05-2024 05:30:55' },
    { id: 3, email: 'try@gmail.com', name: 'Maria', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 4, email: 'maria@gmail.com', name: 'Ross', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 5, email: 'alex@gmail.com', name: 'Alex', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 6, email: 'jane@gmail.com', name: 'Jane', price: '$5000',qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 7, email: 'mark@gmail.com', name: 'Mark', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 8, email: 'lucy@gmail.com', name: 'Lucy', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 9, email: 'sam@gmail.com', name: 'Sam', price: '$5000', qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 10, email: 'lisa@gmail.com', name: 'Lisa', price: '$5000', qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 11, email: 'anna@gmail.com', name: 'Anna', price: '$5000',qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 12, email: 'mike@gmail.com', name: 'Mike', price: '$5000', qty:'3' , desc:'Lorem ipsum dolor sit amet',createDate: '14-05-2024 05:30:55' },
    { id: 13, email: 'peter@gmail.com', name: 'Peter', price: '$5000',qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 14, email: 'emily@gmail.com', name: 'Emily', price: '$5000', qty:'3' , desc:'Lorem ipsum dolor sit amet',createDate: '14-05-2024 05:30:55' },
    { id: 15, email: 'sara@gmail.com', name: 'Sara', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 16, email: 'steve@gmail.com', name: 'Steve', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet',  createDate: '14-05-2024 05:30:55' },
    { id: 17, email: 'vicky@gmail.com', name: 'Vicky', price: '$5000',  qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 17, email: 'vicky@gmail.com', name: 'Vicky', price: '$5000',  qty:'3' ,desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' },
    { id: 18, email: 'jack@gmail.com', name: 'Jack', price: '$5000',  qty:'3' , desc:'Lorem ipsum dolor sit amet',createDate: '14-05-2024 05:30:55' },
    { id: 19, email: 'sophie@gmail.com', name: 'Sophie', price: '$5000', qty:'3' ,desc:'Lorem ipsum dolor sit amet',  createDate: '14-05-2024 05:30:55' },
    { id: 20, email: 'chris@gmail.com', name: 'Chris', price: '$5000', qty:'3' , desc:'Lorem ipsum dolor sit amet', createDate: '14-05-2024 05:30:55' }
  ];

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState('');
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelect = (eventKey, event, user) => {
    if (eventKey === 'edit') {
      setSelectedBanner(user);
      handleShow2();
    } else {
      // Handle other dropdown item selections if needed
      console.log(`Selected item: ${eventKey}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterResults(event.target.value);
  };

  const handleView = () => {
    navigate('/view-customer');
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item to="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item to="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item to="#">Manage Booking</Breadcrumb.Item>
      </Breadcrumb>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
            <Form className="p-2">
                <Row className="justify-content-end">
                  <Col md={3}>
                    <FormControl type="text" placeholder="Search " className="mr-sm-2" value={searchTerm} onChange={handleSearch} />
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
                      <th style={{ textAlign: 'center' }}>Product Name</th>
                      <th style={{ textAlign: 'center' }}>Price</th>
                      <th style={{ textAlign: 'center' }}> Quantity</th>
                      <th style={{ textAlign: 'center' }}> Description</th>
                      <th style={{ textAlign: 'center' }}>Create Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(rowsPerPage > 0 ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).map((user, index) => (
                      <tr key={user.id}>
                        <td style={{ textAlign: 'center' }}>{page * rowsPerPage + index + 1}</td>
                        <td style={{ textAlign: 'center' }}>
                          <DropdownButton title="Action" id={`dropdown-${user.id}`} onSelect={(eventKey, event) => handleSelect(eventKey, event, user)} className="btn-action">
                            <Dropdown.Item eventKey="view">
                              <FaEye className="icon" style={{ marginRight: '8px' }} onClick={handleView} /> View
                            </Dropdown.Item>
                            
                            <Dropdown.Item eventKey="delete">
                              <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} /> Delete
                            </Dropdown.Item>
                          </DropdownButton>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                         {user.name}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                         {user.price}
                        </td>
                        <td style={{ textAlign: 'center' }}>{user.qty}</td>
                        <td style={{ textAlign: 'center' }}>{user.desc}</td>
                        <td style={{ textAlign: 'center' }}>{user.createDate}</td>
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
                  count={users.length}
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Add Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <img src={avatar1} alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}></img>
            </div>
            <div className="mb-3">
              <label htmlFor="categoryDescription" className="form-label">
                Banner Image
              </label>
              <Form.Control type="file" />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* edit banner modal */}
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '17px' }}>Edit Banner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {selectedBanner && (
              <>
                <div className="mb-3">
                  <img src={avatar1} alt="Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}></img>
                </div>
                <div className="mb-3">
                  <label htmlFor="categoryDescription" className="form-label">
                    Banner Image
                  </label>
                  <Form.Control type="file" />
                </div>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose2}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit banner modal */}
    </div>
  );
};

export default ManageBooking;
