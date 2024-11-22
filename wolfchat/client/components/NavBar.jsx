import React from 'react';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    Typography
} from '@mui/material';
import {
    Home as HomeIcon,
    Create as CreateIcon,
    Settings as SettingsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

const NavBar = () => {
    const handleLogout = async () => {
        const response = await fetch('/logout', { method: 'POST' });
        if (response.ok) {
            window.location.href = '/';
        }
    };

    return (
        <AppBar position="fixed" sx={{ bgcolor: '#4a4a4a' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
                    🐺 WolfChat
                </Typography>
                <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                    <Button
                        color="inherit"
                        startIcon={<HomeIcon />}
                        onClick={() => window.location.href = '/feed'}
                    >
                        Feed
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<CreateIcon />}
                        onClick={() => window.location.href = '/howls'}
                    >
                        Howl
                    </Button>
                    <Button
                        color="inherit"
                        startIcon={<SettingsIcon />}
                        onClick={() => window.location.href = '/settings'}
                    >
                        Settings
                    </Button>
                </Box>
                <Button
                    color="inherit"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;