import React, { useState, useMemo, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import { Card } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';
import { Url } from '../../config/constant';
import { Modal } from 'react-bootstrap';

const ManageContent = () => {
  const options = [
    'bold',
    'italic',
    '|',
    'ul',
    'ol',
    '|',
    'font',
    'fontsize',
    '|',
    'outdent',
    'indent',
    'align',
    '|',
    'hr',
    '|',
    'fullsize',
    'brush',
    '|',
    'table',
    'link',
    '|',
    'undo',
    'redo'
  ];
  //   const [content, setContent] = useState(0);
  const [key, setKey] = useState('about');
  const [about, setAbout] = useState('');
  const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [android, setAndroid] = useState('');
  const [ios, setIos] = useState('');

  // const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [emptycontent, setEmptyContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const contentTypes = {
    'about us': 0,
    'privacy policy': 1,
    'terms and condition': 2,
    'android app url': 4,
    'ios app url': 3
  };

  //   console.log('setContent', setContent);
  //   console.log('emptycontent', emptycontent);

  useEffect(() => {
    console.log('key', key);
    switch (key) {
      case 'about':
        fetchContent('about us', setAbout);
        break;
      case 'terms':
        fetchContent('terms and condition', setTerms);
        break;
      case 'privacy':
        fetchContent('privacy policy', setPrivacy);
        break;
      case 'android':
        fetchContent('android app url', setAndroid);
        break;
      case 'ios':
        fetchContent('ios app url', setIos);
        break;
      default:
        break;
    }
  }, [key]);

  const fetchContent = (contentType, setter) => {
    axios
      .get(`${Url}/api/get_content?content_type=${encodeURIComponent(contentType)}`)
      .then((response) => {
        console.log('API response:', response.data);
        if (response.data.data[0].content) {
          setter(response.data.data[0].content); // Access the correct content property
        } else {
          console.error('No content found for', contentType);
          setter('');
        }
      })
      .catch((error) => {
        console.error('Error fetching content for', contentType, error);
        setter('');
      });
  };

  const config1 = useMemo(
    () => ({
      readonly: false,
      placeholder: '',
      defaultActionOnPaste: 'insert_as_html',
      defaultLineHeight: 1.2,
      enter: 'div',
      buttons: options,
      buttonsMD: options,
      buttonsSM: options,
      buttonsXS: options,
      statusbar: false,
      sizeLG: 900,
      sizeMD: 700,
      sizeSM: 400,
      toolbarAdaptive: false
    }),
    []
  );

  //     const handleButtonClick = (contentType) => {
  //     setContent(contentTypes[contentType]);
  //   };

  const handleBanner = (contentType) => {
    let contentStateToUpdate;
    switch (contentType) {
      case 'about us':
        contentStateToUpdate = about;
        break;
      case 'privacy policy':
        contentStateToUpdate = privacy;
        break;
      case 'terms and condition':
        contentStateToUpdate = terms;
        break;
      case 'android app url':
        contentStateToUpdate = android;
        break;
      case 'ios app url':
        contentStateToUpdate = ios;
        break;
      default:
        console.error('Unknown content type:', contentType);
        return;
    }
    if (!contentStateToUpdate.trim()) {
      setEmptyContent('This field could not be empty');
      // alert(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content cannot be empty`);
      return;
    }

    console.log(contentStateToUpdate, 'new', contentTypes[contentType]);

    axios
      .post(Url + '/api/update_content', {
        contentType: contentTypes[contentType],
        content: contentStateToUpdate
      })
      .then(() => {
        console.log(`${contentType} updated successfully`);
        setToastMessage(`${contentType} updated successfully`);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 2000);
        setEmptyContent('');
      })
      .catch((error) => {
        console.error('Error updating content:', error);
      });
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item to="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item to="#">Dashboard</Breadcrumb.Item>

        <Breadcrumb.Item to="#">Manage Content</Breadcrumb.Item>
      </Breadcrumb>
      <Card title="Manage Broadcast" className="p-3">
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => {
            console.log('k', k);
            setKey(k);
          }}
          className="mb-3"
          style={{ borderBottom: '0' }}
        >
          <Tab eventKey="about" title="About us">
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                About us
              </Typography>
              <JoditEditor
                value={about}
                config={config1}
                onChange={(htmlString) => {
                  setAbout(htmlString);
                  setEmptyContent('');
                }}
              />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <br />
              <button className="btn mt-2 btn-primary" onClick={() => handleBanner('about us')}>
                Update
              </button>
            </div>
          </Tab>
          <Tab eventKey="terms" title=" Terms & Conditions">
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Terms & Conditions
              </Typography>

              <JoditEditor
                value={terms}
                config={config1}
                onChange={(htmlString) => {
                  setTerms(htmlString);
                  setEmptyContent('');
                }}
              />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <br />
              <button className="btn mt-2 btn-primary" onClick={() => handleBanner('terms and condition')}>
                Update
              </button>
            </div>
          </Tab>
          <Tab eventKey="privacy" title=" Privacy Policy">
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Privacy Policy
              </Typography>
              <JoditEditor
                value={privacy}
                config={config1}
                onChange={(htmlString) => {
                  setPrivacy(htmlString);
                  setEmptyContent('');
                }}
              />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <br />

              <button className="btn mt-2 btn-primary" onClick={() => handleBanner('privacy policy')}>
                Update
              </button>
            </div>
          </Tab>
          <Tab eventKey="android" title="Android App URL">
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                Android App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={android}
                onChange={(e) => {
                  setAndroid(e.target.value);
                  setEmptyContent('');
                }}
                placeholder="Enter android app url"
              />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <br />
              <button className="btn mt-2 btn-primary" onClick={() => handleBanner('android app url')}>
                Update
              </button>
            </div>
          </Tab>
          <Tab eventKey="ios" title="IOS App URL">
            <div className="mt-4">
              <Typography variant="body1" gutterBottom>
                IOS App URL
              </Typography>
              <input
                type="text"
                className="form-control"
                value={ios}
                onChange={(e) => {
                  setIos(e.target.value);
                  setEmptyContent('');
                }}
                placeholder="Enter ios app url"
              />
              <p style={{ color: 'red' }}>{emptycontent}</p>
              <br />
              <button className="btn mt-2 btn-primary" onClick={() => handleBanner('ios app url')}>
                Update
              </button>
            </div>
          </Tab>
        </Tabs>
      </Card>

      {/* Toast Notification */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>{toastMessage}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
};

export default ManageContent;
