import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import SearchPage from './pages/SearchPage';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Services
import { AuthProvider } from './services/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff', // Vibrant cyan for primary actions
      dark: '#0099cc',
      light: '#33e0ff',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff6b9d', // Modern pink accent
      dark: '#c53b6b',
      light: '#ff8bb0',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#ffd700', // Gold accent for highlights
      dark: '#ccac00',
      light: '#ffdf33',
    },
    background: {
      default: 'transparent', // Will use gradient backgrounds
      paper: 'rgba(20, 25, 35, 0.8)', // Semi-transparent dark with blue tint
    },
    surface: {
      main: 'rgba(30, 35, 50, 0.9)', // Slightly lighter surface
    },
    text: {
      primary: '#ffffff', // Pure white for primary text
      secondary: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white
    },
    divider: 'rgba(255, 255, 255, 0.12)', // Subtle white dividers
    error: {
      main: '#ff4757',
      light: '#ff6b7a',
    },
    warning: {
      main: '#ffa502',
      light: '#ffb733',
    },
    success: {
      main: '#2ed573',
      light: '#55e08a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      background: 'linear-gradient(135deg, #00d4ff 0%, #ff6b9d 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: '#ffffff',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.005em',
      lineHeight: 1.4,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#ffffff',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: 'rgba(255, 255, 255, 0.87)',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(0, 0, 0, 0.3)',
    '0 4px 16px rgba(0, 0, 0, 0.4)',
    '0 8px 24px rgba(0, 0, 0, 0.5)',
    '0 12px 32px rgba(0, 0, 0, 0.6)',
    '0 16px 40px rgba(0, 0, 0, 0.7)',
    '0 20px 48px rgba(0, 212, 255, 0.2)',
    '0 24px 56px rgba(0, 212, 255, 0.3)',
    '0 28px 64px rgba(255, 107, 157, 0.2)',
    '0 32px 72px rgba(255, 107, 157, 0.3)',
    ...Array(15).fill('0 40px 80px rgba(0, 0, 0, 0.8)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0c0c1e 0%, #1a0f2e 25%, #0f1419 75%, #000000 100%)',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          color: '#ffffff',
          fontFeatureSettings: '"liga" 1, "kern" 1',
          fontSmooth: 'always',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent',
        },
        '*::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '3px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(20, 25, 35, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 15, 25, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            transform: 'translateX(-100%)',
            transition: 'transform 0.6s',
          },
          '&:hover::before': {
            transform: 'translateX(100%)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #33e0ff 0%, #00b8e6 100%)',
            boxShadow: '0 6px 30px rgba(0, 212, 255, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          border: '2px solid rgba(0, 212, 255, 0.5)',
          color: '#00d4ff',
          background: 'rgba(0, 212, 255, 0.05)',
          '&:hover': {
            border: '2px solid #00d4ff',
            background: 'rgba(0, 212, 255, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(25, 30, 45, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4ff',
              borderWidth: '2px',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
            '&.Mui-focused': {
              color: '#00d4ff',
            },
          },
        },
      },
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/document/:id"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <DocumentView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <Navigation />
                      <SearchPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;