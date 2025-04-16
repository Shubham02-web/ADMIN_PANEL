import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Row, Col, Form, Breadcrumb, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaRegTrashAlt } from 'react-icons/fa';
import TablePagination from '@mui/material/TablePagination';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Url, APP_PREFIX_PATH } from '../../config/constant';
import './main.css';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const [totalPages, setTotalPages] = useState(0); // Added for pagination
  const [currentPage, setCurrentPage] = useState(1); // Added for pagination
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Url}/bookings`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          sort: 'createdAt',
          order: 'DESC'
        }
      });
      setBookings(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Swal.fire('Error!', 'Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBookings();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, rowsPerPage, searchTerm]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Url}/bookings/${id}`)
          .then(() => {
            Swal.fire('Deleted!', 'Booking has been deleted.', 'success');
            fetchBookings();
          })
          .catch((err) => {
            console.error('Error deleting booking:', err);
            Swal.fire('Error!', 'Failed to delete booking.', 'error');
          });
      }
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Manage Bookings</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="p-4">
        <Row className="mb-4">
          <Col style={{ textAlign: 'center' }}>
            <h2>Booking Management</h2>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Control
              style={{ textAlign: 'center', alignContent: 'center', justifyContent: 'center' }}
              type="text"
              placeholder="Search Bookings"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-4">Loading bookings...</div>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>B.id</th>
                  <th>Actions</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Email</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.id}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-actions" size="sm">
                          Actions
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => navigate(`${APP_PREFIX_PATH}/bookings/view/${booking.id}`)}>
                            <FaEye className="icon" style={{ marginRight: '8px' }} />
                            View Details
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleDelete(booking.id)} className="text-danger">
                            <FaRegTrashAlt className="icon" style={{ marginRight: '8px' }} />
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td>{booking.productName}</td>
                    <td>${booking.price}</td>
                    <td>{booking.quantity}</td>
                    <td>${booking.price * booking.quantity}</td>
                    <td>{booking.email}</td>
                    <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {bookings.length === 0 && <div className="text-center py-4">No bookings found</div>}

            <div className="d-flex justify-content-center">
              <TablePagination
                component="div"
                count={totalItems}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ManageBookings;
