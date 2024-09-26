import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Box,
} from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import BallotIcon from '@mui/icons-material/Ballot';

const drawerWidth = 240;

const DrawerLayout = ({ children }) => {

    const location = useLocation();

    const MenuList = [
        {
            title: 'Dashboard',
            path: '/dashboard',
            icon: <SpaceDashboardIcon />
        },
        {
            title: 'All Expenses',
            path: '/all-expenses',
            icon: <BallotIcon />
        }
    ]

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', flex: 1, marginTop: '64px' }}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            marginTop: '70px',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                    open={true}
                >
                    <Box sx={{ overflow: 'auto', pt: 6 }}>
                        <List>
                            {MenuList.map((item, index) => (
                                <ListItem
                                    button
                                    key={index}
                                    component={Link}
                                    to={item.path}
                                    sx={{
                                        color: '#000',
                                        backgroundColor: location.pathname === item.path ? '#dbd5d5' : '#FFF',
                                        '&:hover': {
                                            backgroundColor: location.pathname === item.path ? '#dbd5d5' : '#e8e8e8'
                                        }
                                    }}
                                >
                                    <ListItemIcon style={{ minWidth: '38px' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.title} />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DrawerLayout;