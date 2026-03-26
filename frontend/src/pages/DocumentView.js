import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Edit,
  Delete,
  Person,
  Category,
  DateRange,
  Description,
  CloudDownload,
} from '@mui/icons-material';
import { documentsAPI } from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../services/AuthContext';

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entities, setEntities] = useState(null);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getDocument(id);
      setDocument(response.data);
      
      // Parse entities if available
      if (response.data.entities) {
        try {
          const parsedEntities = JSON.parse(response.data.entities);
          setEntities(parsedEntities);
        } catch (e) {
          console.error('Error parsing entities:', e);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to load document';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await documentsAPI.downloadDocument(id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.original_filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download document');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentsAPI.deleteDocument(id);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Delete failed';
      setError(errorMessage);
    }
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

  const canUserModify = () => {
    return user?.role === 'Admin' || document?.uploader_id === user?.id;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="info">Document not found</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: '#64b5f6',
              '&:hover': {
                backgroundColor: 'rgba(100, 181, 246, 0.1)',
                transform: 'translateX(-2px)',
              },
              transition: 'all 0.2s ease'
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Document Header */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                backgroundColor: '#1a1a1a',
                border: '1px solid #333333',
                borderRadius: '12px',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                  <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 700,
                      mb: 2
                    }}
                  >
                    {document.title || document.original_filename}
                  </Typography>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip
                      icon={<Category />}
                      label={document.category}
                      sx={{
                        backgroundColor: getCategoryColor(document.category) === 'success' ? 'rgba(76, 175, 80, 0.2)' :
                                       getCategoryColor(document.category) === 'info' ? 'rgba(33, 150, 243, 0.2)' :
                                       getCategoryColor(document.category) === 'warning' ? 'rgba(255, 152, 0, 0.2)' :
                                       getCategoryColor(document.category) === 'error' ? 'rgba(244, 67, 54, 0.2)' :
                                       'rgba(156, 39, 176, 0.2)',
                        color: getCategoryColor(document.category) === 'success' ? '#4caf50' :
                              getCategoryColor(document.category) === 'info' ? '#2196f3' :
                              getCategoryColor(document.category) === 'warning' ? '#ff9800' :
                              getCategoryColor(document.category) === 'error' ? '#f44336' :
                              '#9c27b0',
                        border: `1px solid ${getCategoryColor(document.category) === 'success' ? 'rgba(76, 175, 80, 0.3)' :
                                             getCategoryColor(document.category) === 'info' ? 'rgba(33, 150, 243, 0.3)' :
                                             getCategoryColor(document.category) === 'warning' ? 'rgba(255, 152, 0, 0.3)' :
                                             getCategoryColor(document.category) === 'error' ? 'rgba(244, 67, 54, 0.3)' :
                                             'rgba(156, 39, 176, 0.3)'}`,
                        fontWeight: 500
                      }}
                    />
                    {document.author && (
                      <Chip
                        icon={<Person sx={{ color: '#64b5f6' }} />}
                        label={`By ${document.author}`}
                        sx={{
                          backgroundColor: 'rgba(100, 181, 246, 0.1)',
                          color: '#64b5f6',
                          border: '1px solid rgba(100, 181, 246, 0.3)',
                          fontWeight: 500
                        }}
                      />
                    )}
                    <Chip
                      icon={<DateRange sx={{ color: '#f48fb1' }} />}
                      label={document.upload_date && !Number.isNaN(new Date(document.upload_date).getTime())
                        ? format(new Date(document.upload_date), 'MMM dd, yyyy')
                        : 'N/A'}
                      sx={{
                        backgroundColor: 'rgba(244, 143, 177, 0.1)',
                        color: '#f48fb1',
                        border: '1px solid rgba(244, 143, 177, 0.3)',
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>
                
                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                  startIcon={<CloudDownload />}
                  onClick={handleDownload}
                >
                  Download
                </Button>
                {canUserModify() && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => navigate(`/document/${id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Original Filename
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {document.original_filename}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  File Size
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {Math.round(document.size / 1024)} KB
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Uploaded By
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {document.author || 'Unknown'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Access Count
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {document.access_count} views
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Document Summary */}
        {document.summary && (
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Description sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Summary
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {document.summary}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Extracted Entities */}
        {entities && (
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Extracted Information
                </Typography>
                
                {Object.entries(entities).map(([entityType, entityList]) => {
                  if (!entityList || entityList.length === 0) return null;
                  
                  return (
                    <Box key={entityType} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        {entityType.replace('_', ' ')}
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {entityList.slice(0, 5).map((entity, index) => (
                          <Chip
                            key={index}
                            label={typeof entity === 'object' ? entity.text : entity}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Metadata */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Document Metadata
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    MIME Type
                  </Typography>
                  <Typography variant="body1">
                    {document.mime_type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Last Accessed
                  </Typography>
                  <Typography variant="body1">
                    {document.last_accessed && !Number.isNaN(new Date(document.last_accessed).getTime())
                      ? format(new Date(document.last_accessed), 'MMM dd, yyyy HH:mm')
                      : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Document ID
                  </Typography>
                  <Typography variant="body1">
                    {document.id}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
    </Box>
  );
};

export default DocumentView;