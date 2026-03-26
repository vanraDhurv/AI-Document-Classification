import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Search,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../services/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    handleClose();
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="static" 
      elevation={0} 
      sx={{ 
        background: 'rgba(20, 25, 35, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        borderImage: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3), rgba(255, 107, 157, 0.3)) 1',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ py: 1.5 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 0, 
            mr: 4,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00d4ff 0%, #ff6b9d 50%, #ffd700 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '1.6rem',
            letterSpacing: '-0.02em',
            filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.3))',
            '&:hover': {
              filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.5))',
            },
            transition: 'all 0.3s ease'
          }}
        >
          DocuManager
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
          <Button
            color={isActive('/dashboard') || isActive('/') ? 'primary' : 'inherit'}
            startIcon={<Dashboard />}
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontSize: '0.95rem',
              background: isActive('/dashboard') || isActive('/') 
                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))'
                : 'transparent',
              border: isActive('/dashboard') || isActive('/') 
                ? '1px solid rgba(0, 212, 255, 0.3)'
                : '1px solid transparent',
              boxShadow: isActive('/dashboard') || isActive('/') 
                ? '0 0 20px rgba(0, 212, 255, 0.2)'
                : 'none',
              color: isActive('/dashboard') || isActive('/') ? '#00d4ff' : 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 153, 204, 0.15))',
                border: '1px solid rgba(0, 212, 255, 0.4)',
                boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)',
                transform: 'translateY(-2px)',
                color: '#00d4ff'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Dashboard
          </Button>
          <Button
            color={isActive('/search') ? 'primary' : 'inherit'}
            startIcon={<Search />}
            onClick={() => handleNavigation('/search')}
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1.2,
              fontWeight: 600,
              fontSize: '0.95rem',
              background: isActive('/search') 
                ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 153, 204, 0.2))'
                : 'transparent',
              border: isActive('/search') 
                ? '1px solid rgba(0, 212, 255, 0.3)'
                : '1px solid transparent',
              boxShadow: isActive('/search') 
                ? '0 0 20px rgba(0, 212, 255, 0.2)'
                : 'none',
              color: isActive('/search') ? '#00d4ff' : 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 153, 204, 0.15))',
                border: '1px solid rgba(0, 212, 255, 0.4)',
                boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)',
                transform: 'translateY(-2px)',
                color: '#00d4ff'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Search
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={user?.role || 'User'}
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(197, 59, 107, 0.2))',
              color: '#ff6b9d',
              border: '1px solid rgba(255, 107, 157, 0.3)',
              fontWeight: 600,
              fontSize: '0.8rem',
              height: 28,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 15px rgba(255, 107, 157, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(197, 59, 107, 0.3))',
                boxShadow: '0 0 20px rgba(255, 107, 157, 0.3)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
            size="small"
          />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 500,
              fontSize: '0.9rem'
            }}
          >
            {user?.username}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 157, 0.15))',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                color: '#ffffff'
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                background: 'rgba(20, 25, 35, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                mt: 1,
                minWidth: 180,
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(0, 212, 255, 0.1)',
                '& .MuiMenuItem-root': {
                  color: 'rgba(255, 255, 255, 0.9)',
                  py: 1.5,
                  px: 2.5,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  margin: '4px 8px',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 157, 0.15))',
                    color: '#ffffff',
                    transform: 'translateX(4px)',
                    boxShadow: '0 0 15px rgba(0, 212, 255, 0.2)'
                  },
                  transition: 'all 0.3s ease'
                }
              }
            }}
          >
            <MenuItem onClick={() => {
              handleNavigation('/profile');
              handleClose();
            }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1.5, color: '#ff6b9d' }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;