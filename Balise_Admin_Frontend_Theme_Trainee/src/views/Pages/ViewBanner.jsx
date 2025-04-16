/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import './main.css';
import placeholder from '../../assets/images/placeholder.jpg';
import { Url, APP_PREFIX_PATH } from '../../config/constant';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Breadcrumb } from 'react-bootstrap';

const ViewBanner = () => {
  const { id } = useParams();
  const [showImageModal, setShowImageModal] = useState(false);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`${Url}/api/blogs/${id}`);
        setBlog(response.data.blog);
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError('Failed to load blog details');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleCloseImageModal = () => setShowImageModal(false);
  const handleShowImageModal = () => setShowImageModal(true);

  const formatDate = (date) => {
    return moment(date).format('DD-MM-YYYY hh:mm A');
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-danger">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center py-4">Blog not found</div>;
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/dashboard`}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}/manage_blogs`}>
          Manage Blogs
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Blog</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col sm={12}>
          <Card className="p-4">
            <Row>
              <Col md={4} className="text-center">
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <img
                    src={blog.image ? `${Url}/uploads/${blog.image}` : placeholder}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      cursor: 'pointer'
                    }}
                    alt="Blog"
                    onClick={handleShowImageModal}
                  />
                </div>
              </Col>
              <Col md={8}>
                <h4 className="mb-4">Blog Details</h4>
                <div className="profile">
                  <div className="user-detail">
                    <DetailRow label="Category Name" value={blog.category?.CategoryName || 'NA'} />
                    <DetailRow label="Title" value={blog.title || 'NA'} />
                    <DetailRow label="Description" value={blog.description || 'NA'} />
                    <DetailRow label="Created At" value={formatDate(blog.createdAt) || 'NA'} />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal show={showImageModal} onHide={handleCloseImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Blog Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={blog.image ? `${Url}/uploads/${blog.image}` : placeholder}
            alt="Blog Preview"
            style={{
              width: '100%',
              maxHeight: '70vh',
              objectFit: 'contain'
            }}
          />
        </Modal.Body>
      </Modal>
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

export default ViewBanner;
