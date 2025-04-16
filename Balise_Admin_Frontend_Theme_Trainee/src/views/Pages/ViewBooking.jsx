import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, Button, Breadcrumb } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Url, APP_PREFIX_PATH } from '../../config/constant';
import Swal from 'sweetalert2';
import placeholder from '../../assets/images/placeholder.jpg';

const ViewBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedBooking, setUpdatedBooking] = useState({
    productName: '',
    price: '',
    quantity: '',
    description: '',
    email: ''
  });

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${Url}/bookings/${id}`);
        setBooking(response.data.data);
        setUpdatedBooking({
          productName: response.data.data.productName,
          price: response.data.data.price,
          quantity: response.data.data.quantity,
          description: response.data.data.description,
          email: response.data.data.email
        });
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const formatDate = (date) => {
    return moment(date).format('DD-MM-YYYY hh:mm A');
  };

  const handleDelete = () => {
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
            navigate(`${APP_PREFIX_PATH}/manage_bookings`);
          })
          .catch((err) => {
            console.error('Error deleting booking:', err);
            Swal.fire('Error!', 'Failed to delete booking.', 'error');
          });
      }
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${Url}/bookings/${id}`, updatedBooking);
      setBooking(response.data.data);
      setShowEditModal(false);
      Swal.fire('Updated!', 'Booking has been updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating booking:', error);
      Swal.fire('Error!', 'Failed to update booking.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-danger">{error}</div>;
  }

  if (!booking) {
    return <div className="text-center py-4">Booking not found</div>;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/manage_bookings`}>
          Manage Bookings
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Booking</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col sm={12}>
          <Card className="p-4">
            <Row>
              {/* <Col md={4} className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <img
                    src={placeholder}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                    alt="Booking"
                  />
                </div>
                <div className="d-flex justify-content-center gap-2">
                  <Button variant="primary" onClick={() => setShowEditModal(true)}>
                    Edit Booking
                  </Button>
                  <Button variant="danger" onClick={handleDelete}>
                    Delete Booking
                  </Button>
                </div>
              </Col> */}
              <Col md={8}>
                <h4 className="mb-4">Booking Details</h4>
                <div className="profile">
                  <div className="user-detail">
                    <DetailRow label="Product Name" value={booking.productName || 'NA'} />
                    <DetailRow label="Price" value={`$${booking.price}` || 'NA'} />
                    <DetailRow label="Quantity" value={booking.quantity || 'NA'} />
                    <DetailRow label="Total" value={`$${booking.price * booking.quantity}` || 'NA'} />
                    <DetailRow label="Description" value={booking.description || 'NA'} />
                    <DetailRow label="Email" value={booking.email || 'NA'} />
                    <DetailRow label="Created At" value={formatDate(booking.createdAt) || 'NA'} />
                    <DetailRow label="Updated At" value={formatDate(booking.updatedAt) || 'NA'} />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Edit Booking Modal
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              className="form-control"
              value={updatedBooking.productName}
              onChange={(e) => setUpdatedBooking({ ...updatedBooking, productName: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              value={updatedBooking.price}
              onChange={(e) => setUpdatedBooking({ ...updatedBooking, price: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              value={updatedBooking.quantity}
              onChange={(e) => setUpdatedBooking({ ...updatedBooking, quantity: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Description</label>
            <textarea
              className="form-control"
              value={updatedBooking.description}
              onChange={(e) => setUpdatedBooking({ ...updatedBooking, description: e.target.value })}
            />
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={updatedBooking.email}
              onChange={(e) => setUpdatedBooking({ ...updatedBooking, email: e.target.value })}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

// Helper component for consistent detail rows
const DetailRow = ({ label, value }) => (
  <Row className="mb-3">
    <Col sm={4}>
      <strong>{label}:</strong>
    </Col>
    <Col sm={8}>
      <span>{value}</span>
    </Col>
  </Row>
);

export default ViewBooking;
