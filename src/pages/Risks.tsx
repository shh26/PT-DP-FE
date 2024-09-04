import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, TextField, IconButton,
  Collapse, Grid, CircularProgress, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogActions, Tabs, Tab, FormControl, InputLabel, Select, MenuItem,FormHelperText,
  Card, CardContent, Divider, Paper
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {api} from '../api/index'

interface RiskRow {
  id: string;
  name: string;
  probability: string;
  impact: string;
  risk_level: string;
  risk_owner: string;
  created_at: string;
  description: string;
  source: string;
  risk_response: string;
  category: string;
  project: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RiskRow[];
}

interface EditApiResponse {
  message: string;
  data: RiskRow;
}

const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const Risks: React.FC = () => {
  const { id: project_id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [showAllRisks, setShowAllRisks] = useState(false);
  const [data, setData] = useState<RiskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<RiskRow | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof RiskRow; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formdata, setFormData] = useState<Partial<RiskRow>>({
    project: project_id
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const categoryMapping: Record<string, string> = {
    'Assembly MFE': 'assembly_manufacturing',
    'Communication': 'communication',
    'Customer': 'customer',
    'Facility Readiness': 'facility_readiness',
    'Finance': 'finance',
    'IT': 'it',
    'Logistics': 'logistics',
    'Machinery MFE': 'machinery_manufacturing',
    'Marketing': 'marketing',
    'People': 'people',
    'Planning': 'planning',
    'Procurement': 'procurement',
    'Quality': 'quality',
    'Safety': 'safety'
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, project_id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get<ApiResponse>(`risk/list?page=1&limit=10&category=${selectedCategory}&project=${project_id}`);
      setData(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbarMessage('Error fetching data');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof RiskRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleEditClick = async (riskId: string) => {
    try {
      const response = await api.get<RiskRow>(`risk/${riskId}/`);
      setEditingId(riskId);
      setEditData(response.data);
    } catch (error) {
      console.error('Error fetching risk details:', error);
      setSnackbarMessage('Error fetching risk details');
      setSnackbarOpen(true);
    }
  };

  const handleSaveEdit = async () => {
    if (editData) {
      try {
        const response = await api.patch<EditApiResponse>(`risk/edit/${editData.id}/`, editData);
        setData(data.map(row => row.id === editData.id ? response.data.data : row));
        setEditingId(null);
        setEditData(null);
        setSnackbarMessage('Risk updated successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error updating risk:', error);
        setSnackbarMessage('Error updating risk');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleDeleteClick = (riskId: string) => {
    setDeleteId(riskId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      try {
        await api.delete(`risk/delete/${deleteId}/`);
        setData(data.filter(row => row.id !== deleteId));
        setSnackbarMessage('Risk deleted successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error deleting risk:', error);
        setSnackbarMessage('Error deleting risk');
        setSnackbarOpen(true);
      }
    }
    setDeleteConfirmOpen(false);
    setDeleteId(null);
  };

  const handleAddDialogOpen = () => {
  
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setFormData({
      project: project_id
    });
    setFormErrors({});
  };

  const handleAddRisk = async () => {
    const errors: { [key: string]: string } = {};
  if (!formdata.category) {
    errors.category = 'Category is required';
  }

  if (Object.keys(errors).length > 0) {
    setFormErrors(errors);
    return;
  }
    try {
      const response = await api.post<RiskRow>('risk/add/', formdata);
      setData([...data, response.data]);
      setSnackbarMessage('Risk added successfully');
      setSnackbarOpen(true);
      handleAddDialogClose();
    } catch (error) {
      console.error('Error adding risk:', error);
      setSnackbarMessage('Error adding risk');
      setSnackbarOpen(true);
    }
  };

  const handleInputChange = (field: keyof RiskRow, value: string) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleNewRiskChange = (field: keyof RiskRow, value: string) => {
    setFormData({ ...formdata, [field]: value });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSelectedCategory(Object.values(categoryMapping)[newValue]);
  };

  const columns: (keyof RiskRow)[] = ['id', 'name', 'probability', 'impact', 'risk_level', 'risk_owner'];

  const getColumnLabel = (key: string): string => {
    switch (key) {
      case 'id':
        return 'Risk ID';
      case 'risk_owner':
        return 'Risk Owner';
      case 'risk_level':
        return 'Risk Level';
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

  return (
    <Box className="p-8 min-h-screen bg-[#121212] text-white">
      <AppBar position="static" sx={{ mb: 2, ...glassStyle, boxShadow: 'none', height: '80px', minHeight: '40px' }}>
        <Toolbar variant="dense" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            Risks
          </Typography>
          <Button onClick={() => navigate(`/projects/${project_id}`)} sx={{ ...glassStyle, '&:hover': { backgroundColor: 'rgba(5, 78, 90, 0.8)' } }}>
            Back to Project
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Button onClick={handleAddDialogOpen} style={glassStyle}>
          Add Risk
        </Button>
        <FormControl variant="filled" style={{ minWidth: 200 }}>
          <InputLabel style={{ color: 'white' }}>Filter By Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ color: 'white', backgroundColor: 'rgba(40, 44, 52, 0.9)' }}
          >
            <MenuItem value="">All</MenuItem>
            {Object.entries(categoryMapping).map(([key, value]) => (
              <MenuItem key={value} value={value}>{key}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={3} sx={{ ...glassStyle, overflow: 'hidden' }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'rgba(5, 78, 90, 0.6)' }}>
              <th className="p-2"></th>
              {columns.map((key) => (
                <th key={key} className="p-2" style={{ textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {getColumnLabel(key)}
                    <IconButton size="small" onClick={() => requestSort(key)}>
                      {sortConfig?.key === key ? (
                        sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                      ) : (
                        <ArrowUpwardIcon style={{ opacity: 0.5 }} />
                      )}
                    </IconButton>
                  </div>
                </th>
              ))}
              <th className="p-2" style={{ width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row) => (
              <React.Fragment key={row.id}>
                <tr>
                  <td className="p-2">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                    >
                      {expandedRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </td>
                  {editingId === row.id ? (
                    <>
                      {columns.map((key) => (
                        <td key={key} className="p-2">
                          {key === 'id' ? (
                            <Typography variant="body2" gutterBottom component="div">
                              {row[key]}
                            </Typography>
                          ) : (
                            <TextField
                              value={editData?.[key] || ''}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              size="small"
                              InputProps={{ style: { color: 'white' } }}
                            />
                          )}
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <Button
                          onClick={handleSaveEdit}
                          style={{ ...glassStyle, marginRight: '5px' }}
                        >
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          style={glassStyle}
                        >
                          Cancel
                        </Button>
                      </td>
                    </>
                  ) : (
                    <>
                      {columns.map((key) => (
                        <td key={key} className="p-2" style={{ textAlign: 'left' }}>
                          {row[key]}
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <Button
                          onClick={() => handleEditClick(row.id)}
                          style={{ ...glassStyle, marginRight: '5px' }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(row.id)}
                          style={glassStyle}
                        >
                          Delete
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
                <tr>
                  <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
                    <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 2 }}>
                        <Card sx={{ backgroundColor: 'rgba(60, 64, 72, 0.9)', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                          <CardContent>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4a90e2', paddingBottom: '8px', marginBottom: '16px' }}>
                                  Risk Details
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                    {editingId === row.id ? (
                                      <TextField
                                        fullWidth
                                        value={editData?.description || ''}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        size="small"
                                        multiline
                                        rows={4}
                                        sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                      />
                                    ) : (
                                      <Typography variant="body2">{row.description}</Typography>
                                    )}
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Source</Typography>
                                    {editingId === row.id ? (
                                      <TextField
                                        fullWidth
                                        value={editData?.source || ''}
                                        onChange={(e) => handleInputChange('source', e.target.value)}
                                        size="small"
                                        sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                      />
                                    ) : (
                                      <Typography variant="body2">{row.source}</Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4a90e2', paddingBottom: '8px', marginBottom: '16px' }}>
                                  Risk Management
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Risk Response</Typography>
                                    {editingId === row.id ? (
                                      <TextField
                                        fullWidth
                                        value={editData?.risk_response || ''}
                                        onChange={(e) => handleInputChange('risk_response', e.target.value)}
                                        size="small"
                                        multiline
                                        rows={4}
                                        sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                      />
                                    ) : (
                                      <Typography variant="body2">{row.risk_response}</Typography>
                                    )}
                                  </Box>
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                                    {editingId === row.id ? (
                                      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                                        <Select
                                          value={editData?.category || ''}
                                          onChange={(e) => handleInputChange('category', e.target.value as string)}
                                          sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                                        >
                                          {Object.entries(categoryMapping).map(([key, value]) => (
                                            <MenuItem key={value} value={value}>{key}</MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    ) : (
                                      <Typography variant="body2">
                                        {Object.entries(categoryMapping).find(([_, value]) => value === row.category)?.[0] || row.category}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Box>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </Paper>
      <Dialog
        open={addDialogOpen}
        onClose={handleAddDialogClose}
        PaperProps={{
          style: {
            ...glassStyle,
            minWidth: '500px',
          },
        }}
      >
        <DialogTitle>Add New Risk</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formdata.name || ''}
                onChange={(e) => handleNewRiskChange('name', e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Probability"
                value={formdata.probability || ''}
                onChange={(e) => handleNewRiskChange('probability', e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Impact"
                value={formdata.impact || ''}
                onChange={(e) => handleNewRiskChange('impact', e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Risk Owner"
                value={formdata.risk_owner || ''}
                onChange={(e) => handleNewRiskChange('risk_owner', e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
  <FormControl fullWidth margin="normal" error={!!formErrors.category}>
    <InputLabel style={{ color: 'white' }}>Category</InputLabel>
    <Select
      value={formdata.category || ''}
      onChange={(e) => {
        handleNewRiskChange('category', e.target.value as string);
        setFormErrors((prev) => ({ ...prev, category: '' }));
      }}
      style={{ color: 'white' }}
    >
      {Object.entries(categoryMapping).map(([key, value]) => (
        <MenuItem key={value} value={value}>
          {key}
        </MenuItem>
      ))}
    </Select>
    {formErrors.category && (
      <FormHelperText style={{ color: 'red' }}>
        {formErrors.category}
      </FormHelperText>
    )}
  </FormControl>
</Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formdata.description || ''}
                onChange={(e) => handleNewRiskChange('description', e.target.value)}
                margin="normal"
                multiline
                rows={4}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Source"
                value={formdata.source || ''}
                onChange={(e) => handleNewRiskChange('source', e.target.value)}
                margin="normal"
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Risk Response"
                value={formdata.risk_response || ''}
                onChange={(e) => handleNewRiskChange('risk_response', e.target.value)}
                margin="normal"
                multiline
                rows={4}
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{ style: { color: 'white' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} style={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleAddRisk} style={{ color: 'white' }}>Add Risk</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            ...glassStyle,
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this Risk?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} style={{ color: 'white' }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus style={{ color: 'white' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Risks;