import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import SuccessMark from '../Images/success-mark.svg';

const SuccessWrap = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    padding: theme.spacing(3),
    borderRadius: 8,
    boxShadow: theme.shadows[5],
}));
const OkBtn = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.orange,
    fontWeight: 600,
    fontSize: '16px',
    padding: '4px'
}));
const modelStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    outline: 'none',
};

const SuccessModal = ({ title, open, handleClose }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modelStyle}>
                <SuccessWrap>
                    <img alt="" src={SuccessMark} style={{ width: '30%', height: '30%', marginTop: '4px' }} />
                    <Typography variant="h5" component="h2" sx={{ pt: 3, fontWeight: 500 }}>
                        {title}
                    </Typography>
                    <OkBtn onClick={handleClose} variant="contained" sx={{ mt: 5 }}>
                        OK
                    </OkBtn>
                </SuccessWrap>
            </Box>
        </Modal>
    );
};

export default SuccessModal;