import { React, useEffect, useState } from 'react';
import { Card, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { Breadcrumb } from 'react-bootstrap';
import { Url } from '../../config/constant';
import Chart from 'react-apexcharts';
import axios from 'axios';

const AnalyticsReport = () => {
  const [analyticsData, setAnalyticsData] = useState({
    monthly: { labels: [], data: [] },
    yearly: [],
    demographics: [],
    loading: true,
    error: null
  });

  const currentYear = new Date().getFullYear();

  const fetchAnalytics = async () => {
    try {
      const [monthlyRes, yearlyRes, demographicsRes] = await Promise.all([
        axios.get(`${Url}/api/analytics/monthly`),
        axios.get(`${Url}/api/analytics/yearly`),
        axios.get(`${Url}/api/analytics/demographics`)
      ]);

      setAnalyticsData({
        monthly: {
          labels: monthlyRes.data.labels,
          data: monthlyRes.data.data.map((item) => item.total)
        },
        yearly: yearlyRes.data,
        demographics: demographicsRes.data,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData((prev) => ({
        ...prev,
        loading: false,
        error: 'Failed to load analytics data. Please try again later.'
      }));
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Monthly chart configuration
  const monthlyChart = {
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      xaxis: {
        categories: analyticsData.monthly.labels,
        title: { text: 'Months' }
      },
      yaxis: { title: { text: 'Customers' } },
      colors: ['#3f51b5'],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          columnWidth: '70%',
          distributed: false
        }
      }
    },
    series: [
      {
        name: 'Monthly Customers',
        data: analyticsData.monthly.data
      }
    ]
  };

  // Yearly chart configuration
  const yearlyChart = {
    options: {
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false }
      },
      xaxis: {
        categories: analyticsData.yearly.map((item) => item.year),
        title: { text: 'Years' }
      },
      yaxis: { title: { text: 'Customers' } },
      colors: ['#e91e63'],
      stroke: { curve: 'smooth' }
    },
    series: [
      {
        name: 'Yearly Customers',
        data: analyticsData.yearly.map((item) => item.total)
      }
    ]
  };

  // Demographics chart configuration
  const demographicsChart = {
    options: {
      labels: analyticsData.demographics.map((item) => `+${item.countryCode}`),
      colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'],
      legend: { position: 'bottom' }
    },
    series: analyticsData.demographics.map((item) => item.count)
  };

  if (analyticsData.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
        <Typography variant="body1" style={{ marginLeft: '16px' }}>
          Loading Analytics...
        </Typography>
      </div>
    );
  }

  if (analyticsData.error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert severity="error" style={{ marginBottom: '20px' }}>
          {analyticsData.error}
        </Alert>
        <button
          onClick={fetchAnalytics}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

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
        {currentYear} Monthly Customer Analytics
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Chart options={monthlyChart.options} series={monthlyChart.series} type="bar" height={350} />
            <Typography variant="subtitle2" align="center" mt={1}>
              Monthly Customer Signups
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, height: '100%' }}>
            <Chart options={demographicsChart.options} series={demographicsChart.series} type="donut" height={300} />
            <Typography variant="subtitle2" align="center" mt={1}>
              Country Code Distribution
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography style={{ margin: '40px auto 30px', color: '#000' }} variant="h6" align="center" gutterBottom>
            Yearly Customer Growth
          </Typography>
          <Card sx={{ p: 2 }}>
            <Chart options={yearlyChart.options} series={yearlyChart.series} type="line" height={350} />
            <Typography variant="subtitle2" align="center" mt={1}>
              Customer Growth Over Years
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Statistics Section */}
      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Customers</Typography>
            <Typography variant="h4" color="primary">
              {analyticsData.yearly.reduce((sum, year) => sum + year.total, 0)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Customers</Typography>
            <Typography variant="h4" color="success.main">
              {analyticsData.yearly.reduce((sum, year) => sum + year.active, 0)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Current Month Signups</Typography>
            <Typography variant="h4" color="secondary.main">
              {analyticsData.monthly.data[new Date().getMonth()] || 0}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default AnalyticsReport;
