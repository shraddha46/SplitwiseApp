import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpensesList from './ExpensesList';
import DebtsList from './DebtsList';
import { getOwnBalanceAction } from '../../action/user';

const CustomTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.orange
}));
const CustomOweText = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.orange
}));
const CustomOwedText = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main
}));

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

const AllExpenses = () => {
    const [value, setValue] = React.useState(0);
    const [ownBalance, setOwnBalance] = useState({netOwed: 0});
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balance = await dispatch(getOwnBalanceAction());
                if (balance.length > 0) {
                    setOwnBalance(balance[0]);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchBalance();
    }, [value]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <Box sx={{ width: '80%', boxShadow: 3 }}>
                <AppBar position="static">
                    <CustomTabs value={value} onChange={handleChange} aria-label="simple tabs example" textColor="inherit"
                        sx={{
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FFF',
                                height: '3px'
                            }
                        }}
                    >
                        <Tab
                            label="Expenses"
                            sx={{
                                bgcolor: value === 0 ? '#f77e84' : '#F54B55',
                                color: '#FFF',
                                opacity: 'inherit',
                                '&:hover': {
                                    bgcolor: value === 0 ? '#fc949a' : '#F54B55',
                                }
                            }}
                        />
                        <Tab
                            label="Debts"
                            sx={{
                                bgcolor: value === 1 ? '#f77e84' : '#F54B55',
                                color: '#FFF',
                                opacity: 'inherit',
                                '&:hover': {
                                    bgcolor: value === 1 ? '#fc949a' : '#F54B55',
                                }
                            }}
                        />
                    </CustomTabs>
                </AppBar>
                <TabPanel value={value} index={0}>
                    <ExpensesList />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <DebtsList />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Content for Tab Three
                </TabPanel>
            </Box>
            <Box sx={{ width: '20%', ml: '20px', p: 2, boxShadow: 3, height: 'fit-content' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 18, fontWeight: 600, color: '#a39999' }}>
                    YOUR TOTAL BALANCE
                </Typography>
                {
                    ownBalance?.netOwed < 0 ?
                        (
                            <>
                                <CustomOweText variant="body2" color="text.secondary" sx={{ pt: 1.3, fontSize: '18px' }}>
                                    you owe
                                </CustomOweText>
                                <CustomOweText variant="body2" color="text.secondary" sx={{ fontSize: 24, fontWeight: 600 }}>
                                    {`$${Math.abs(ownBalance.netOwed)}`}
                                </CustomOweText>

                            </>
                        ) : (
                            <>
                                <CustomOwedText variant="body2" color="text.secondary" sx={{ pt: 1.3, fontSize: '18px' }}>
                                    you are owed
                                </CustomOwedText>
                                <CustomOwedText variant="body2" color="text.secondary" sx={{ fontSize: 24, fontWeight: 600 }}>
                                    {`$${ownBalance.netOwed}`}
                                </CustomOwedText>
                            </>
                        )
                }
            </Box>
        </div>
    )
}

export default AllExpenses;