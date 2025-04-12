/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import './main.css';
import placeholder from '../../assets/images/placeholder.jpg'; // Adjust the import path accordingly
import { Url, IMAGE_PATH, APP_PREFIX_PATH } from '../../config/constant'; // Adjust the import paths accordingly
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Breadcrumb } from 'react-bootstrap';



const ViewBanner = () => {
  var { banner_id } = useParams();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    console.log('df', banner_id);
    axios
      .get(`${Url}/view_banner?banner_id=${banner_id}`)
      .then((response) => {
        console.log('banner_detail get', response);
        setUser(response.data.data.banner_detail[0]);
      })
      .catch((error) => {
        console.error('Error fetching banner details:', error);
      });
  }, []);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}` + '/dashboard'}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}` + '/manage_banner'}>
          Manage Blog
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Blog</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        <Col sm={12}>
          <Card className="p-4">
            <Row>
              <Col md={4} style={{ margin: 'auto' }}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={user.image ? `${IMAGE_PATH}/${user.image}` : `${placeholder}`}
                    style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}
                    alt="Customer Avatar"
                    onClick={handleShow}
                  />
                </div>
              </Col>
              <Col md={8}>
                <h6 className='mb-4'>Banner Detail</h6>
                <div className="profile mt-2">
                  <div className="user-detail row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Category Name:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.category_name ? user.category_name : 'NA'}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Title:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.title ? user.title : 'NA'}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Descritpion:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.description ? user.description : 'NA'}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Create Date & Time:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.createtime_date ? formatDate(user.createtime_date) : 'NA'}</p>
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
      <Row>
        <Col sm={12} style={{ textAlign: 'right', marginTop: '10px' }}></Col>
      </Row>

      <Modal show={show} onHide={handleClose} style={{ width: '100%' }}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <img
            src={user.image ? `${IMAGE_PATH}/${user.image}` : `${placeholder}`}
            alt="Preview"
            style={{ width: '100%', height: '345px', margin: 'auto', display: 'flex', objectFit: 'cover' }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewBanner;
