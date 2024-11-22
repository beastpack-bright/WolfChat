import React, { useState, useEffect } from 'react';
import { 
    Container, 
    Paper, 
    Typography, 
    Box, 
    Button,
    TextField,
    Avatar,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Feed = () => {
    const [howls, setHowls] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const fetchHowls = async () => {
        const response = await fetch('/api/howls');
        const data = await response.json();
        setHowls(data);
    };

    useEffect(() => {
        fetchHowls();
    }, []);
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch('/api/user');
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data);
            }
        };
        fetchUser();
    }, []);
    const handleReply = async (howlId) => {
        const response = await fetch(`/api/howls/${howlId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: replyContent })
        });

        if (response.ok) {
            setReplyContent('');
            setReplyingTo(null);
            fetchHowls();
        }
    };

    const handleDeleteHowl = async (howlId) => {
        const response = await fetch(`/api/howls/${howlId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchHowls();
        }
    };

    const handleDeleteReply = async (howlId, replyId) => {
        const response = await fetch(`/api/howls/${howlId}/replies/${replyId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchHowls();
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                {howls.map(howl => (
                    <Paper 
                        key={howl._id} 
                        elevation={2} 
                        sx={{ 
                            p: 2, 
                            mb: 2,
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#4a4a4a', mr: 2 }}>
    {howl.author?.username ? howl.author.username[0].toUpperCase() : '?'}
</Avatar>
                                <Typography variant="h6">
                                    {howl.author.username}
                                </Typography>
                            </Box>
                            {currentUser && currentUser._id === howl.author._id && (
                                <IconButton 
                                    onClick={() => handleDeleteHowl(howl._id)}
                                    sx={{ color: '#4a4a4a' }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {howl.content}
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {new Date(howl.createdAt).toLocaleString()}
                        </Typography>

                        {howl.replies && howl.replies.map(reply => (
                            <Box sx={{ ml: 6, mt: 1 }} key={reply._id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar sx={{ bgcolor: '#4a4a4a', mr: 1, width: 24, height: 24, fontSize: '0.875rem' }}>
    {reply.author?.username ? reply.author.username[0].toUpperCase() : '?'}
</Avatar>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                            {reply.author.username}
                                        </Typography>
                                    </Box>
                                    {currentUser && currentUser._id === reply.author._id && (
                                        <IconButton 
                                            size="small"
                                            onClick={() => handleDeleteReply(howl._id, reply._id)}
                                            sx={{ color: '#4a4a4a' }}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ ml: 4 }}>
                                    {reply.content}
                                </Typography>
                                <Typography variant="caption" sx={{ ml: 4 }}>
                                    {new Date(reply.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        ))}

                        <Box sx={{ mt: 2 }}>
                            <Button 
                                size="small"
                                onClick={() => setReplyingTo(replyingTo === howl._id ? null : howl._id)}
                                sx={{ 
                                    color: '#4a4a4a',
                                    '&:hover': {
                                        backgroundColor: 'rgba(74, 74, 74, 0.04)'
                                    }
                                }}
                            >
                                {replyingTo === howl._id ? 'Cancel' : 'Reply'}
                            </Button>
                        </Box>

                        {replyingTo === howl._id && (
                            <Box sx={{ ml: 6, mt: 1 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    sx={{ backgroundColor: 'white' }}
                                />
                                <Button 
                                    onClick={() => handleReply(howl._id)}
                                    sx={{ 
                                        mt: 1,
                                        backgroundColor: '#4a4a4a',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a'
                                        }
                                    }}
                                >
                                    Send Reply
                                </Button>
                            </Box>
                        )}
                    </Paper>
                ))}
            </Box>
        </Container>
    );
};

export default Feed;