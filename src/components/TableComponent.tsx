import React, { useState, useMemo } from 'react';
import {
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TextField, Button, Snackbar, Collapse, Box, Typography, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon, KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';

interface TableRowData {
  id: number;
  risk_id: string;
  name: string;
  created_at: string;
  probability: number;
  impact: number;
  risk_level: number;
  risk_owner: string;
  category: string;
  source: string;
  description: string;
  risk_response: string;
}

const TableComponent: React.FC<{
  data: TableRowData[],
  onEdit: (id: number, newData: TableRowData) => void,
  onDelete: (id: number) => void,
  onAdd: () => void
}> = ({ data, onEdit, onDelete, onAdd }) => {

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<TableRowData | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRowData; direction: 'ascending' | 'descending' } | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const requestSort = (key: keyof TableRowData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const sortableItems = [...data];
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

  const handleEditClick = (row: TableRowData) => {
    setEditingId(row.id);
    setEditData(row);
  };

  const handleSaveEdit = () => {
    if (editData) {
      onEdit(editData.id, editData);
      setEditingId(null);
      setEditData(null);
      setSnackbarMessage('Edit saved successfully.');
      setSnackbarOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleChange = (field: keyof TableRowData, value: any) => {
    if (editData) {
      setEditData({ ...editData, [field]: value });
    }
  };

  const handleRowExpandCollapse = (rowId: number) => {
    if (expandedRow === rowId) {
      setExpandedRow(null);
    } else {
      setExpandedRow(rowId);
      const row = data.find(item => item.id === rowId);
      if (row) {
        const message = [
          row.description && `Description: ${row.description}`,
          row.source && `Source: ${row.source}`,
          row.risk_response && `Risk Response: ${row.risk_response}`
        ].filter(Boolean).join(' | ');

        setSnackbarMessage(message);
        setSnackbarOpen(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    console.log(id,'this is id')
    setDeleteId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
        console.log(deleteId,'????????')
      onDelete(deleteId);
      setDeleteConfirmOpen(false);
      setDeleteId(null);
      setSnackbarMessage('Delete successful.');
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#2e3239', color: '#ffffff' }}>
            <TableRow>
              <TableCell sx={{ width: '50px', color: '#ffffff' }}>
                <IconButton size="small">
                  <KeyboardArrowDownIcon sx={{ color: '#ffffff' }} />
                </IconButton>
              </TableCell>
              {['risk_id', 'name', 'probability', 'impact', 'risk_level', 'risk_owner'].map(key => (
                <TableCell key={key} sx={{ color: '#ffffff', backgroundColor: '#2e3239' }}>
                  <TableSortLabel
                    active={sortConfig?.key === key}
                    direction={sortConfig?.direction === 'ascending' ? 'asc' : 
                      sortConfig?.direction === 'descending' ? 'desc' : 
                      'asc'}
                    onClick={() => requestSort(key as keyof TableRowData)}
                    sx={{ color: '#ffffff' }}
                  >
                    {key.replace('_', ' ').toUpperCase()}
                    {sortConfig?.key === key ? (
                      sortConfig.direction === 'ascending' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ width: '180px', color: '#ffffff' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map(row => (
              <React.Fragment key={row.id}>
                <TableRow
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                    '&:hover': {
                      backgroundColor: '#2e3239',
                    },
                  }}
                >
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleRowExpandCollapse(row.id)}
                    >
                      {expandedRow === row.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                  </TableCell>
                  {['id', 'name', 'probability', 'impact', 'risk_level', 'risk_owner'].map(key => (
                     <TableCell key={key}>
                     {key === 'id' ? (
                       row[key as keyof TableRowData]
                     ) : editingId === row.id ? (
                       <TextField
                         value={editData?.[key] || ''}
                         onChange={(e) => handleChange(key as keyof TableRowData, e.target.value)}
                         size="small"
                         variant="outlined"
                         fullWidth
                         sx={{ '& .MuiInputBase-root': { color: 'black', borderColor: 'rgba(0, 0, 0, 0.12)' } }}
                       />
                     ) : (
                       row[key as keyof TableRowData]
                     )}
                   </TableCell>
                  ))}
                  <TableCell sx={{ display: 'flex', gap: 1 }}>
                    {editingId === row.id ? (
                      <>
                        <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
                        <Button onClick={handleCancelEdit} variant="outlined" color="secondary">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleEditClick(row)} variant="contained" color="primary">Edit</Button>
                        <Button onClick={() => handleDeleteClick(row.id)} variant="outlined" color="error">Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
                {expandedRow === row.id && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={expandedRow === row.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, backgroundColor: '#E1B77E', color: 'black', padding: '10px', borderRadius: '4px' }}>
                          <Grid container spacing={2}>
                            {['description', 'source', 'risk_response'].map((key) => (
                              <Grid item xs={key === 'description' ? 12 : 6} key={key}>
                                <Typography variant="subtitle2" gutterBottom component="div">
                                  {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                                </Typography>
                                {editingId === row.id ? (
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editData?.[key as keyof TableRowData] || ''}
                                    onChange={(e) => handleChange(key as keyof TableRowData, e.target.value)}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body2" gutterBottom component="div">
                                    {row[key as keyof TableRowData] || 'N/A'}
                                  </Typography>
                                )}
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this decision?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableComponent;
