import React, { useState } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button, 
    Avatar 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Settings = () => {
    const [avatar, setAvatar] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

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
            // Avatar updated successfully
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
                        <Avatar
                            src={previewUrl}
                            sx={{ width: 100, height: 100, mb: 2 }}
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
                </Paper>
            </Box>
        </Container>
    );
};

export default Settings;

