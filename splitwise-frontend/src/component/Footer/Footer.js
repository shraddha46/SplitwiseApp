import React from 'react';
import { Box, Toolbar } from '@mui/material';
import FooterImg from '../../Images/footer-hill.svg';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ flexGrow: 1, bgcolor: 'background.default' }}
    >
      <Toolbar />
      <img
        src={FooterImg}
        alt=""
        style={{ width: '100%' }}
      />
    </Box>
  )
}

export default Footer;