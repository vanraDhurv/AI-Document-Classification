import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../services/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0c0c1e 0%, #1a0f2e 25%, #0f1419 75%, #000000 100%)',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 107, 157, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper 
            elevation={0} 
            sx={{ 
              padding: 6, 
              width: '100%',
              background: 'rgba(20, 25, 35, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(255, 107, 157, 0.3)) 1',
              borderRadius: '24px',
              boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 212, 255, 0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(255, 107, 157, 0.05))',
                borderRadius: '24px',
                pointerEvents: 'none'
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
              <Typography 
                component="h1" 
                variant="h3" 
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #00d4ff 0%, #ff6b9d 50%, #ffd700 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                  letterSpacing: '-0.02em',
                  filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.3))',
                  fontSize: { xs: '2rem', sm: '2.5rem' }
                }}
              >
                DocuManager
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400,
                  fontSize: '1.1rem'
                }}
              >
                Sign In to Continue
              </Typography>
            </Box>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mt: 2, 
                  mb: 3,
                  background: 'rgba(244, 67, 54, 0.1)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  '& .MuiAlert-icon': {
                    color: '#ff6b6b'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, position: 'relative', zIndex: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={credentials.username}
                onChange={handleChange}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    height: '60px',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.5)',
                      boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4ff',
                      boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)'
                    },
                    '& input': {
                      color: '#ffffff',
                      fontSize: '1rem'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1rem',
                    '&.Mui-focused': {
                      color: '#00d4ff',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    height: '60px',
                    fontSize: '1rem',
                    backdropFilter: 'blur(10px)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 212, 255, 0.5)',
                      boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00d4ff',
                      boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)'
                    },
                    '& input': {
                      color: '#ffffff',
                      fontSize: '1rem'
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: '1rem',
                    '&.Mui-focused': {
                      color: '#00d4ff',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 4, 
                  mb: 3,
                  py: 2,
                  borderRadius: '16px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
                  letterSpacing: '0.02em',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00e6ff 0%, #00b3e6 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 48px rgba(0, 212, 255, 0.5), 0 0 60px rgba(0, 212, 255, 0.3)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    boxShadow: 'none'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Box>

            <Box 
              sx={{ 
                mt: 4,
                p: 4,
                background: 'rgba(0, 212, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(0, 212, 255, 0.2)',
                boxShadow: '0 0 30px rgba(0, 212, 255, 0.1)',
                position: 'relative',
                zIndex: 1
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#00d4ff',
                  fontWeight: 700,
                  mb: 3,
                  textAlign: 'center',
                  fontSize: '1rem',
                  letterSpacing: '0.02em'
                }}
              >
                Demo Accounts
              </Typography>
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                  <strong style={{ color: '#ff6b9d', fontWeight: 700 }}>Admin:</strong> admin / admin123
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                  <strong style={{ color: '#ff6b9d', fontWeight: 700 }}>HR:</strong> hr / hr123
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>
                  <strong style={{ color: '#ff6b9d', fontWeight: 700 }}>Finance:</strong> finance / finance123
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;