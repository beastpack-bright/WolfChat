import React, { useState } from 'react';
import { 
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Modal,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        window.location.href = '/feed';
      } else {
        setShowError(true);
      }
    } catch (err) {
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🐺 WolfChat
          </Typography>
          <Typography variant="h5" align="center" gutterBottom>
            Login to Start Howling
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  type="submit"
                  sx={{ 
                    backgroundColor: '#4a4a4a',
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                    }
                  }}
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={() => window.location.href = '/signup'}
                  sx={{ 
                    backgroundColor: '#4a4a4a',
                    '&:hover': {
                      backgroundColor: '#2a2a2a',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      <Modal
        open={showError}
        onClose={() => setShowError(false)}
        aria-labelledby="error-modal"
      >
        <Box sx={modalStyle}>
          <IconButton 
            sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            onClick={() => setShowError(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2">
            Username or Password is Incorrect
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};

export default LoginForm;