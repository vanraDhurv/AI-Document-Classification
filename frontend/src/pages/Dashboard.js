import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import {
  Upload,
  Visibility,
  Download,
  Delete,
  FilterList,
  Clear,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { documentsAPI } from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../services/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    author: '',
  });

  useEffect(() => {
    loadDocuments();
    loadCategories();
  }, [filters]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.author) params.author = filters.author;
      
      const response = await documentsAPI.getDocuments(params);
      setDocuments(response.data);
    } catch (error) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await documentsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await documentsAPI.uploadDocument(formData);
      
      setSuccess(`File uploaded successfully: ${response.data.filename}`);
      await loadDocuments(); // Reload documents
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    multiple: false,
  });

  const handleViewDocument = (documentId) => {
    navigate(`/document/${documentId}`);
  };

  const handleDownloadDocument = async (documentId, filename) => {
    try {
      const response = await documentsAPI.downloadDocument(documentId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(documentId);
      setSuccess('Document deleted successfully');
      await loadDocuments(); // Reload documents
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      setError(errorMessage);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      author: '',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Finance': 'success',
      'HR': 'info',
      'Legal': 'warning',
      'Contracts': 'error',
      'Technical Reports': 'secondary',
      'General': 'default',
    };
    return colors[category] || 'default';
  };

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #0c0c1e 0%, #1a0f2e 25%, #0f1419 75%, #000000 100%)',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - 64px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 107, 157, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 5, pb: 5, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Page Header */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4 }}>
              <Typography 
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
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}
              >
                Dashboard
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400,
                  fontSize: '1.1rem'
                }}
              >
                Manage and organize your documents with style
              </Typography>
            </Box>
          </Grid>

          {/* Upload Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 5,
                background: 'rgba(20, 25, 35, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                boxShadow: '0 32px 64px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 212, 255, 0.1)',
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
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 700,
                  mb: 4,
                  position: 'relative',
                  zIndex: 1,
                  fontSize: '1.5rem'
                }}
              >
                Upload Document
              </Typography>
              
              <Box
                {...getRootProps()}
                className={`upload-area ${isDragActive ? 'dragover' : ''}`}
                sx={{
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  p: 8,
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragActive 
                    ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 157, 0.15))'
                    : 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  color: isDragActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': { 
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 157, 0.1))',
                    borderColor: 'rgba(0, 212, 255, 0.5)',
                    color: '#ffffff',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 212, 255, 0.2), 0 0 60px rgba(0, 212, 255, 0.1)'
                  }
                }}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <Box>
                    <CircularProgress 
                      sx={{ 
                        mb: 3, 
                        color: '#00d4ff',
                        filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
                      }} 
                      size={60}
                    />
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600 }}>
                      Uploading...
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Upload 
                      sx={{ 
                        fontSize: 80, 
                        color: '#00d4ff', 
                        mb: 3,
                        filter: 'drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))'
                      }} 
                    />
                    <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', fontWeight: 700, mb: 2 }}>
                      {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                      Or click to select a file
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mt: 2, 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: 500
                      }}
                    >
                      Supported formats: PDF, DOCX, DOC, TXT
                    </Typography>
                  </Box>
                )}
              </Box>

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 4,
                    background: 'rgba(244, 67, 54, 0.1)',
                    color: '#ff6b6b',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    zIndex: 1,
                    '& .MuiAlert-icon': {
                      color: '#ff6b6b'
                    }
                  }} 
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 4,
                    background: 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    position: 'relative',
                    zIndex: 1,
                    '& .MuiAlert-icon': {
                      color: '#4caf50'
                    }
                  }} 
                  onClose={() => setSuccess('')}
                >
                  {success}
                </Alert>
              )}
            </Paper>
          </Grid>

          {/* Filters Section */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                background: 'rgba(20, 25, 35, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 107, 157, 0.1)',
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  color: '#ffffff',
                  fontWeight: 700,
                  mb: 3,
                  fontSize: '1.3rem'
                }}
              >
                Filters
              </Typography>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    '&.Mui-focused': { color: '#00d4ff' } 
                  }}>
                    Category
                  </InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      height: '50px',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00d4ff',
                        boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)'
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.6)',
                      }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          background: 'rgba(20, 25, 35, 0.95)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '16px',
                          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
                          '& .MuiMenuItem-root': {
                            color: 'rgba(255, 255, 255, 0.9)',
                            margin: '4px 8px',
                            borderRadius: '12px',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(255, 107, 157, 0.15))',
                              color: '#ffffff'
                            },
                            '&.Mui-selected': {
                              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(255, 107, 157, 0.2))',
                              color: '#ffffff'
                            }
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Author"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      height: '50px',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 212, 255, 0.5)',
                        boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00d4ff',
                        boxShadow: '0 0 25px rgba(0, 212, 255, 0.3)'
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.6)',
                      '&.Mui-focused': {
                        color: '#00d4ff',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  disabled={!filters.category && !filters.author}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 3,
                    height: '50px',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      borderColor: 'rgba(255, 107, 157, 0.5)',
                      background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.15), rgba(0, 212, 255, 0.15))',
                      color: '#ff6b9d',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255, 107, 157, 0.2)'
                    },
                    '&:disabled': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.02)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Documents Table */}
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4,
              background: 'rgba(20, 25, 35, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2), 0 0 30px rgba(0, 212, 255, 0.05)',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                color: '#ffffff',
                fontWeight: 700,
                mb: 3,
                fontSize: '1.3rem'
              }}
            >
              My Documents ({documents.length})
            </Typography>
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={6}>
                <CircularProgress 
                  sx={{ 
                    color: '#00d4ff',
                    filter: 'drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))'
                  }} 
                  size={50}
                />
              </Box>
            ) : documents.length === 0 ? (
              <Box 
                sx={{ 
                  py: 8,
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 2, fontWeight: 600 }}>
                  No documents found
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  Upload your first document above to get started
                </Typography>
              </Box>
            ) : (
              <TableContainer 
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden'
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ 
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(255, 107, 157, 0.1))',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        Title
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        Category
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        Author
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        Upload Date
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        File Size
                      </TableCell>
                      <TableCell sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        py: 2
                      }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {documents.map((doc, index) => (
                      <TableRow 
                        key={doc.id} 
                        sx={{
                          background: index % 2 === 0 
                            ? 'rgba(255, 255, 255, 0.02)' 
                            : 'rgba(255, 255, 255, 0.01)',
                          backdropFilter: 'blur(5px)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(255, 107, 157, 0.08))',
                            transform: 'translateX(4px)',
                            boxShadow: '0 4px 20px rgba(0, 212, 255, 0.15)'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          borderColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <TableCell sx={{ 
                          color: '#ffffff', 
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          py: 2.5
                        }}>
                          <Typography variant="subtitle2" sx={{ 
                            color: '#ffffff', 
                            fontWeight: 600,
                            fontSize: '0.95rem'
                          }}>
                            {doc.title || doc.original_filename}
                          </Typography>
                          {doc.summary && (
                            <Typography variant="caption" sx={{ 
                              color: 'rgba(255, 255, 255, 0.6)', 
                              display: 'block', 
                              mt: 0.5,
                              fontSize: '0.8rem'
                            }}>
                              {doc.summary.substring(0, 100)}...
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', py: 2.5 }}>
                          <Chip
                            label={doc.category}
                            size="small"
                            sx={{
                              background: getCategoryColor(doc.category) === 'success' 
                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))' :
                                getCategoryColor(doc.category) === 'info' 
                                ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2), rgba(33, 150, 243, 0.1))' :
                                getCategoryColor(doc.category) === 'warning' 
                                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.2), rgba(255, 152, 0, 0.1))' :
                                getCategoryColor(doc.category) === 'error' 
                                ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))' :
                                'linear-gradient(135deg, rgba(156, 39, 176, 0.2), rgba(156, 39, 176, 0.1))',
                              color: getCategoryColor(doc.category) === 'success' ? '#4caf50' :
                                    getCategoryColor(doc.category) === 'info' ? '#2196f3' :
                                    getCategoryColor(doc.category) === 'warning' ? '#ff9800' :
                                    getCategoryColor(doc.category) === 'error' ? '#f44336' :
                                    '#9c27b0',
                              border: `1px solid ${getCategoryColor(doc.category) === 'success' ? 'rgba(76, 175, 80, 0.3)' :
                                                  getCategoryColor(doc.category) === 'info' ? 'rgba(33, 150, 243, 0.3)' :
                                                  getCategoryColor(doc.category) === 'warning' ? 'rgba(255, 152, 0, 0.3)' :
                                                  getCategoryColor(doc.category) === 'error' ? 'rgba(244, 67, 54, 0.3)' :
                                                  'rgba(156, 39, 176, 0.3)'}`,
                              fontWeight: 600,
                              borderRadius: '8px',
                              backdropFilter: 'blur(10px)'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          py: 2.5,
                          fontSize: '0.9rem'
                        }}>
                          {doc.author || 'Unknown'}
                        </TableCell>
                        <TableCell sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          py: 2.5,
                          fontSize: '0.9rem'
                        }}>
                          {doc.upload_date && !Number.isNaN(new Date(doc.upload_date).getTime())
                            ? format(new Date(doc.upload_date), 'MMM dd, yyyy')
                            : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ 
                          color: 'rgba(255, 255, 255, 0.8)', 
                          borderColor: 'rgba(255, 255, 255, 0.05)',
                          py: 2.5,
                          fontSize: '0.9rem'
                        }}>
                          {Math.round(doc.size / 1024)} KB
                        </TableCell>
                        <TableCell sx={{ borderColor: 'rgba(255, 255, 255, 0.05)', py: 2.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleViewDocument(doc.id)}
                            title="View"
                            sx={{ 
                              color: '#00d4ff',
                              background: 'rgba(0, 212, 255, 0.1)',
                              border: '1px solid rgba(0, 212, 255, 0.2)',
                              borderRadius: '8px',
                              mr: 1,
                              '&:hover': { 
                                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 212, 255, 0.1))',
                                transform: 'scale(1.1)',
                                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadDocument(doc.id, doc.original_filename)}
                            title="Download"
                            sx={{ 
                              color: '#4caf50',
                              background: 'rgba(76, 175, 80, 0.1)',
                              border: '1px solid rgba(76, 175, 80, 0.2)',
                              borderRadius: '8px',
                              mr: 1,
                              '&:hover': { 
                                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))',
                                transform: 'scale(1.1)',
                                boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <Download />
                          </IconButton>
                          {(user?.role === 'Admin' || doc.uploader_id === user?.id) && (
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteDocument(doc.id)}
                              title="Delete"
                              sx={{ 
                                color: '#f44336',
                                background: 'rgba(244, 67, 54, 0.1)',
                                border: '1px solid rgba(244, 67, 54, 0.2)',
                                borderRadius: '8px',
                                '&:hover': { 
                                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(244, 67, 54, 0.1))',
                                  transform: 'scale(1.1)',
                                  boxShadow: '0 0 20px rgba(244, 67, 54, 0.3)'
                                },
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </Box>
  );
};

export default Dashboard;