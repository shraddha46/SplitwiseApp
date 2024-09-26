import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Button, IconButton, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import splitwiseLogo from '../../Images/splitwise-logo.svg';
import userLogo from '../../Images/user-logo.png';
import { getToken } from '../../auth';
import { useUser } from '../../UserContext';

const Logo = styled('img')(({ theme }) => ({
  height: 48,
  marginRight: theme.spacing(2),
}));

const OutlineBtnStyle = styled(Button)(({ theme }) => ({
  marginLeft: 'auto',
  fontSize: '15px',
  lineHeight: '15px',
  textTransform: 'none',
  color: theme.palette.secondary.main,
  padding: "13px 17px"
}));

const FillBtnStyle = styled(OutlineBtnStyle)(({ theme }) => ({
  marginLeft: 16,
  backgroundColor: theme.palette.secondary.main,
  color: '#FFF'
}));

const Header = () => {
  const { data } = useSelector(state => state.loginState);
  const { error } = useUser();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      if (error.message === "jwt expired") {
        localStorage.removeItem('splitwiseToken')
      }
    }
  }, [error]);

  const renderAuthButtons = (path) => (
    <>
      {path === "/login" ? (
        <FillBtnStyle variant="contained">
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Sign in</Link>
        </FillBtnStyle>
      ) : (
        <OutlineBtnStyle>
          <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Sign in</Link>
        </OutlineBtnStyle>
      )}
      {path === "/signup" ? (
        <FillBtnStyle variant="contained">
          <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Sign up</Link>
        </FillBtnStyle>
      ) : (
        <OutlineBtnStyle>
          <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Sign up</Link>
        </OutlineBtnStyle>
      )}
    </>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Logo src={splitwiseLogo} alt="SplitWise" />
          {
            ((data && !data.token) || !getToken()) ?
              <div>
                {renderAuthButtons(location.pathname)}
              </div> :
              <IconButton edge="end" color="inherit" style={{ padding: 0 }}>
                <Avatar alt="Profile" src={userLogo} style={{ width: '50px', height: '50px' }} />
              </IconButton>
          }
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;