import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Avatar, 
    Typography, 
    Box, 
    TextField, 
    Button 
} from '@mui/material';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [blurb, setBlurb] = useState('');
    const [howlCount, setHowlCount] = useState(0);

    // Fetch profile data
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfile(data);
        setBlurb(data.blurb || '');
        setHowlCount(data.howlCount);
    };

    const handleSaveBlurb = async () => {
        await fetch('/api/profile/blurb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ blurb })
        });
        setIsEditing(false);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                {profile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar 
                            src={profile.avatar} 
                            sx={{ width: 100, height: 100, bgcolor: profile.avatarColor }} 
                        />
                        <Typography variant="h4" sx={{ mt: 2 }}>
                            {profile.username}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            Howls: {howlCount}
                        </Typography>
                        
                        {isEditing ? (
                            <Box sx={{ mt: 2, width: '100%' }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={blurb}
                                    onChange={(e) => setBlurb(e.target.value)}
                                />
                                <Button 
                                    onClick={handleSaveBlurb}
                                    sx={{ mt: 2 }}
                                >
                                    Save
                                </Button>
                            </Box>
                        ) : (
                            <Box sx={{ mt: 2, width: '100%' }}>
                                <Typography variant="body1">
                                    {blurb || 'No blurb yet...'}
                                </Typography>
                                <Button 
                                    onClick={() => setIsEditing(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Edit Blurb
                                </Button>
                            </Box>
                        )}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Profile;