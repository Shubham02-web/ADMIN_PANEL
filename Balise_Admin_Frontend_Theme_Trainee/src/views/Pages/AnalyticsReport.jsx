import { React, useEffect, useState } from 'react';

// material-ui
import { Card, Grid, Typography } from '@mui/material';
import { Breadcrumb } from 'react-bootstrap';
import { Url } from '../../config/constant';
// project import

// import { gridSpacing } from 'config.js';
import Chart from 'react-apexcharts';
import axios from 'axios';

// ==============================|| SAMPLE PAGE ||============================== //

const AnalyticsReport = () => {
  const [monthlyDetails, setmonthlyDetails] = useState([]);
   const [yearlyDetails, setyearlyDetails] = useState([]);
  const fetchManageUserDetails = async () => {
    try {
      //    var data={action:"get_users_analytical_report"};
      const response = await axios.get(`${Url}/users_analytical_report?action=get_users_analytical_report`);
      const monDetail = response.data.data.month_report_arr;

       const yearDetail = response.data.data.year_report_arr;

      var newVariable = [];
      monDetail.forEach(function (obj) {
        newVariable.push(obj['month_user_arr']);
      });

         var newYearVariable = [];
      yearDetail.forEach(function (obj) {
        newYearVariable.push(obj['year_user_arr']);
      });

      setmonthlyDetails(newVariable);
      setyearlyDetails(newYearVariable);
    } catch (error) {
      console.error('Error fetching manage user details:', error);
    }
  };
  useEffect(() => {
    fetchManageUserDetails();
  }, []);

  const seriesmonthly = [
    {
      name: 'Total Users',
      data: monthlyDetails
    }
  ];
  const seriesyearly = [
    {
      name: 'Total Users',
      data: yearlyDetails
    }
  ];

  // Monthly chart configuration
  const monthly = {
    chart: {
      height: 350,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      colors: ['#204C91']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  // Yearly chart configuration
  const yearly = {
    chart: {
      height: 380,
      type: 'bar',
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['2020', '2021', '2022', '2023', '2024', '2025']
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },

    fill: {
      colors: ['#204C91']
    },
    legend: {
      show: false
    },
    colors: ['#000000']
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="#">
          <i className="feather icon-home" />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="#">Dashboard</Breadcrumb.Item>
        <Breadcrumb.Item active>Customers Analytical Report</Breadcrumb.Item>
      </Breadcrumb>

      <Typography
        className="d-flex justify-content-center"
        style={{ marginTop: '30px', marginBottom: '30px', color: '#000' }}
        variant="h6"
        gutterBottom
      >
        2024 Monthly Analytical Reports of Customers
      </Typography>

      <Grid container>
        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              {/* ApexCharts component */}
              <Chart options={monthly} series={seriesmonthly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>

        <Typography className="" style={{ margin: ' 40px auto 30px', color: '#000' }} variant="h6" gutterBottom>
          2024 Yearly Analytical Reports of Customers
        </Typography>

        <Grid item xs={12} md={12}>
          <Card sx={{ marginTop: '10px' }}>
            <div className="chart p-4">
              {/* ApexCharts component */}
              <Chart options={yearly} series={seriesyearly} type="bar" height={350} />
            </div>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default AnalyticsReport;
