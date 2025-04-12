import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import logoDark from '../../../assets/images/logo.png';
import '../../../views/Pages/main.css';

import { useLocation, useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH, Url } from 'config/constant';
import axios from 'axios';
import Swal from 'sweetalert2';
// ==============================|| RESET PASSWORD 1 ||============================== //

const ResetPassword1 = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState('');

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const uniqcode = queryParams.get('uniqcode');

  const handlePasswordChange = () => {

    // Reset errors
    setError('');

    setConfirmPasswordError('');
    let errors = {};

    // Check for empty fields and set errors
    if (!password) {
      errors.password = 'Please enter password';
    }
    else if (password.length < 6 || password.length > 20) {
      errors.password = 'Password must be between 6 and 20 characters';
    }


    if (!confirmPassword) {
      errors.confirmPassword = 'Please enter confirm password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'password and confirm password fields must be equal';
    }


    // Set errors if any
    if (Object.keys(errors).length > 0) {
      setError(errors.password || '');
      setConfirmPasswordError(errors.confirmPassword || '');
      return;
    }

    const data = { password: password, uniqcode: '0deac4328ed010769ef37d8434f5fb28' };

    axios.post(`${Url}/reset_password`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((res) => {
      console.log('you ', res.data);

      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          // title: 'Login',
          text: 'Password updated successfully.',
          confirmButtonText: 'Ok'
        }).then(() => {
          navigate(APP_PREFIX_PATH + '/signin');
        });
      }
    })
      .catch((err) => console.error('Error fetching banner:', err));
  };



  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <Card className="borderless">
            <Row>
              <Col>
                <Card.Body className="card-body">
                  <div className="d-flex justify-content-center">
                    <img src={logoDark} alt="" className="img-fluid mb-4" style={{ width: '100px' }} />
                  </div>
                  <h4 className="mb-3 f-w-400 text-center">Reset password</h4>

                  <label>New Password</label>
                  <div className="input-group mb-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter New Password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer fs-6" onClick={toggleShowPassword} style={{ cursor: 'pointer' }}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>
                  </div>
                  {error && <p style={{ marginTop: '-17px', marginLeft: '-1.5rem', textAlign: 'center', color: 'red' }}>{error}</p>}{' '}
                  <label>Confirm Password</label>
                  <div className="input-group mb-4">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError('') }}
                    />
                    <div className="position-absolute top-50 end-0 translate-middle-y pe-3 cursor-pointer fs-6" onClick={toggleShowConfirmPassword} >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </div>

                  </div>

                  {confirmPasswordError && <p style={{ marginTop: '-17px', marginLeft: '-1.5rem', textAlign: 'center', color: 'red' }}>{confirmPasswordError}</p>}{' '}
                  <div className="text-center">
                    <button className="btn btn-primary mb-4" onClick={handlePasswordChange}>
                      Update
                    </button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResetPassword1;
