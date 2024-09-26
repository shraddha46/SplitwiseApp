import React from 'react';
import { Box, AppBar, Tabs, Tab, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpensesList from './ExpensesList';

const CustomTabs = styled(Tabs)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.orange
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
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
                    Content for Tab Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                    Content for Tab Three
                </TabPanel>
            </Box>
        </>
    )
}

export default AllExpenses;