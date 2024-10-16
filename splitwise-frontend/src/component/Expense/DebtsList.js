import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { List, ListItem, ListItemAvatar, Avatar, Divider, Box, Typography, Alert, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PeopleIcon from '@mui/icons-material/People';
import { getAllDebtsAction } from '../../action/expense';

const AmountLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.orange,
    fontWeight: 600,
    fontSize: '15px'
}));

const AllDebts = () => {
    const dispatch = useDispatch();
    const [allDebtsList, setAllDebtsList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getAllDebtsData = async () => {
            try {
                const allDebtsData = await dispatch(getAllDebtsAction());
                setAllDebtsList(allDebtsData);
                setError(null);
            } catch (error) {
                setError("Failed to load debts. Please try again.");
            }
        };

        getAllDebtsData();
    }, [dispatch]);

    return (
        <Box>
            {error && <Alert severity="error">{error}</Alert>}
            <List dense={false}>
                {allDebtsList.length > 0 ? (
                    allDebtsList.map((debts, index) => (
                        <React.Fragment key={index}>
                            <ListItem sx={{ padding: '12px' }}>
                                <Grid container spacing={2} sx={{ margin: 0 }} >
                                    <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }} >
                                        <ListItemAvatar>
                                            <Avatar sx={{ fontSize: '18px', fontWeight: 600, p: '2px' }}>
                                                {debts.from?.userName?.[0] || <PeopleIcon />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                            <Typography variant="body1" sx={{ lineHeight: '19px' }}>{debts.from?.userName}</Typography>
                                            <AmountLabel>{`$${debts.balance}`}</AmountLabel>
                                        </Box>
                                    </Grid>
                                    <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h6" sx={{ lineHeight: 0 }}><ArrowForwardIcon /></Typography>
                                    </Grid>
                                    <Grid xs={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                            <Typography variant="body1" sx={{ lineHeight: '19px' }}>{debts.to?.userName}</Typography>
                                        </Box>
                                        <ListItemAvatar sx={{ pl: '12px', minWidth: 0 }}>
                                            <Avatar sx={{ fontSize: '18px', fontWeight: 600, padding: '2px' }}>
                                                {debts.to?.userName?.[0] || <PeopleIcon />}
                                            </Avatar>
                                        </ListItemAvatar>

                                    </Grid>
                                </Grid>
                            </ListItem>
                            {(allDebtsList.length - 1) !== index && <Divider />}
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ padding: '12px' }}>
                        No Debts found.
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default AllDebts;