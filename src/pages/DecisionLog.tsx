import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, TextField, IconButton, Collapse, Grid, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, FormHelperText, Card, CardContent } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';

const glassStyle = {
    backgroundColor: 'rgba(40, 44, 52, 0.9)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

interface DecisionRow {
    id: string;
    impact: string;
    status: string;
    detail: string | null;
    resulting_action: string | null;
    proposed_date: string | null;
    proposed_by: string | null;
    approved_by: string | null;
    created_at: string;
    updated_at: string;
    project: number;
}

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DecisionRow[];
}

interface EditApiResponse {
    message: string;
    data: DecisionRow;
}

const DecisionLog: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<DecisionRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<DecisionRow | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof DecisionRow; direction: 'ascending' | 'descending' } | null>(null);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newDecision, setNewDecision] = useState<Partial<DecisionRow>>({
        impact: 'low',
        status: 'pending',
        project: Number(id)
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<ApiResponse>('http://localhost:8000/api/v1/decision/list?page=1&limit=10');
            setData(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setSnackbarMessage('Error fetching data');
            setSnackbarOpen(true);
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

    const requestSort = (key: keyof DecisionRow) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleEditClick = async (decisionId: string) => {
        try {
            const response = await axios.get<DecisionRow>(`http://localhost:8000/api/v1/decision/${decisionId}/`);
            setEditingId(decisionId);
            setEditData(response.data);
        } catch (error) {
            console.error('Error fetching decision details:', error);
            setSnackbarMessage('Error fetching decision details');
            setSnackbarOpen(true);
        }
    };

    const handleSaveEdit = async () => {
        if (editData) {
            try {
                const response = await axios.patch<EditApiResponse>(`http://localhost:8000/api/v1/decision/edit/${editData.id}/`, editData);
                setData(data.map(row => row.id === editData.id ? response.data.data : row));
                setEditingId(null);
                setEditData(null);
                setSnackbarMessage(response.data.message);
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error updating decision:', error);
                setSnackbarMessage('Error updating decision');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const handleDeleteClick = (decisionId: string) => {
        setDeleteId(decisionId);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/decision/delete/${deleteId}/`);
                setData(data.filter(row => row.id !== deleteId));
                setSnackbarMessage('Decision deleted successfully');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error deleting decision:', error);
                setSnackbarMessage('Error deleting decision');
                setSnackbarOpen(true);
            }
        }
        setDeleteConfirmOpen(false);
        setDeleteId(null);
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setDeleteId(null);
    };

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
        setNewDecision({
            impact: 'low',
            status: 'pending',
            project: Number(id)
        });
        setFormErrors({});
    };

    const handleAddDecision = async () => {
        const errors: { [key: string]: string } = {};
        if (!newDecision.impact) {
            errors.impact = 'Impact is required';
        }
        if (!newDecision.status) {
            errors.status = 'Status is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const response = await axios.post<DecisionRow>('http://localhost:8000/api/v1/decision/add/', newDecision);
            setData([...data, response.data]);
            setSnackbarMessage('Decision added successfully');
            setSnackbarOpen(true);
            handleAddDialogClose();
        } catch (error) {
            console.error('Error adding decision:', error);
            setSnackbarMessage('Error adding decision');
            setSnackbarOpen(true);
        }
    };

    const handleInputChange = (field: keyof DecisionRow, value: string) => {
        if (editData) {
            setEditData({ ...editData, [field]: value });
        }
    };

    const handleNewDecisionChange = (field: keyof DecisionRow, value: string) => {
        setNewDecision({ ...newDecision, [field]: value });
        setFormErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const columns: (keyof DecisionRow)[] = ['id', 'impact', 'status', 'created_at'];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="p-8 min-h-screen bg-[#121212] text-white">
            <AppBar position="static" sx={{ mb: 2, ...glassStyle, boxShadow: 'none', height: '80px', minHeight: '40px' }}>
                <Toolbar variant="dense" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Decision Log
                    </Typography>
                    <Button onClick={() => navigate(`/projects/${id}`)} sx={{ ...glassStyle, '&:hover': { backgroundColor: 'rgba(5, 78, 90, 0.8)' } }}>
                        Back to Project
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <Button onClick={handleAddDialogOpen} style={glassStyle}>
                    Add Decision
                </Button>
            </Box>

            <div className="w-full">
                <table className="w-full border-collapse rounded-lg overflow-hidden" style={glassStyle}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(5, 78, 90, 0.6)' }}>
                            <th className="p-2"></th>
                            {columns.map((key) => (
                                <th key={key} className="p-2">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {key === 'id' ? 'Decision ID' : key.charAt(0).toUpperCase() + key.slice(1)}
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
                                    {columns.map((key) => (
                                        <td key={key} className="p-2">
                                            {editingId === row.id && key !== 'created_at' ? (
                                                key === 'id' ? (
                                                    row[key]
                                                ) : (
                                                    <TextField
                                                        value={editData?.[key] || ''}
                                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                                        size="small"
                                                        InputProps={{ style: { color: 'white' } }}
                                                    />
                                                )
                                            ) : (
                                                row[key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-2 text-center">
                                        {editingId === row.id ? (
                                            <>
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
                                            </>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                        <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Card sx={{ backgroundColor: 'rgba(60, 64, 72, 0.9)', color: 'white', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}>
                                                    <CardContent>
                                                        <Grid container spacing={3}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4a90e2', paddingBottom: '8px', marginBottom: '16px' }}>
                                                                    Decision Details
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Detail</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.detail || ''}
                                                                                onChange={(e) => handleInputChange('detail', e.target.value)}
                                                                                size="small"
                                                                                multiline
                                                                                rows={4}
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.detail || 'N/A'}</Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Proposed Date</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                type="date"
                                                                                value={editData?.proposed_date || ''}
                                                                                onChange={(e) => handleInputChange('proposed_date', e.target.value)}
                                                                                size="small"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.proposed_date || 'N/A'}</Typography>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4a90e2', paddingBottom: '8px', marginBottom: '16px' }}>
                                                                    Decision Management
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Resulting Action</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.resulting_action || ''}
                                                                                onChange={(e) => handleInputChange('resulting_action', e.target.value)}
                                                                                size="small"
                                                                                multiline
                                                                                rows={4}
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.resulting_action || 'N/A'}</Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Proposed By</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.proposed_by || ''}
                                                                                onChange={(e) => handleInputChange('proposed_by', e.target.value)}
                                                                                size="small"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.proposed_by || 'N/A'}</Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Approved By</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.approved_by || ''}
                                                                                onChange={(e) => handleInputChange('approved_by', e.target.value)}
                                                                                size="small"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.approved_by || 'N/A'}</Typography>
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
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
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
                <DialogTitle>Add New Decision</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" error={!!formErrors.impact}>
                                <InputLabel style={{ color: 'white' }}>Impact</InputLabel>
                                <Select
                                    value={newDecision.impact || ''}
                                    onChange={(e) => handleNewDecisionChange('impact', e.target.value as string)}
                                    style={{ color: 'white' }}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                                {formErrors.impact && (
                                    <FormHelperText style={{ color: 'red' }}>
                                        {formErrors.impact}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal" error={!!formErrors.status}>
                                <InputLabel style={{ color: 'white' }}>Status</InputLabel>
                                <Select
                                    value={newDecision.status || ''}
                                    onChange={(e) => handleNewDecisionChange('status', e.target.value as string)}
                                    style={{ color: 'white' }}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="approved">Approved</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                                {formErrors.status && (
                                    <FormHelperText style={{ color: 'red' }}>
                                        {formErrors.status}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Detail"
                                value={newDecision.detail || ''}
                                onChange={(e) => handleNewDecisionChange('detail', e.target.value)}
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
                                label="Resulting Action"
                                value={newDecision.resulting_action || ''}
                                onChange={(e) => handleNewDecisionChange('resulting_action', e.target.value)}
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
                                label="Proposed Date"
                                type="date"
                                value={newDecision.proposed_date || ''}
                                onChange={(e) => handleNewDecisionChange('proposed_date', e.target.value)}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                    style: { color: 'white' }
                                }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Proposed By"
                                value={newDecision.proposed_by || ''}
                                onChange={(e) => handleNewDecisionChange('proposed_by', e.target.value)}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Approved By"
                                value={newDecision.approved_by || ''}
                                onChange={(e) => handleNewDecisionChange('approved_by', e.target.value)}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} style={{ color: 'white' }}>Cancel</Button>
                    <Button onClick={handleAddDecision} style={{ color: 'white' }}>Add Decision</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
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
                        Are you sure you want to delete this decision?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} style={{ color: 'white' }}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} autoFocus style={{ color: 'white' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DecisionLog;