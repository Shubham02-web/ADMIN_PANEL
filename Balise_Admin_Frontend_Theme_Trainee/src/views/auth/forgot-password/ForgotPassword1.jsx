import React, { useState  } from 'react';
import { useNavigate } from "react-router-dom";

// react-bootstrap
import { Card, Row, Col } from 'react-bootstrap';

// project import
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

// assets
import logoDark from '../../../assets/images/logo.png';
import '../../../views/Pages/main.css';
import { APP_PREFIX_PATH ,Url} from 'config/constant';
import axios from 'axios';
import Swal from 'sweetalert2';


// ==============================|| RESET PASSWORD 1 ||============================== //

const ForgotPassword1 = () => {
  const navigate = useNavigate();
   const [error, setError] = useState('');
     const [email, setEmail] = useState('');

     const handleReset = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

      try {
        const checkResponse = await  axios.post(`${Url}/forgot_password`, {email:email}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
          // setData1(res.data.data);
          if (res.data.success) {
            Swal.fire({
              icon: 'success',
               title: 'Forgot Password',
              text: 'Password reset link has been sent Successfully.',
              confirmButtonText: 'Ok'
            }).then(() => {
           navigate(APP_PREFIX_PATH +'/signin');
            });
          }
        })
        .catch((err) => console.error('Error fetching banner:', err));
    
    } catch (error) {
      console.error('Error checking or sending reset link:', error);
 
    }

  }
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content ">
          <Card className="borderless">
            <Row className=" ">
              <Col>
                <Card.Body className="card-body">
                  <div className="d-flex justify-content-center">
                    <img src={logoDark} alt="" className="img-fluid mb-4 " style={{ width: '100px' }} />
                  </div>
                  <h4 className="mb-3 f-w-400 text-center">Forgot password</h4>
                  <lable>Email</lable>
                  <div className="input-group mb-4">
                   <input
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                   {error && <p style={{ marginTop: '-17px', marginLeft: '-9.5rem', textAlign: 'center', color: 'red' }}>{error}</p>}{' '}
                  <div className="text-center">
                 
                <button className="btn btn-primary mb-4" onClick={handleReset}>
                    Send
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

export default ForgotPassword1;
