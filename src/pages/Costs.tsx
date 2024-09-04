import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, TextField, IconButton, Collapse, Grid, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {api} from '../api/index'


interface CostRow {
    id: number;
    cost_id: string;
    category: string;
    group: string;
    description: string;
    additional_comment: string;
    budget: number;
    spent: number;
    remaining_budget: number;
    spend_to_finish: number;
    forecast: number;
    variance: number;
    project: number;
}

interface ApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CostRow[];
}

interface EditApiResponse {
    message: string;
    data: CostRow;
}

const glassStyle = {
    backgroundColor: 'rgba(40, 44, 52, 0.9)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const formatNumber = (num: number): string => {
    return num?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const Costs: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CostRow[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<CostRow | null>(null);
    const [filterBy, setFilterBy] = useState<string>('none');
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [newCost, setNewCost] = useState<Partial<CostRow>>({
        project: Number(id),
    });
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof CostRow; direction: 'ascending' | 'descending' } | null>(null);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [division, setDivision] = useState('');

    useEffect(() => {
        const new_division = localStorage.getItem('division')
        setDivision(new_division)
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get<ApiResponse>(`cost/list?page=1&limit=10&project=${id}&division=${division}`);
            setData(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setSnackbarMessage('Error fetching data');
            setSnackbarOpen(true);
        }
    };

    const filteredAndAggregatedData = useMemo(() => {
        if (filterBy === 'none') return data;

        const groupedData = data.reduce((acc, curr) => {
            const key = filterBy === 'category_and_group'
                ? `${curr.category}-${curr.group}`
                : curr[filterBy as 'category' | 'group'];

            if (!acc[key]) {
                acc[key] = {
                    ...curr,
                    budget: typeof curr.budget === 'string' ? parseFloat(curr.budget) : curr.budget,
                    spent: typeof curr.spent === 'string' ? parseFloat(curr.spent) : curr.spent,
                    remaining_budget: typeof curr.remaining_budget === 'string' ? parseFloat(curr.remaining_budget) : curr.remaining_budget,
                    spend_to_finish: typeof curr.spend_to_finish === 'string' ? parseFloat(curr.spend_to_finish) : curr.spend_to_finish,
                    forecast:  typeof curr.forecast === 'string' ? parseFloat(curr.forecast) : curr.forecast,
                    variance: typeof curr.variance === 'string' ? parseFloat(curr.variance) : curr.variance,
                    count: 1
                };
            } else {
                acc[key].budget += typeof curr.budget === 'string' ? parseFloat(curr.budget) : curr.budget;
                acc[key].spent += typeof curr.spent === 'string' ? parseFloat(curr.spent) : curr.spent;
                acc[key].remaining_budget += typeof curr.remaining_budget === 'string' ? parseFloat(curr.remaining_budget) : curr.remaining_budget;
                acc[key].spend_to_finish += typeof curr.spend_to_finish === 'string' ? parseFloat(curr.spend_to_finish) : curr.spend_to_finish;
                acc[key].forecast += typeof curr.forecast === 'string' ? parseFloat(curr.forecast) : curr.forecast;
                acc[key].variance += typeof curr.variance === 'string' ? parseFloat(curr.variance) : curr.variance;
                acc[key].count += 1;
            }
            return acc;
        }, {} as Record<string, CostRow & { count: number }>);

        return Object.values(groupedData).map(item => ({
            ...item,
            id: item.id,
            cost_id: item.count > 1 ? `Multiple (${item.count})` : item.cost_id,
            remaining_budget: item.budget - item.spent,
            variance: item.budget - item.forecast
        }));
    }, [data, filterBy]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredAndAggregatedData];
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
    }, [filteredAndAggregatedData, sortConfig]);

    const requestSort = (key: keyof CostRow) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleEditClick = async (costId: number) => {
        try {
            const response = await api.get<CostRow>(`cost/${costId}/`);
            setEditingId(costId);
            setEditData(response.data);
        } catch (error) {
            console.error('Error fetching Cost details:', error);
            setSnackbarMessage('Error fetching Cost details');
            setSnackbarOpen(true);
        }
    };

    const handleSaveEdit = async () => {
        if (editData) {
            try {
                const response = await api.patch<EditApiResponse>(`cost/edit/${editData.id}/`, editData);
                setData(data.map(row => row.id === editData.id ? response.data.data : row));
                setEditingId(null);
                setEditData(null);
                setSnackbarMessage('Cost updated successfully');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error updating Cost:', error);
                setSnackbarMessage('Error updating Cost');
                setSnackbarOpen(true);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData(null);
    };

    const handleDeleteClick = (costId: number) => {
        setDeleteId(costId);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await api.delete(`cost/delete/${deleteId}/`);
                setData(data.filter(row => row.id !== deleteId));
                setSnackbarMessage('Cost deleted successfully');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error deleting Cost:', error);
                setSnackbarMessage('Error deleting Cost');
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
        setNewCost({ project: Number(id) });
    };

    const handleAddCost = async () => {
        try {
            const response = await api.post<CostRow>('cost/add/', newCost);
            setData([...data, response.data]);
            setSnackbarMessage('Cost added successfully');
            setSnackbarOpen(true);
            handleAddDialogClose();
        } catch (error) {
            console.error('Error adding Cost:', error);
            setSnackbarMessage('Error adding Cost');
            setSnackbarOpen(true);
        }
    };

    const handleInputChange = (field: keyof CostRow, value: string | number) => {
        if (editData) {
            const updatedEditData = { ...editData, [field]: value };

            // Automatic calculations
            if (field === 'budget' || field === 'spent') {
                updatedEditData.remaining_budget = updatedEditData.budget - updatedEditData.spent;
                updatedEditData.forecast = updatedEditData.spent + updatedEditData.spend_to_finish;
                updatedEditData.variance = updatedEditData.budget - updatedEditData.forecast;
            }

            setEditData(updatedEditData);
        }
    };

    const handleNewCostChange = (field: keyof CostRow, value: string | number) => {
        const updatedNewCost = { ...newCost, [field]: value };

        // Automatic calculations for new cost
        if (field === 'budget' || field === 'spent') {
            updatedNewCost.remaining_budget = (updatedNewCost.budget as number) - (updatedNewCost.spent as number);
            updatedNewCost.forecast = (updatedNewCost.spent as number) + (updatedNewCost.spend_to_finish as number);
            updatedNewCost.variance = (updatedNewCost.budget as number) - (updatedNewCost.forecast as number);
        }

        setNewCost(updatedNewCost);
    };

    const columns: (keyof CostRow)[] = ['id', 'category', 'group', 'budget', 'spent', 'remaining_budget'];

    const getColumnLabel = (key: string): string => {
        switch (key) {
            case 'remaining_budget':
                return 'Remaining Budget';
            case 'id':
                return 'Cost ID';
            default:
                return key.charAt(0).toUpperCase() + key.slice(1);
        }
    };

    const isNumericColumn = (key: string): boolean => {
        return ['budget', 'spent', 'remaining_budget', 'spend_to_finish', 'forecast', 'variance'].includes(key);
    };

    return (
        <Box className="p-8 min-h-screen bg-[#121212] text-white">
            <AppBar position="static" sx={{ mb: 2, ...glassStyle, boxShadow: 'none', height: '80px', minHeight: '40px' }}>
                <Toolbar variant="dense" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Costs
                    </Typography>
                    <Button onClick={() => navigate(`/projects/${id}`)} sx={{ ...glassStyle, '&:hover': { backgroundColor: 'rgba(5, 78, 90, 0.8)' } }}>
                        Back to Project
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                    <Button onClick={handleAddDialogOpen} style={{ ...glassStyle, marginRight: '10px' }}>
                        Add Cost
                    </Button>
                    <Button onClick={() => navigate(`/projects/${id}/cost-visualization`)} style={glassStyle}>
                        Cost Visualization
                    </Button>
                </div>
                <FormControl variant="filled" style={{ minWidth: 200 }}>
                    <InputLabel style={{ color: 'white' }}>Filter By</InputLabel>
                    <Select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        style={{ color: 'white', backgroundColor: 'rgba(40, 44, 52, 0.9)' }}
                    >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="category">Category</MenuItem>
                        <MenuItem value="group">Group</MenuItem>
                        <MenuItem value="category_and_group">Category and Group</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <div className="w-full">
                <table className="w-full border-collapse rounded-lg overflow-hidden" style={glassStyle}>
                    <thead>
                        <tr style={{ backgroundColor: 'rgba(5, 78, 90, 0.6)' }}>
                            <th className="p-2"></th>
                            {columns.map((key) => (
                                <th key={key} className="p-2" style={{ textAlign: isNumericColumn(key) ? 'center' : 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isNumericColumn(key) ? 'center' : 'space-between' }}>
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
                                                            onChange={(e) => handleInputChange(key, isNumericColumn(key) ? Number(e.target.value) : e.target.value)}
                                                            size="small"
                                                            InputProps={{ style: { color: 'white' } }}
                                                            type={isNumericColumn(key) ? 'number' : 'text'}
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
                                                <td key={key} className="p-2" style={{ textAlign: isNumericColumn(key) ? 'center' : 'left' }}>
                                                    {isNumericColumn(key) ? formatNumber(row[key] as number) : row[key]}
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
                                                                    Cost Details
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
                                                                        <Typography variant="subtitle2" color="text.secondary">Details</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.additional_comment || ''}
                                                                                onChange={(e) => handleInputChange('additional_comment', e.target.value)}
                                                                                size="small"
                                                                                multiline
                                                                                rows={4}
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{row.additional_comment}</Typography>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography variant="h6" gutterBottom sx={{ borderBottom: '2px solid #4a90e2', paddingBottom: '8px', marginBottom: '16px' }}>
                                                                    Financial Information
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Forecast</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.forecast || ''}
                                                                                onChange={(e) => handleInputChange('forecast', Number(e.target.value))}
                                                                                size="small"
                                                                                type="number"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{formatNumber(row.forecast)}</Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Spend To Finish</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.spend_to_finish || ''}
                                                                                onChange={(e) => handleInputChange('spend_to_finish', Number(e.target.value))}
                                                                                size="small"
                                                                                type="number"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{formatNumber(row.spend_to_finish)}</Typography>
                                                                        )}
                                                                    </Box>
                                                                    <Box>
                                                                        <Typography variant="subtitle2" color="text.secondary">Variance</Typography>
                                                                        {editingId === row.id ? (
                                                                            <TextField
                                                                                fullWidth
                                                                                value={editData?.variance || ''}
                                                                                onChange={(e) => handleInputChange('variance', Number(e.target.value))}
                                                                                size="small"
                                                                                type="number"
                                                                                sx={{ mt: 1, '& .MuiInputBase-input': { color: 'white' } }}
                                                                            />
                                                                        ) : (
                                                                            <Typography variant="body2">{formatNumber(row.variance)}</Typography>
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
                <DialogTitle sx={{ color: 'white' }}>Add New Cost</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={newCost.category || ''}
                                onChange={(e) => handleNewCostChange('category', e.target.value)}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Group"
                                value={newCost.group || ''}
                                onChange={(e) => handleNewCostChange('group', e.target.value)}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Budget"
                                type="number"
                                value={newCost.budget || ''}
                                onChange={(e) => handleNewCostChange('budget', Number(e.target.value))}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Spent"
                                type="number"
                                value={newCost.spent || ''}
                                onChange={(e) => handleNewCostChange('spent', Number(e.target.value))}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Spend To Finish"
                                type="number"
                                value={newCost.spend_to_finish || ''}
                                onChange={(e) => handleNewCostChange('spend_to_finish', Number(e.target.value))}
                                margin="normal"
                                InputLabelProps={{ style: { color: 'white' } }}
                                InputProps={{ style: { color: 'white' } }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} sx={{ color: 'white' }}>Cancel</Button>
                    <Button onClick={handleAddCost} sx={{ color: 'white' }}>Add Cost</Button>
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
                        Are you sure you want to delete this Cost?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} style={{ color: 'white' }}>Cancel</Button>
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

export default Costs;