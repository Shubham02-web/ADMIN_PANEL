import React from 'react';

// react-bootstrap
import { Row, Col, Card, Table } from 'react-bootstrap';

// third party
// import Chart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Breadcrumb } from 'react-bootstrap';

// project import
import OrderCard from '../../components/Widgets/Statistic/OrderCard';
// import SocialCard from '../../components/Widgets/Statistic/SocialCard';

// import uniqueVisitorChart from './chart/analytics-unique-visitor-chart';
// import customerChart from './chart/analytics-cuatomer-chart';
// import customerChart1 from './chart/analytics-cuatomer-chart-1';

// assets
// import avatar1 from '../../assets/images/user/avatar-1.jpg';
// import imgGrid1 from '../../assets/images/gallery-grid/img-grd-gal-1.jpg';
// import imgGrid2 from '../../assets/images/gallery-grid/img-grd-gal-2.jpg';
// import imgGrid3 from '../../assets/images/gallery-grid/img-grd-gal-3.jpg';

// ==============================|| DASHBOARD ANALYTICS ||============================== //

const DashAnalytics = () => {



  return (
    <React.Fragment>



      <Breadcrumb>
        <Breadcrumb.Item to="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item to="#">Dashboard</Breadcrumb.Item>

      </Breadcrumb>


      <Row>
        {/* order cards */}
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Orders Received',
              class: 'bg-c-blue',
              icon: 'feather icon-shopping-cart',
              primaryText: '486',
              secondaryText: 'Completed Orders',
              extraText: '351'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Total Sales',
              class: 'bg-c-green',
              icon: 'feather icon-tag',
              primaryText: '1641',
              secondaryText: 'This Month',
              extraText: '213'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Total Income',
              class: 'bg-c-yellow',
              icon: 'feather icon-repeat',
              primaryText: '$42,562',
              secondaryText: 'This Month',
              extraText: '$5,032'
            }}
          />
        </Col>
        <Col md={6} xl={3}>
          <OrderCard
            params={{
              title: 'Total Profit',
              class: 'bg-c-red',
              icon: 'feather icon-award',
              primaryText: '$9,562',
              secondaryText: 'This Month',
              extraText: '$542'
            }}
          />
        </Col>

       

      </Row>
    </React.Fragment>
  );
};

export default DashAnalytics;
