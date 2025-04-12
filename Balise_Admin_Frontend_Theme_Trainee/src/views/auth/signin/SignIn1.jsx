import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';
import logoDark from '../../../assets/images/logo.png';
import '../../../views/Pages/main.css';

import { Url, APP_PREFIX_PATH } from '../../../config/constant';


const Signin1 = () => {
  const navigate = useNavigate();
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [data1, setData1] = useState([]);
  // const Url = `${env.VITE_APP_BASE_NAME}`;

  const handleSubmit = async (values) => {
    const { email, password } = values;
    const data = { action: 'sign-in', email, password, user_type: 0 };
    console.log('data is here:- ', data1);
    axios.post(`${Url}/signin`, data)
      .then(res => {
        setData1(res.data.data);
        if (!res.data.success) {
          console.log('checkkkk', res)
          if (res.data.key === 'email') {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: res.data.message || 'Email is not correct',
              confirmButtonText: 'Ok'
            });
          } else if (res.data.key === 'password') {
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: res.data.message || 'Password is not correct',
              confirmButtonText: 'Ok'
            });
          }
        } else if (res.data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Login',
            text: 'Login Successfully.',
            confirmButtonText: 'Ok'
          }).then(() => {
            navigate(APP_PREFIX_PATH + "/dashboard");
            localStorage.setItem('token1', res.data.token);
            localStorage.setItem('userId1', res.data.data.user_arr.user_id);
            localStorage.setItem('UserType1', res.data.data.user_arr.user_type);
            if (keepSignedIn) {
              localStorage.setItem('remember_email1', email);
              localStorage.setItem('remember_password1', password);
            } else {
              localStorage.removeItem('remember_email1');
              localStorage.removeItem('remember_password1');
            }

          });
        }
      })
      .catch(err => console.error("Error fetching users:", err));
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless">
            <Card.Body>
              <h4 className="mb-3 f-w-400 text-center">Login</h4>
              <div className='d-flex justify-content-center'>
                <img src={logoDark} alt="" className="img-fluid mb-4" style={{ width: '100px' }} />
              </div>
              <AuthLogin handleSubmit={handleSubmit} setKeepSignedIn={setKeepSignedIn} />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
