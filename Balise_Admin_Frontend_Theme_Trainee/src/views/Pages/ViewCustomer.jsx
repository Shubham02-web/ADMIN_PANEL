/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import './main.css';
import placeholder from '../../assets/images/placeholder.jpg'; // Adjust the import path accordingly
import { Url, IMAGE_PATH,APP_PREFIX_PATH } from '../../config/constant'; // Adjust the import paths accordingly
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Breadcrumb } from 'react-bootstrap';

const ViewCustomer = () => {
  var { user_id } = useParams();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get(`${Url}/getViewUser/${user_id}`)
      .then((response) => {
        console.log('response hia', response.data.data.user_detail);
        setUser(response.data.data.user_detail);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, [user_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function formatDate(date) {
    return moment(date).format('DD-MM-YYYY');
  }

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}`+'/dashboard'}>
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`${APP_PREFIX_PATH}`+'/customer_list'}>
          Manage Customer
        </Breadcrumb.Item>
        <Breadcrumb.Item active>View Customer</Breadcrumb.Item>
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
                <h6>Customer Detail</h6>
                <div className="profile mt-2">
                  <div className="user-detail row">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>User Name:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.name ? user.name : 'NA'}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Email:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.email ? user.email : 'NA'}</p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Mobile No:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                            {user.mobile ? '+' + user.phone_code + ' ' + user.mobile : 'NA'}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Status:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p
                            className="active-btn"
                            style={{
                              borderRadius: '25px',

                              // padding: '0px 15px',
                              width: '80px',
                              color: '#fff',
                              fontWeight: '600',
                              textAlign: 'center',
                              margin: '0'
                            }}
                          >
                            {user.active_flag === 1 ? <p className="btn-active">Active</p> : <p className="btn-deactive">Deactive</p>}
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Gender:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>
                            {user.gender ? (user.gender == 1 ? 'Woman' : user.gender == 2 ? 'Man' : 'Other') : 'NA'}
                          </p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Bio:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.bio ? user.bio : 'NA'}</p>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6 cosntomer-name">
                          <p>Create Date & Time:</p>
                        </div>
                        <div className="col-lg-6 cosntomer-name2">
                          <p style={{ fontWeight: '500', marginLeft: '0px' }}>{user.createtime ? formatDate(user.createtime) : 'NA'}</p>
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

export default ViewCustomer;
