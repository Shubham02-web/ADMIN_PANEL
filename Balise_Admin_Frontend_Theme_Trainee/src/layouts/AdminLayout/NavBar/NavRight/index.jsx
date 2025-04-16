import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown } from 'react-bootstrap';
// import { ListGroup, Dropdown, Card } from 'react-bootstrap';

// third party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import ChatList from './ChatList';

// assets
import placeholder from '../../../../assets/images/placeholder.jpg';
import { Url, IMAGE_PATH, APP_PREFIX_PATH } from '../../../../config/constant'; // Adjust the import paths accordingly
import axios from 'axios';
// import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
// import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
// import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
// import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// ==============================|| NAV RIGHT ||============================== //

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    // const params = {
    //   action: 'get_profile',
    const id = localStorage.getItem('userId1');
    // };
    axios
      .get(`${Url}/api/user/${id}`)
      .then((obj) => {
        const res = obj.data;
        console.log(res);
        const adminData = res;
        setAdmin(adminData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img
                src={admin.image !== 'NA' ? `${IMAGE_PATH}/${admin.image}` : placeholder}
                className="img-radius wid-40 "
                style={{ height: '40px', objectFit: 'cover' }}
                alt="User Profile"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img
                  src={admin.image !== 'NA' ? `${IMAGE_PATH}/${admin.image}` : placeholder}
                  className="img-radius"
                  alt="User Profile"
                  style={{ height: '40px', objectFit: 'cover' }}
                />
                <span>{admin.name}</span>
                <Link to="#" className="dud-logout" title="Logout">
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to={APP_PREFIX_PATH + '/profile'} className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>

                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to={APP_PREFIX_PATH + '/signin'} className="dropdown-item">
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
