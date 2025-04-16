/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tabs, Tab, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import './main.css';
import placeholder from '../../assets/images/placeholder.jpg'; // Adjust the import path accordingly
import { Url, IMAGE_PATH } from '../../config/constant'; // Adjust the import paths accordingly

const Profile = () => {
  const [key, setKey] = useState('profile');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [userDetails, setUserDetails] = useState({});
  const [old_password, setOldPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(placeholder);
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [show, setShow] = useState(false);

  // Error states for password fields
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  // const [mobileerror, setMobileError] = useState('');
  const [imageerror, setImageError] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [activeButton, setActiveButton] = useState('all');
  console.log(imageerror);

  const fetchUserDetails = () => {
    // const params = {
    // action: 'get_profile',
    const user_id = localStorage.getItem('userId1');
    // };
    axios.get(`${Url}/api/user/${user_id}`).then((obj) => {
      const res = obj.data.user;
      console.log(res);
      const userData = res;
      setUserDetails(userData);
      setPreview(userData.image !== 'NA' ? `${Url}/uploads/${userData.image}` : placeholder);
    });
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handlePasswordChange = (e) => {
    e.preventDefault();

    // Reset errors
    setOldPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');

    let errors = {};

    // Check for empty fields and set errors
    if (!old_password) {
      errors.oldPassword = 'Please enter current password';
    }
    if (!new_password) {
      errors.newPassword = 'Please enter new password';
    } else if (new_password.length < 6 || new_password.length > 20) {
      errors.newPassword = 'Password must be between 6 and 20 characters';
    }
    if (!confirmPassword) {
      errors.confirmPassword = 'Please enter confirm password';
    } else if (new_password !== confirmPassword) {
      errors.confirmPassword = 'New password and confirm password fields must be equal';
    }

    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setOldPasswordError(errors.oldPassword || '');
      setNewPasswordError(errors.newPassword || '');
      setConfirmPasswordError(errors.confirmPassword || '');
      return;
    }

    //get user_id for localstorage
    const user_id = localStorage.getItem('userId1');
    let id = user_id;
    // Proceed with API call if no errors
    const data = { currentPassword: old_password, newPassword: new_password };
    console.warn('password data', data);
    axios
      .put(Url + `/api/user/${id}`, data)
      .then((res) => {
        if (res.data.success === false) {
          setModalShow(false);
          setOldPasswordError('Current Password is not correct');
        } else {
          // setModalShow(true);
          // setModalMessage('Password updated successfully');
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Password updated successfully',
            confirmButtonText: 'Ok'
          }).then(() => {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error', // Use 'error' to show the error icon
          title: 'Error', // Add a title for the error message
          text: 'Password not updated successfully', // Your error message
          confirmButtonText: 'Ok'
        }).then(() => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
        });
      });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');

    let hasError = false;
    if (userDetails.username == '' || userDetails.username == null) {
      setNameError('Please enter name');
      hasError = true;
    }
    if (userDetails.email == '' || userDetails.email == null) {
      setEmailError('Please enter email');
      hasError = true;
    }
    // if (!userDetails.mobile) {
    //   setMobileError('Please enter mobile');
    //   hasError = true;
    // }

    if (hasError) {
      return;
    }

    const id = localStorage.getItem('userId1');
    const data = new FormData();
    data.append('username', userDetails.username);
    data.append('email', userDetails.email);
    // data.append('mobile', userDetails.mobile);
    data.append('id', id);
    if (image) {
      data.append('image', image);
    }

    axios
      .put(Url + `/api/user/${id}`, data)
      .then((res) => {
        // setModalMessage(res.data.msg);
        // setModalShow(true);
        console.log('editprofile', data);
        if (res.data.success) {
          fetchUserDetails();
          Swal.fire({
            icon: 'success',
            title: '',
            text: 'Profile updated successfully',
            confirmButtonText: 'Ok'
          }).then(() => {});
        }
        if (res.data.key == 'Edit') {
          setModalTitle('Update');
        }
      })
      .catch((error) => {
        setModalMessage(error.response ? error.response.data.msg : 'Error updating profile');
        setModalShow(true);
        console.log(error);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith('image/')) {
        setPreview(URL.createObjectURL(file));
        setImage(file);
      } else {
        setImageError('please upload valid Image file.');
        e.target.value = null;
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username' && value.length > 50) {
      return;
    }
    if (name.length <= 0) {
      setNameError('Please enter name');
      return;
    }
    if (name === 'mobile') {
      const regex = /^[0-9\b]+$/;
      if (value === '' || regex.test(value)) {
        setUserDetails({ ...userDetails, [name]: value });
        console.log(userDetails);
        setMobileError('');
      } else {
        setMobileError('Mobile number can only contain numbers');
      }
    } else {
      setUserDetails({ ...userDetails, [name]: value });
    }
  };

  const toggleVisibility = (setter, visibility) => () => {
    setter(!visibility);
  };

  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
    setShowImagePopup(true);
  };

  // Handle closing the enlarged image popup
  const handleCloseImage = () => {
    setEnlargedImage(null);
    setShowImagePopup(false); // Hide the popup
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card className="p-4">
            <Row>
              <Col md={4} style={{ margin: 'auto' }}>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={userDetails.image ? `${Url}/uploads/${userDetails.image}` : placeholder}
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                    onClick={handleShow}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleImageClick(user.image ? `${Url}/uploads/${userDetails.image}` : placeholder);
                      }
                    }}
                  />

                  {showImagePopup && (
                    <div
                      className="enlarged-image-overlay"
                      onClick={handleCloseImage}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCloseImage();
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <span
                        className="close-button"
                        onClick={handleCloseImage}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCloseImage();
                          }
                        }}
                        role="button" // Add role="button" to indicate interactive element
                        tabIndex={0} // Add tabIndex={0} to make it focusable
                      >
                        &times;
                      </span>
                      <img
                        src={enlargedImage}
                        alt="Enlarged Profile"
                        className="enlarged-image"
                        style={{ width: '30rem', height: '30rem' }}
                      />
                    </div>
                  )}
                </div>
                <div className="text-center mt-2">
                  <small className="fw-bold">{userDetails.username}</small>
                  <p>{userDetails.email}</p>
                </div>
              </Col>
              <Col md={8}>
                <Tabs
                  id="controlled-tab-example"
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  className="mb-3"
                  style={{ borderBottom: '0' }}
                >
                  <Tab eventKey="profile" title="Edit Profile">
                    <Row>
                      <Col md={12}>
                        <Form onSubmit={handleProfileSave}>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="username"
                              placeholder="Enter your name"
                              value={userDetails.username || ''}
                              onChange={handleInputChange}
                            />
                            <p style={{ color: 'red' }}>{nameError}</p>
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="Enter your email"
                              value={userDetails.email || ''}
                              onChange={handleInputChange}
                            />
                            <p style={{ color: 'red' }}>{emailError}</p>
                          </Form.Group>

                          <div className="mb-3">
                            <img
                              src={preview}
                              alt="Logo"
                              style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          </div>

                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="categoryDescription" className="form-label">
                              Banner Image
                            </Form.Label>

                            <Form.Control className="custom-file-input mt-3" type="file" onChange={handleFileChange} accept="image/*" />
                            <p style={{ color: 'red' }}>{nameError}</p>
                          </Form.Group>
                          <Button className="btn btn-primary" type="submit">
                            Update
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="password" title="Change Password">
                    <Row>
                      <Col md={12}>
                        <Form onSubmit={handlePasswordChange}>
                          <Form.Group className="mb-3" controlId="oldPassword">
                            <Form.Label>Old Password</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                type={oldPasswordVisible ? 'text' : 'password'}
                                placeholder="Enter Old Password"
                                value={old_password}
                                onChange={(e) => {
                                  setOldPassword(e.target.value);
                                  setOldPasswordError('');
                                }}
                              />
                              <span
                                onClick={toggleVisibility(setOldPasswordVisible, oldPasswordVisible)}
                                className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer fs-5"
                              >
                                {oldPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            {oldPasswordError && <p style={{ fontSize: '13px', color: 'red' }}>{oldPasswordError}</p>}
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="newPassword">
                            <Form.Label>New Password</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                type={newPasswordVisible ? 'text' : 'password'}
                                placeholder="Enter New Password"
                                value={new_password}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span
                                onClick={toggleVisibility(setNewPasswordVisible, newPasswordVisible)}
                                className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer fs-5"
                              >
                                {newPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            {newPasswordError && <p style={{ fontSize: '13px', color: 'red' }}>{newPasswordError}</p>}
                          </Form.Group>
                          <Form.Group className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <div className="position-relative">
                              <Form.Control
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                placeholder="Enter Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                              />
                              <span
                                onClick={toggleVisibility(setConfirmPasswordVisible, confirmPasswordVisible)}
                                className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer fs-5"
                              >
                                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                              </span>
                            </div>
                            {confirmPasswordError && <p style={{ fontSize: '13px', color: 'red' }}>{confirmPasswordError}</p>}
                          </Form.Group>
                          <Button className="btn btn-primary" type="submit">
                            Update
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
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
            src={userDetails.image ? `${IMAGE_PATH}/${userDetails.image}` : `${placeholder}`}
            alt="Preview"
            style={{ width: '100%', height: '345px', margin: 'auto', display: 'flex', objectFit: 'cover' }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
