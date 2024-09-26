import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Typography, Paper, Button, TextField, Card, CardContent, Container } from '@mui/material';
import { styled } from '@mui/system';
import Banner from '../../Images/banner1.png';
import '../../Css/global.css';
import Footer from '../Footer/Footer';
import { loginAction } from '../../action/auth';

const LoginWrap = styled(Paper)(({ theme }) => ({
    backgroundImage: `url(${Banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '700px',
    color: theme.palette.secondary.main,
    textAlign: 'center',
    //padding: theme.spacing(10),
    position: 'relative',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center'
}));

const SignInButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.main,
    padding: '0.5rem 0',
    fontSize: '16px',
    textTransform: 'none',
}));

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({});
    const { error } = useSelector(state => state.loginState);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState("");

    useEffect(() => {
        setLoginError(error);
    }, [error]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        // Email validation
        if (!loginData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        // Password validation
        if (!loginData.password) {
            newErrors.password = 'Password is required';
        } else if (loginData.password.length < 8) {
            newErrors.password = 'Password is too short (minimum is 8 characters)'
        } else if (loginData.password.length > 16) {
            newErrors.password = 'Password is too long (maximum is 16 characters)'
        }

        if (newErrors.email || newErrors.password) {
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                await dispatch(loginAction(loginData));
                navigate('/dashboard');
            }
        } catch (error) {

        }
    };

    return (
        <>
            <LoginWrap>
                <Container component="main" maxWidth="sm">
                    {loginError && <div className="text-left text-danger mb-2" style={{ backgroundColor: "#cf4a4a", color: '#FFF', padding: '4px 32px', marginBottom: '8px', maxWidth: '600px', width: '100%' }}><span>{loginError}</span></div>}
                    <Card sx={{ p: 4, width: '100%', maxWidth: '600px', mx: 'auto' }}>
                        <CardContent>
                            <Typography variant="h5" align="center" gutterBottom>
                                Sign In
                            </Typography>
                            <form>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    className="custom-textfield"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    className="custom-textfield"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    error={Boolean(errors.password)}
                                    helperText={errors.password}
                                />
                                <SignInButton
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 3 }}
                                    onClick={handleSubmit}
                                >
                                    Sign in
                                </SignInButton>
                            </form>
                        </CardContent>
                    </Card>
                </Container>
            </LoginWrap>
            <Footer />
        </>
    )
}

export default Login;