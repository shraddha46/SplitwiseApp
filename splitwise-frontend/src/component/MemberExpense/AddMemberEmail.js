import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const OutlineBtn = styled(Button)(({ theme }) => ({
    marginLeft: 'auto',
    fontSize: '15px',
    lineHeight: '15px',
    textTransform: 'none',
    color: theme.palette.secondary.orange,
    border: `1px solid ${theme.palette.secondary.orange}`,
    padding: "12px"
}));

const FillBtn = styled(OutlineBtn)(({ theme }) => ({
    marginLeft: 16,
    backgroundColor: theme.palette.secondary.orange,
    color: '#FFF'
}));

const AddMemberEmail = ({ modelData, submitMemberEmailData, cancelMemberEmailModel }) => {
    const { isOpen, memberName } = modelData;
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setEmail('');
            setError('');
        }
    }, [isOpen]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setError("");
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const addMemberEmail = () => {
        if (!validateEmail(email)) {
            setError('Invalid email address');
        } else {
            submitMemberEmailData({ email, 'username': memberName });
        }
    }

    return (
        <Dialog open={isOpen} BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
        }}
            PaperProps={{
                style: {
                    padding: '8px 12px 4px 12px',
                },
            }}
        >
            <DialogTitle sx={{ p: 1 }}>
                Enter an email address for {memberName}
            </DialogTitle>
            <DialogContent sx={{ p: 1 }}>

                <TextField
                    required
                    fullWidth
                    id="email"
                    name="email"
                    variant='outlined'
                    size="small"
                    value={email}
                    onChange={handleEmailChange}
                    error={Boolean(error)}
                    helperText={error}
                />
            </DialogContent>
            <DialogActions>
                <OutlineBtn onClick={cancelMemberEmailModel}>
                    Cancel
                </OutlineBtn>
                <FillBtn variant="contained" onClick={addMemberEmail}>
                    OK
                </FillBtn>
            </DialogActions>
        </Dialog>
    )
}

export default AddMemberEmail;