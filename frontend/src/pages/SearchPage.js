import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  Search,
  Visibility,
  Download,
  FilterList,
  Clear,
  Psychology,
  FindInPage,
} from '@mui/icons-material';
import { documentsAPI, searchAPI } from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../services/AuthContext';

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('keyword'); // 'keyword' or 'semantic'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    author: '',
  });
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await documentsAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      let response;
      
      if (searchType === 'semantic') {
        // Semantic search using embeddings
        const searchRequest = {
          query: searchQuery,
          category: filters.category || undefined,
          author: filters.author || undefined,
          limit: 20,
        };
        
        response = await searchAPI.semanticSearch(searchRequest);
      } else {
        // Keyword search
        const params = {
          q: searchQuery,
          limit: 20,
        };
        
        if (filters.category) params.category = filters.category;
        if (filters.author) params.author = filters.author;
        
        response = await searchAPI.search(params);
      }

      setResults(response.data.results || []);
      setTotalResults(response.data.total_count || response.data.results?.length || 0);
      
      if (response.data.results?.length === 0) {
        setError('No documents found matching your search criteria.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Search failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

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

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'default';
  };

  const formatScore = (score) => {
    return Math.round(score * 100);
  };

  return (
    <Box sx={{ backgroundColor: '#0a0a0a', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#ffffff',
              mb: 1
            }}
          >
            Search Documents
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#b3b3b3'
            }}
          >
            Find documents using keyword search or AI-powered semantic search
          </Typography>
        </Box>

        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 3,
            backgroundColor: '#1a1a1a',
            border: '1px solid #333333',
            borderRadius: '12px',
          }}
        >
          {/* Search Type Tabs */}
          <Tabs
            value={searchType}
            onChange={(e, newValue) => setSearchType(newValue)}
            sx={{ 
              mb: 3,
              '& .MuiTab-root': {
                color: '#b3b3b3',
                textTransform: 'none',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#64b5f6',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#64b5f6',
              },
            }}
          >
            <Tab
              value="keyword"
              label="Keyword Search"
              icon={<FindInPage />}
              iconPosition="start"
            />
            <Tab
              value="semantic"
              label="Semantic Search"
              icon={<Psychology />}
              iconPosition="start"
            />
          </Tabs>

          {/* Search Input */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder={
                searchType === 'semantic'
                  ? 'Enter natural language query (e.g., "financial reports from last quarter")'
                  : 'Enter keywords to search for...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                '& fieldset': {
                  borderColor: '#333333',
                },
                '&:hover fieldset': {
                  borderColor: '#64b5f6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#64b5f6',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#888888',
                opacity: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <Search />}
                  sx={{
                    ml: 1,
                    background: 'linear-gradient(135deg, #64b5f6 0%, #1976d2 100%)',
                    boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 6px 16px rgba(100, 181, 246, 0.4)',
                    },
                    '&:disabled': {
                      background: '#333333',
                      color: '#666666',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Search
                </Button>
              ),
            }}
          />
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              color: '#ffffff',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            <FilterList sx={{ mr: 1, color: '#64b5f6' }} />
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ color: '#b3b3b3', '&.Mui-focused': { color: '#64b5f6' } }}>
                  Category
                </InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#333333',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#64b5f6',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#64b5f6',
                    },
                    '& .MuiSelect-icon': {
                      color: '#b3b3b3',
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #333333',
                        '& .MuiMenuItem-root': {
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(100, 181, 246, 0.1)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(100, 181, 246, 0.2)',
                          }
                        }
                      }
                    }
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                label="Author"
                value={filters.author}
                onChange={(e) => handleFilterChange('author', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    '& fieldset': {
                      borderColor: '#333333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#64b5f6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#64b5f6',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#b3b3b3',
                    '&.Mui-focused': {
                      color: '#64b5f6',
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
                  borderColor: '#333333',
                  color: '#b3b3b3',
                  '&:hover': {
                    borderColor: '#64b5f6',
                    backgroundColor: 'rgba(100, 181, 246, 0.1)',
                    color: '#64b5f6',
                  },
                  '&:disabled': {
                    borderColor: '#1a1a1a',
                    color: '#666666',
                  }
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Search Results */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#f44336',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '8px'
          }}
        >
          {error}
        </Alert>
      )}

      {totalResults > 0 && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          Found {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
        </Typography>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress sx={{ color: '#64b5f6' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {results.map((result) => {
            const doc = result.document;
            return (
              <Grid item xs={12} key={doc.id}>
                <Card
                  elevation={0}
                  sx={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333333',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                      borderColor: '#64b5f6',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box flex={1}>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            color: '#ffffff',
                            fontWeight: 600
                          }}
                        >
                          {doc.title || doc.original_filename}
                        </Typography>
                        
                        <Box display="flex" gap={1} mb={2}>
                          <Chip
                            label={doc.category}
                            color={getCategoryColor(doc.category)}
                            size="small"
                          />
                          {doc.author && (
                            <Chip
                              label={`By ${doc.author}`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                          <Chip
                            label={doc.upload_date && !Number.isNaN(new Date(doc.upload_date).getTime())
                              ? format(new Date(doc.upload_date), 'MMM dd, yyyy')
                              : 'N/A'}
                            variant="outlined"
                            size="small"
                          />
                          {searchType === 'semantic' && result.score && (
                            <Chip
                              label={`${formatScore(result.score)}% match`}
                              color={getScoreColor(result.score)}
                              size="small"
                            />
                          )}
                        </Box>

                        {doc.summary && (
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {doc.summary}
                          </Typography>
                        )}

                        {result.highlights && result.highlights.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Highlights:
                            </Typography>
                            {result.highlights.map((highlight, index) => (
                              <Typography
                                key={index}
                                variant="body2"
                                sx={{
                                  bgcolor: 'warning.light',
                                  p: 1,
                                  borderRadius: 1,
                                  mt: 0.5,
                                  display: 'block',
                                }}
                              >
                                ...{highlight}...
                              </Typography>
                            ))}
                          </Box>
                        )}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <CardActions sx={{ justifyContent: 'space-between', px: 0 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {Math.round(doc.size / 1024)} KB
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          View
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Download />}
                          onClick={() => handleDownloadDocument(doc.id, doc.original_filename)}
                        >
                          Download
                        </Button>
                      </Box>
                    </CardActions>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!loading && results.length === 0 && searchQuery && !error && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No documents found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try different keywords or use semantic search for better results
          </Typography>
        </Paper>
      )}
    </Container>
    </Box>
  );
};

export default SearchPage;