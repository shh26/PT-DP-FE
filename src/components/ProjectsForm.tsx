import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  createTheme,
  ThemeProvider,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Autocomplete,Chip,
  SelectChangeEvent
} from '@mui/material';
import { TrashIcon } from '@heroicons/react/24/outline';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

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





interface ProjectsFormProps {
  formData: {
    id?: number;
    name: string;
    description: string;
    objective: string;
    type: string;
    product_owner: string;
    lead_developer: string;
    project_sponsor: string;
    project_manager: string;
    general_manager: string[];
    development_sponsor: string;
    baseline_delivery_date: string;
    actual_delivery_date: string;
    status: string;
    scope: string;
    cost: string;
    quality: string;
    time: string;
    start_date: string;
    created_at: string;
    updated_at: string;
    opportunity?: number | null;
    created_by?: string | null;
    team_member: any[];
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
    newValue?: any
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete?: () => void;
  handleSaveAsDraft: () => void;
  users: { id: number; first_name: string; last_name: string; email: string }[];
}
  





const ProjectsForm: React.FC<ProjectsFormProps> = ({ formData, handleChange, handleSubmit, handleDelete, handleSaveAsDraft,users }) => {
  console.log(users,'???????all users')
  console.log(formData,'?????????formdata')
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState('');
  const division = localStorage.getItem('division') || '';
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
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, -6px) scale(0.75)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
  };

  const selectStyle = {
    color: 'white',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7', borderWidth: '1px' },
    '&.Mui-focused .MuiSelect-icon': { color: '#CED9D7' },
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, -6px) scale(0.75)',
      '&.MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
    },
  };
  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(event, event.target.value);
  };
  
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    handleChange(event, event.target.value);
  };
  const handleLocalSaveAsDraft = () => {
    handleSaveAsDraft();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenInfoDialog = (content: string) => {
    setInfoDialogContent(content);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const generalManagerOptions = [
    { value: 'gm1', label: 'General Manager 1' },
    { value: 'gm2', label: 'General Manager 2' },
    { value: 'gm3', label: 'General Manager 3' },
  ];



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
              <span style={{ color: 'white' }}>Project</span>
              <span style={{ color: '#E1B77E' }}> Form</span>
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ ...glassStyle, mt: 2 }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="name"
                    label="Title"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleTextFieldChange}
                    required
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                  
                </Grid>
                    {division==='VSS'?(
                      <>
                       <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleSelectChange}
                      label="Type"
                      sx={selectStyle}
                    >
                      <MenuItem value="Data">Data</MenuItem>
                      <MenuItem value="Application">Application</MenuItem>
                      <MenuItem value="Application and Data">Application and Data</MenuItem>
                    </Select>
                  </FormControl>
                </Grid></>):(
                <>  <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleSelectChange}
                    label="Type"
                    sx={selectStyle}
                  >
                    <MenuItem value="Strategic Facility Projects">Strategic Facility Projects</MenuItem>
                    <MenuItem value="Regional Projects">Regional Projects</MenuItem>
                  </Select>
                </FormControl>
              </Grid></>)}
              
               
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="objective"
                    label="Scope and Objectives"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.objective}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
               

                {division=='VSS'?(
                  <>
                  <Grid item xs={12} sm={6}>
                  <TextField
                    name="product_owner"
                    label="Product Owner"
                    fullWidth
                    variant="outlined"
                    value={formData.product_owner}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lead_developer"
                    label="Lead Developer"
                    fullWidth
                    variant="outlined"
                    value={formData.lead_developer}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="project_sponsor"
                    label="Project Sponsor"
                    fullWidth
                    variant="outlined"
                    value={formData.project_sponsor || ''}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid></>):(<><Grid item xs={12} sm={6}>
                  <TextField
                    name="project_manager"
                    label="Project Manager"
                    fullWidth
                    variant="outlined"
                    value={formData.project_manager || ''}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
               <Autocomplete
  multiple
  id="general-manager-autocomplete"
  options={generalManagerOptions}
  getOptionLabel={(option: string | { value: string; label: string }) => 
    typeof option === 'string' ? option : option.label
  }
  value={formData.general_manager.map(gm => 
    generalManagerOptions.find(opt => opt.value === gm) || { value: gm, label: gm }
  )}
  onChange={(event, newValue: Array<string | { value: string; label: string }>) => {
    const values = newValue.map(item => typeof item === 'string' ? item : item.value);
    handleChange({ target: { name: 'general_manager', value: values } } as any, values);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      name="general_manager"
      label="General Manager"
      fullWidth
      variant="outlined"
      sx={inputStyle}
      InputLabelProps={{ shrink: true }}
    />
  )}
  renderOption={(props, option: { value: string; label: string }) => (
    <li {...props}>{option.label}</li>
  )}
  isOptionEqualToValue={(option: { value: string; label: string }, value: string | { value: string; label: string }) => {
    if (typeof value === 'string') {
      return option.value === value;
    } else {
      return option.value === value.value;
    }
  }}
  
/>

                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="development_sponsor"
                    label="Development Sponsor"
                    fullWidth
                    variant="outlined"
                    value={formData.development_sponsor || ''}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                </>
                )}
                



                
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="baseline_delivery_date"
                    label="Baseline Delivery Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formData.baseline_delivery_date}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="actual_delivery_date"
                    label="Actual Delivery Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formData.actual_delivery_date}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleSelectChange}
                      label="Status"
                      sx={selectStyle}
                    >
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Scope</InputLabel>
                    <Select
                      name="scope"
                      value={formData.scope}
                      onChange={handleSelectChange}
                      label="Scope"
                      sx={selectStyle}
                    >
                       <MenuItem value="A">Amber</MenuItem>
                      <MenuItem value="G">Green</MenuItem>
                      <MenuItem value="R">Red</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Cost</InputLabel>
                    <Select
                      name="cost"
                      value={formData.cost}
                      onChange={handleSelectChange}
                      label="Cost"
                      sx={selectStyle}
                    >
                      <MenuItem value="A">Amber</MenuItem>
                      <MenuItem value="G">Green</MenuItem>
                      <MenuItem value="R">Red</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Quality</InputLabel>
                    <Select
                      name="quality"
                      value={formData.quality}
                      onChange={handleSelectChange}
                      label="Quality"
                      sx={selectStyle}
                    >
                      <MenuItem value="A">Amber</MenuItem>
                      <MenuItem value="G">Green</MenuItem>
                      <MenuItem value="R">Red</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel sx={{ color: 'white', transform: 'translate(14px, -6px) scale(0.75)' }}>Time</InputLabel>
                    <Select
                      name="time"
                      value={formData.time}
                      onChange={handleSelectChange}
                      label="Time"
                      sx={selectStyle}
                    >
                       <MenuItem value="A">Amber</MenuItem>
                      <MenuItem value="G">Green</MenuItem>
                      <MenuItem value="R">Red</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="start_date"
                    label="Start Date"
                    type="date"
                    fullWidth
                    variant="outlined"
                    value={formData.start_date}
                    onChange={handleTextFieldChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                <Autocomplete
  multiple
  id="team-member"
  options={users}
  getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
  value={formData.team_member || []}
  onChange={(event, newValue) => {
    handleChange({ target: { name: 'team_member', value: newValue } } as any, newValue);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      variant="outlined"
      label="Team Members"
      placeholder="Select team members"
      sx={inputStyle}
    />
  )}
  renderTags={(value, getTagProps) => {

    return value.map((option, index) => (
      <Chip
        variant="outlined"
        label={`${option.first_name} ${option.last_name}`}
        {...getTagProps({ index })}
        sx={{
          color: 'white', 
        }}
      />
    ));
  }}
/>
</Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={() => navigate('/projects')}
                  sx={{ backgroundColor: '#CED9D7', color: '#054E5A', '&:hover': { backgroundColor: '#b9c5c3' } }}
                >
                  Back to Projects
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: '#CED9D7', color: '#054E5A', '&:hover': { backgroundColor: '#b9c5c3' } }}
                >
                  Submit
                </Button>
                {/* <Button
                  variant="contained"
                  onClick={handleLocalSaveAsDraft}
                  sx={{ backgroundColor: '#E1B77E', color: '#054E5A', '&:hover': { backgroundColor: '#c49e6e' } }}
                >
                  Save as Draft
                </Button> */}
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          style: {
            backgroundColor: '#054E5A',
            color: 'white',
            minWidth: '300px',
            minHeight: '150px',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '1.5rem' }}>Success</DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
            Your project has successfully been saved as a draft
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'white', backgroundColor: '#CED9D7', '&:hover': { backgroundColor: '#b9c5c3' } }}>
            Close
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
            minWidth: '400px',
            minHeight: '200px',
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
          <Typography sx={{ textAlign: 'center', fontSize: '1.2rem' }}>
            Information about {infoDialogContent}
          </Typography>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );

};

export default ProjectsForm;