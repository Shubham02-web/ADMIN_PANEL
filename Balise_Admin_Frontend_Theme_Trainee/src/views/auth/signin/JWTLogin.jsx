import { Row, Col, Alert } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
// import { NavLink } from 'react-router-dom';

import { APP_PREFIX_PATH } from 'config/constant';
import { Link } from 'react-router-dom';
APP_PREFIX_PATH
const JWTLogin = ({ handleSubmit, setKeepSignedIn }) => {
  return (
    <Formik
      initialValues={{ email: '', password: '', submit: null }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              className="form-control"
              label="Email Address / Username"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              type="email"
              placeholder="Enter Email"
              value={values.email}
            />
            {touched.email && errors.email && <small className="text-danger form-text">{errors.email}</small>}
          </div>
          <div className="form-group mb-2">
            <label>Password</label>
            <input
              className="form-control"
              label="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              placeholder="Enter password"
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>
          <div className="custom-control custom-checkbox d-flex justify-content-between flex-wrap mb-4 mt-2">
            <div>
              <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" onChange={(e) => setKeepSignedIn(e.target.checked)} />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember Me
              </label>
            </div>
            <p className="mb-2 text-muted">
              <Link to={APP_PREFIX_PATH+'/forgot-password-1'} className="f-w-400">
                Forgot password?
              </Link>
            </p>
          </div>
          {errors.submit && (
            <Col sm={12}>
              <Alert variant="danger">{errors.submit}</Alert>
            </Col>
          )}
          <Row>
            <Col mt={2} className="text-center">
              <button className="btn btn-block btn-primary mb-4" disabled={isSubmitting} size="large" type="submit">
                Signin
              </button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
