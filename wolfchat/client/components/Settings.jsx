import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Avatar,
    Divider
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Wheel } from '@uiw/react-color';

const Settings = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#4a4a4a');

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/user');
            if (response.ok) {
                const user = await response.json();
                setCurrentAvatar(user.avatar);
                setPreviewUrl(user.avatar);
                setBackgroundColor(user.avatarColor || '#4a4a4a');
            }
        };
        fetchUser();
    }, []);

    const handleColorChange = async (color) => {
        const newColor = color.hex;
        setBackgroundColor(newColor);
        const response = await fetch('/api/settings/avatar-color', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ color: newColor })
        });
        if (response.ok) {
            window.location.reload();
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setAvatar(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!avatar) return;
        const formData = new FormData();
        formData.append('avatar', avatar);
        const response = await fetch('/api/settings/avatar', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            window.location.reload();
        }
    };

    const handleResetAvatar = async () => {
        const response = await fetch('/api/settings/reset-avatar', {
            method: 'POST'
        });

        if (response.ok) {
            setCurrentAvatar(null);
            setPreviewUrl(null);
            setBackgroundColor('#4a4a4a');
            window.location.reload();
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Profile Settings
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
                        <Box>
                            <Box sx={{ mb: 4, textAlign: 'center', width: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Avatar Background Color
                                </Typography>
                                <Avatar
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        bgcolor: backgroundColor,
                                        margin: '0 auto'
                                    }}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                    <Wheel
                                        color={backgroundColor}
                                        onChange={(color) => handleColorChange({ hex: color.hex })}
                                        style={{ width: '200px' }}
                                        hsv="true"
                                    />
                                </Box>
                            </Box>

                            <Divider sx={{ width: '100%', my: 4 }} />

                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Custom Avatar Image
                                </Typography>
                                <Avatar
                                    src={previewUrl}
                                    sx={{
                                        width: 100,
                                        height: 100,
                                        mb: 2,
                                        bgcolor: backgroundColor,
                                        margin: '0 auto'
                                    }}
                                />
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleFileSelect}
                                />
                                <label htmlFor="avatar-upload">
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            backgroundColor: '#4a4a4a',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            }
                                        }}
                                    >
                                        Choose Avatar
                                    </Button>
                                </label>
                                {avatar && (
                                    <Button
                                        onClick={handleUpload}
                                        sx={{
                                            mt: 2,
                                            ml: 2,
                                            backgroundColor: '#4a4a4a',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            }
                                        }}
                                    >
                                        Upload Avatar
                                    </Button>
                                )}
                            </Box>

                            <Box sx={{ textAlign: 'center', width: '100%' }}>
                                <Button
                                    onClick={handleResetAvatar}
                                    sx={{
                                        mt: 3,
                                        backgroundColor: '#4a4a4a',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a'
                                        }
                                    }}
                                >
                                    Reset to Default
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default Settings;