import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, Divider, Box, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getAllExpensesAction } from '../../action/expense';

const AmountLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.orange,
    fontWeight: 600,
    fontSize: '17px'
}));

const AllExpenses = () => {
    const dispatch = useDispatch();
    const [allExpensesList, setAllExpensesList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllExpensesData = async () => {
            try {
                const allExpensesData = await dispatch(getAllExpensesAction());
                setAllExpensesList(allExpensesData);
                setError(null); // Clear any previous errors
            } catch (error) {
                setError("Failed to load expenses. Please try again."); // Set error message
            }
        };

        getAllExpensesData();
    }, [dispatch]);

    return (
        <Box>
            {error && <Alert severity="error">{error}</Alert>} {/* Display error message if there's an error */}
            <List dense={false}>
                {allExpensesList.length > 0 ? (
                    allExpensesList.map((expense, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{ padding: '12px' }} secondaryAction={
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <AmountLabel variant="body1">₹{expense.amount}</AmountLabel>
                                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ width: '28px', height: '28px', fontSize: '16px', fontWeight: 600 }}>a</Avatar>
                                        <Avatar sx={{ width: '28px', height: '28px', fontSize: '16px', fontWeight: 600, ml: '4px' }}>b</Avatar>
                                    </Typography>
                                </Box>
                            }>
                                <ListItemAvatar>
                                    <Avatar sx={{ fontSize: '18px', fontWeight: 600, padding: '2px' }}>
                                        {expense.paidByUser[0]}
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body1">{expense.description}</Typography>
                                    <Typography variant="body2" color="text.secondary">{expense?.date ? expense.date : new Date().toLocaleString()}</Typography>
                                    <Typography variant="body2" color="text.secondary"><b>{expense.paidByUser}</b> paid for</Typography>
                                </Box>
                            </ListItem>
                            <Divider />
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ padding: '12px' }}>
                        No expenses found.
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default AllExpenses;