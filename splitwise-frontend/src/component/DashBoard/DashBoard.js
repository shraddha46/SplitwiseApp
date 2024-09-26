import React, { useState } from 'react';
import { Typography, Button, Paper, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { useUser } from '../../UserContext';
import AddExpense from '../Expense/AddExpense';

const DashboardContainer = styled(Paper)(({ theme }) => ({
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const CustomBtn = styled(Button)(({ theme }) => ({
    fontSize: '18px',
    textTransform: 'none',
    color: '#FFF',
    backgroundColor: theme.palette.secondary.orange,
}));

const DashBoard = () => {

    const [isOpenExpanseModel, setIsOpenExpanseModel] = useState(false);
    const { loading } = useUser();

    const openExpenseModel = () => {
        setIsOpenExpanseModel(true);
    }

    if (loading) return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh'
            }}
        >
            <CircularProgress />
        </Box>
    );

    return (
        <Box component="main" sx={{ width: '100%', pl: 4, pb: 8, height: '100%', display: 'flex', alignItems: 'center' }}>
            <DashboardContainer>
                <Box sx={{ pb: 0 }}>
                    <Typography variant="h2" component="h2" style={{ fontWeight: 500 }}>
                        <span style={{ color: '#000' }}>Welcome </span><span>to Splitwise!</span>
                    </Typography>
                    <Typography component="p" style={{ color: '#000', fontSize: '18px', paddingTop: '12px', fontWeight: 500 }}>
                        Splitwise helps you split bills with friends.
                    </Typography>
                    <Typography component="p" style={{ fontSize: '18px', paddingTop: '12px', fontWeight: 500 }}>
                        <span style={{ color: '#000' }}>Click </span>
                        “Add an expense”<span style={{ color: '#000' }}> to get started, or click </span>
                        "Add a group"<span style={{ color: '#000' }}> to simplify your group expenses!</span>
                    </Typography>
                </Box>
                <Box style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: '40px' }}>
                    <CustomBtn variant="contained" onClick={openExpenseModel} >
                        Add an expense
                    </CustomBtn>
                    <CustomBtn variant="contained">
                        Add a group
                    </CustomBtn>
                </Box>
            </DashboardContainer>
            <AddExpense open={isOpenExpanseModel} closeExpenseModel={() => setIsOpenExpanseModel(false)} />
        </Box>
    );
};

export default DashBoard;