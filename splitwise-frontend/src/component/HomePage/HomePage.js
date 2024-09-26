import React from 'react';
import {Typography, Button, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';
import Banner from '../../Images/banner1.png';
import Footer from '../Footer/Footer';
import HouseMatesImg from '../../Images/house-mates.svg';

const BannerContainer = styled(Paper)(({ theme }) => ({
  backgroundImage: `url(${Banner})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '700px',
  color: theme.palette.secondary.main,
  textAlign: 'center',
  padding: theme.spacing(10),
  position: 'relative',
  boxShadow: 'none',
  display: 'flex',
}));

const BannerText = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(4),
  paddingTop: '80px',
  textAlign: 'left'
}));

const BannerImage = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundImage: `url(${HouseMatesImg})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '60%',
  width: '60%%',
  maxWidth: '500px',
}));

const BannerBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#8656CD',
}));

const HomePage = () => {
  return (
    <>
      {/* Banner Section */}
      <BannerContainer>
        <BannerText>
          <Typography variant="h2" component="h1" >
            <span style={{ color: '#000', fontWeight: 500 }}>Welcome</span> 
            <span style={{ color: '#8656CD', fontWeight: 500 }}> to Splitwise</span>
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom style={{ marginTop: '16px', color: '#000', fontWeight: 400 }}>
            Simplify your group expenses and manage your shared bills easily.
          </Typography>
          <BannerBtn variant="contained" size="large" href="/signup" style={{ color: '#FFF', marginTop: '30px' }}>
            Sign Up
          </BannerBtn>
        </BannerText>
        <BannerImage />
      </BannerContainer>
    <Footer />
    </>
  );
};

export default HomePage;