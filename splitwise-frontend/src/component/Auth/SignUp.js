import React, { useState, useEffect } from 'react';
import { Typography, Paper, Button, TextField, Card, CardContent, Container, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Footer from '../Footer/Footer';
import Banner from '../../Images/banner1.png';
import SplitwiseLogo from '../../Images/splitwise-main-logo.svg';
import '../../Css/global.css';

import { signupAction } from '../../action/auth';

const SignUpWrap = styled(Paper)(({ theme }) => ({
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

const SignUp = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error } = useSelector(state => state.signupState);
    const [signupData, setSignUpData] = useState({});
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const [signupError, setSignupError] = useState("");

    useEffect(() => {
        setSignupError(error);
    }, [error]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { username: '', email: '', password: '' };

        // Name validation
        if (!signupData.username) {
            newErrors.username = 'Name is required';
        }

        // Email validation
        if (!signupData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
            newErrors.email = 'Email address is invalid';
        }

        // Password validation
        if (!signupData.password) {
            newErrors.password = 'Password is required';
        } else if (signupData.password.length < 8) {
            newErrors.password = 'Password is too short (minimum is 8 characters)'
        } else if (signupData.password.length > 16) {
            newErrors.password = 'Password is too long (maximum is 16 characters)'
        }

        if (newErrors.username || newErrors.email || newErrors.password) {
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        try {
            if (validateForm()) {
                await dispatch(signupAction(signupData));
                navigate("/login");
            }
        } catch (error) {

        }
    };

    return (
        <>
            <SignUpWrap>
                <Container component="main" maxWidth="lg">
                    {signupError && <div className="text-left text-danger mb-2" style={{ backgroundColor: "#cf4a4a", color: '#FFF', padding: '4px 32px', marginBottom: '8px', maxWidth: '700px', width: '100%' }}><span>{signupError?.message || "Internal Server Error"}</span></div>}
                    <Card sx={{ p: 4, width: '100%', maxWidth: '700px', mx: 'auto' }}>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item xs={4}>
                                    <img
                                        src={SplitwiseLogo}
                                        alt="splitwise"
                                        style={{ width: '100%', height: 'auto', borderRadius: 4 }}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography variant="h6" style={{ color: '#999999', fontSize: '16px', textAlign: 'left' }}>INTRODUCE YOURSELF</Typography>
                                    <form>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Hi there! My name is"
                                            name="username"
                                            autoComplete="username"
                                            className="custom-textfield"
                                            value={signupData.username}
                                            onChange={(e) => setSignUpData({ ...signupData, username: e.target.value })}
                                            error={Boolean(errors.username)}
                                            helperText={errors.username}
                                        />
                                        {
                                            (signupData.username && signupData.username.length > 0) && <>
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    name="email"
                                                    label="Here's my email address"
                                                    type="email"
                                                    id="email"
                                                    autoComplete="email"
                                                    className="custom-textfield"
                                                    value={signupData.email}
                                                    onChange={(e) => setSignUpData({ ...signupData, email: e.target.value })}
                                                    error={Boolean(errors.email)}
                                                    helperText={errors.email}
                                                />
                                                <TextField
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    name="password"
                                                    label="Here's my password"
                                                    type="password"
                                                    id="password"
                                                    autoComplete="current-password"
                                                    className="custom-textfield"
                                                    value={signupData.password}
                                                    onChange={(e) => setSignUpData({ ...signupData, password: e.target.value })}
                                                    error={Boolean(errors.password)}
                                                    helperText={errors.password}
                                                />
                                            </>
                                        }
                                        <SignInButton
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 3 }}
                                            onClick={handleSubmit}
                                        >
                                            Sign me up!
                                        </SignInButton>
                                    </form>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Container>
            </SignUpWrap>
            <Footer />
        </>
    )
}

export default SignUp;