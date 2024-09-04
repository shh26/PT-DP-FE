import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ThemeProvider,
  createTheme,
  IconButton,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  Edit,
  Delete,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { useToastr } from '../context/ToasterContext';



const theme = createTheme({
  palette: {
    primary: {
      main: '#054E5A',
    },
    secondary: {
      main: '#CED9D7',
    },
  },
});

const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const appBarStyle = {
  ...glassStyle,
  boxShadow: 'none',
  height: '80px',
  minHeight: '40px',
  '& .MuiToolbar-root': {
    minHeight: '40px',
    height: '100%',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
};

const buttonStyle = {
  backgroundColor: '#CED9D7',
  color: '#054E5A',
  '&:hover': { backgroundColor: '#b9c5c3' }
};

const userItemStyle = {
  ...glassStyle,
  marginBottom: '16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#CED9D7' },
    '&:hover fieldset': { borderColor: '#CED9D7' },
    '&.Mui-focused fieldset': { borderColor: '#CED9D7' },
  },
  '& .MuiInputLabel-root': { color: 'white' },
  '& .MuiInputBase-input': { color: 'white' },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#CED9D7',
    borderWidth: '1px',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'white',
  },
};

const selectStyle = {
  color: 'white',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7', borderWidth: '1px' },
  '&.Mui-focused .MuiSelect-icon': { color: '#CED9D7' },
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '', role: '' });
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState('');
  const { showToast } = useToastr();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await userApi.getUsers(10, 1);
    setUsers(response?.results);
  };

  const handleOpen = (user = null) => {
    setEditingUser(user);
    setFormData(user || { first_name: '', last_name: '', email: '', password: '', role: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
    setFormData({ first_name: '', last_name: '', email: '', password: '', role: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingUser) {
      console.log(formData,'formdata>>>>>>>>>>>>>>>user')
      const response = await userApi.updateUser(formData);
      if (response.status === 200) {
        showToast('User updated successfully', 'success');
      }
    } else {
      const response = await userApi.addUser(formData);
      if (response.status === 201) {
        showToast('User created Successfully', 'success');
      }
    }
    fetchUsers();
    handleClose();
  };

  const handleDelete = async (id) => {
    const response = await userApi.deleteUser(id);
    if (response.status === 200) {
      showToast('User deleted Successfully', 'success');
    }
    fetchUsers();
  };

  const handleOpenInfoDialog = (content) => {
    setInfoDialogContent(content);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const getInfoDialogContent = (field) => {
    switch (field) {
      case "First Name":
        return "Enter the user's first name.";
      case "Last Name":
        return "Enter the user's last name.";
      case "Email":
        return "Enter a valid email address for the user. This will be used for login and communication.";
      case "Password":
        return "Create a strong password for the user. It should include a mix of uppercase and lowercase letters, numbers, and special characters.";
      case "Role":
        return "Select the appropriate role for the user. This determines their access level and permissions within the system.";
      default:
        return "No information available for this field.";
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="p-8 min-h-screen bg-[#121212] text-white">
        <AppBar position="static" sx={appBarStyle}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              <span style={{ color: 'white' }}>User</span>
              <span style={{ color: '#E1B77E' }}> Management</span>
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              onClick={() => handleOpen()}
              sx={buttonStyle}
            >
              Add User
            </Button>
          </Box>
          {users.map((user) => (
            <Box key={user.id} sx={userItemStyle}>
              <Box>
                <Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>
                <Typography variant="body2" sx={{ color: '#CED9D7' }}>{`${user.email} - ${user.role}`}</Typography>
              </Box>
              <Box>
                <IconButton onClick={() => handleOpen(user)} sx={{ color: '#CED9D7' }}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(user.id)} sx={{ color: '#CED9D7' }}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#054E5A',
            color: 'white',
            minWidth: '500px',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
          {editingUser ? 'Edit User' : 'Add User'}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                value={formData.first_name}
                onChange={handleInputChange}
                sx={inputStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleOpenInfoDialog("First Name")}>
                        <InfoIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="last_name"
                label="Last Name"
                type="text"
                fullWidth
                value={formData.last_name}
                onChange={handleInputChange}
                sx={inputStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleOpenInfoDialog("Last Name")}>
                        <InfoIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                sx={inputStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleOpenInfoDialog("Email")}>
                        <InfoIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                sx={inputStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleOpenInfoDialog("Password")}>
                        <InfoIcon sx={{ color: 'white' }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel sx={{ color: 'white' }}>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Role"
                  sx={selectStyle}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Superadmin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
          <Button onClick={handleClose} sx={{ ...buttonStyle, marginRight: '8px' }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} sx={buttonStyle}>
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        PaperProps={{
          style: {
            backgroundColor: '#054E5A',
            color: 'white',
            minWidth: '300px',
            minHeight: '150px',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
          {infoDialogContent}
          <IconButton
            aria-label="close"
            onClick={handleCloseInfoDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>{getInfoDialogContent(infoDialogContent)}</Typography>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default UserList;