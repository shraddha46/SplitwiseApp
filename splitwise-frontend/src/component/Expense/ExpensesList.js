import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
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
    const [paidUser, setPaidUser] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllExpensesData = async () => {
            try {
                const allExpensesData = await dispatch(getAllExpensesAction());
                setAllExpensesList(allExpensesData);
                setError(null);
            } catch (error) {
                setError("Failed to load expenses. Please try again.");
            }
        };

        getAllExpensesData();
    }, [dispatch]);

    useEffect(() => {
        const paidUserList = [];
        allExpensesList.map((expense) => {
            var expenseDetail = expense.expenseDetail.filter(detail => detail.paidBy > 0)[0];
            paidUserList.push(expenseDetail?.userName || expenseDetail?.tempUserName);
        })
        setPaidUser(paidUserList);
    },[allExpensesList]);

    return (
        <Box>
            {error && <Alert severity="error">{error}</Alert>}
            {console.log("paid list",paidUser)}
            <List dense={false}>
                {allExpensesList.length > 0 ? (
                    allExpensesList.map((expense, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{ padding: '12px' }} secondaryAction={
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'end' }}>
                                    <AmountLabel variant="body1">₹{expense.amount}</AmountLabel>
                                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                        {
                                            expense.expenseDetail.map(detail => <Avatar sx={{ width: '28px', height: '28px', fontSize: '16px', fontWeight: 600, ml: 0.5 }}>{detail.userName?.[0] || detail.tempUserName?.[0]}</Avatar> )
                                        }
                                    </Typography>
                                </Box>
                            }>
                                <ListItemAvatar>
                                    <Avatar sx={{ fontSize: '18px', fontWeight: 600, padding: '2px' }}>
                                        {paidUser[index]?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant="body1">{expense.description}</Typography>
                                    <Typography variant="body2" color="text.secondary">{expense?.date ? format(new Date(expense.date), 'MMMM dd,yyyy h:mm a') : format(new Date(), 'MMMM dd,yyyy h:mm a')}</Typography>
                                    <Typography variant="body2" color="text.secondary"><b>{paidUser[0]}</b> paid for</Typography>
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