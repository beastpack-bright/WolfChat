import React from 'react';
import { Box } from '@mui/material';
import NavBar from './NavBar';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <Box sx={{ paddingTop: '64px' }}>
                {children}
            </Box>
        </>
    );
};

export default Layout;