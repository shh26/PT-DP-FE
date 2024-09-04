import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Autocomplete,
  SelectChangeEvent,
  CircularProgress,
  Popper
} from '@mui/material';
import { TrashIcon } from '@heroicons/react/24/outline';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

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

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#CED9D7' },
    '&:hover fieldset': { borderColor: '#CED9D7' },
    '&.Mui-focused fieldset': { borderColor: '#CED9D7' },
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontSize: '1.1rem',
    transform: 'translate(14px, -9px) scale(0.75)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
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
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#CED9D7', borderWidth: '1px' },
  '&.Mui-focused .MuiSelect-icon': { color: '#CED9D7' },
  '& .MuiChip-root': { color: 'white' },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontSize: '1.1rem',
    transform: 'translate(14px, -9px) scale(0.75)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  },
};

interface OpportunityFormProps {
  formData: {
    name: string;
    description: string;
    process_owner: string;
    status: string;
    strategy_alignment_score: string;
    financial_return_score: string;
    delivery_success_score: string;
    overall_score: string;
    sponsor: string;
    service_technology_center: { value: string; label: string }[];
    estimated_capex_cost: string;
    estimated_opex_cost: string;
    business_benefit_value: string;
    current_pain_point_and_issue: string;
    estimated_cost_saving: string
    estimated_hours: string;
    division_type: string
    estimated_revenue_generation: string
  };
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
    newValue?: any
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete?: () => void;
  handleSaveAsDraft: () => void;
  handleServiceTechnologyCenterChange: (newValue: { value: string; label: string }[]) => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({ formData, handleChange, handleSubmit, handleDelete, handleSaveAsDraft, handleServiceTechnologyCenterChange }) => {
  const {user,isAuthenticated,loading}=useAuth()
  const { id } = useParams()
  const [localFormData, setLocalFormData] = useState(formData);
  const [openDialog, setOpenDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [infoDialogContent, setInfoDialogContent] = useState('');
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement | { name?: any; value: unknown }> | { name: any; value: unknown }) => {
    const { name, value } = 'target' in e ? e.target : e;
    setLocalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };



  const fetchDraft = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/opportunity/list/?page=1&limit=10&status=draft');
      const draftData = response.data.results[0];
      console.log(draftData, '??????????draft')
      Object.keys(draftData).forEach((key) => {
        handleLocalChange({ name: key, value: draftData[key] });
      });
    } catch (error) {
      console.error('Error fetching draft:', error);
    }
  };

 useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        await fetchDraft();
      }
      setIsLoading(false);
    };

    fetchData();
  }, [user, isAuthenticated, loading]);

  if (loading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }



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

  const serviceTechnologyCentreOptions = [
    { value: 'chandler', label: 'Chandler' },
    { value: 'loyang', label: 'Loyang' },
    { value: 'nogales', label: 'Nogales' },
    { value: 'brno', label: 'Brno' },
    { value: 'dublin', label: 'Dublin' },
    { value: 'korea', label: 'Korea' },
    { value: 'langfang', label: 'Langfang' },
    { value: 'xian', label: 'Xian' },
    { value: 'ina', label: 'Ina' },
    { value: 'shanghai', label: 'Shanghai' },
    { value: 'q-g', label: 'Q-G' },
    { value: 'jhunan', label: 'Jhunan' },
    { value: 'shenzhen', label: 'Shenzhen' },
  ];

  const getInfoDialogContent = (field: string) => {
    switch (field) {
      case "Title":
        return (
          <Typography>
            The title should be a brief, descriptive name for the opportunity. It should be clear and concise, giving a quick idea of what the opportunity is about.
          </Typography>
        );
      case "Description":
        return (
          <Typography>
            Provide a detailed explanation of the opportunity and describe what you want to achieve.
          </Typography>
        );
      case "Process Owner":
        return (
          <Typography>
            The Process Owner is the individual responsible for the end-to-end management of the opportunity.
          </Typography>
        );
      case "Sponsor":
        return (
          <Typography>
            The opportunity sponsor is the senior executive that supports the opportunity and has a vested interest in securing a project to conduct the work. This may be a General Manager or another suitable individual.
          </Typography>
        );
      case "Service Technology Center":
        return (
          <Typography>
            Please select the service technology centre that this opportunity applies to. If it applies to all STCs, then please select the option named 'select all'.
          </Typography>
        );
      case "Business Benefits and Value":
        return (
          <Typography>
            <ul>
              Describe the potential positive outcomes and advantages that this opportunity could bring to the organization. This could include financial benefits, operational improvements, strategic benefits, or any other value propositions. When thinking about benefits, think about the following factors:
            </ul><br />
            <li>1. Nurturing a great people experience</li>
            <li>2. Lead on the environment</li>
            <li>3. Innovate for the future</li>
            <li>4. Embed customer centrity</li>
            <li>5. Improve efficiency</li><br />
          </Typography>
        );
      case "Current Pain Points and Issues":
        return (
          <Typography>
            Outline the existing problems, challenges, or inefficiencies that this opportunity aims to address. Be specific about how these issues are impacting the business currently.
          </Typography>
        );
      case "Estimated Cost Saving":
        return (
          <Typography>
            Provide an estimate of the potential cost savings that could be realized by implementing this opportunity. This should be based on careful analysis and reasonable assumptions. If you are unsure of the cost saving, then please leave as blank.
          </Typography>
        );
        case "Estimated Revenue Generation":
          return (
            <Typography>
              Please enter the expected revenue generation for this opportunity. If you are unsure, please leave the value as blank.
            </Typography>
          );
      case "Strategy Alignment Score":
        return (
          <>
            <Typography variant="h6">Scoring Criteria for Strategy Alignment Score</Typography><br />
            <ul>
              <li><strong>Instructions</strong>: When attempting to provide a strategy alignment score, you must assess the strength of the opportunity against five key objectives from the OGSM. These five key factors are:</li><br />
            </ul><br />
            <li>1. Nurture a great people experience</li>
            <li>2. Lead on the environment</li>
            <li>3. Innovate for the future</li>
            <li>4. Embed customer centrity</li>
            <li>5. Improve efficiency</li><br />

            <ul>
              <li>If your opportunity aligns with 2 or less of the points above, then give it a strategy alignment score between 0-39.</li><br />
              <li>If your opportunity aligns with 3 of the points above, then give it a strategy alignment score between 40-69.</li><br />
              <li>If your opportunity aligns with 4 or more of the points above, then give it a strategy alignment score of 70 or above.</li><br />
            </ul>

            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>0-39: Low Alignment</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity has limited alignment with the organization's strategic goals and objectives.</li><br />
              <li><strong>Implications</strong>: The idea has some potential but requires significant modifications to fit within strategic priorities. It may receive conditional support or be redirected to align better, and considerable effort is needed to justify its alignment and potential benefits.</li>
            </ul><br />

            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>40-69: Moderate Alignment</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity aligns reasonably well with the organization's strategic goals and objectives.</li><br />
              <li><strong>Implications</strong>: The idea supports some aspects of the strategy but might not be a top priority. It is likely to receive support but may need further refinement. It has a clear path to alignment with some adjustments.</li><br />
            </ul>
            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>70-100: High Alignment</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity is perfectly or near-perfectly aligned with the organization's strategic goals and objectives.</li><br />
              <li><strong>Implications</strong>: The idea is a top priority and is seen as critical to achieving strategic objectives and It will receive immediate and full support, including resources and executive sponsorship. The idea is expected to deliver significant strategic benefits with high confidence</li>
              <br />
            </ul>
          </>
        );
      case "Financial Return Score":
        return (
          <>
            <Typography variant="h6">Scoring Criteria for Financial Return Score</Typography><br />
            <ul>
              <li><strong>Instructions</strong>: When attempting to provide a financial return score, you must assess the strength of the opportunity against the return on investment.</li><br />
            </ul>

            <li> If the return on investment is less than 1 year, give a financial return score between 70-100</li><br />
            <li>If the return on investment is between 1 and 3 years, give a financial return score between 40-69 </li><br />
            <li>If the return on investment is over 3 years, give a financial return score between 0-39 </li><br />
           


            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>0-39: Low Financial Return</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity is expected to generate limited financial return.</li><br />
              <li><strong>Implications</strong>: Modest impact on revenue or profitability. May be pursued if it aligns well with other strategic objectives or has potential for long-term gains. Requires careful consideration and justification.</li>
            </ul><br />
            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>40-69: Moderate Financial Return</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity is expected to generate a moderate financial return.</li><br />
              <li><strong>Implications</strong>: Reasonable impact on revenue or profitability. Likely to be pursued as part of a balanced portfolio of initiatives. Attractive if it complements other strategic initiatives or has potential for growth. </li>
            </ul><br />

            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>70-100: High Financial Return</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity is expected to generate high financial return.</li><br />
              <li><strong>Implications</strong>: Major positive impact on revenue or profitability. Top priority for investment and resource allocation. Expected to deliver substantial financial benefits and ROI.</li>
            </ul><br />
          </>
        );
      case "Delivery Success Score":
        return (
          <>
            <Typography variant="h6">Scoring Criteria for Delivery Success Score</Typography><br />
            <ul>
              <li><strong>Instructions</strong>: When attempting to provide a delivery success score, you must speak to the team that will deliver the solution/product. The team must assess if the solution can be developed by the team or by partnering teams. This is not an assessment of capacity or resource availability, but rather an assessment of capability. </li><br />
            </ul>

            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>0-39: Low Delivery Success</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity has a low likelihood of successful delivery.</li><br />
              <li><strong>Implications</strong>: Considerable risks and challenges, though some may be manageable. Requires careful planning, additional resources, and contingency plans. Moderate to high probability of delays or partial failure.</li>
            </ul><br />
            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>40-69: Moderate Delivery Success</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity has a moderate likelihood of being successfully delivered.</li><br />
              <li><strong>Implications</strong>: Some risks and challenges that can be managed with appropriate planning and resources. Balanced probability of success and manageable delays or issues.</li>
            </ul><br />

            <Typography variant="subtitle1" style={{ color: "#E1B77E" }}><strong>70-100: High Delivery Success</strong></Typography><br />
            <ul>
              <li><strong>Description</strong>: The opportunity has a high likelihood of being successfully delivered.</li><br />
              <li><strong>Implications</strong>: Minimal risks and challenges, and easily manageable.</li>
            </ul><br />
          </>
        );
      default:
        return <Typography>No information available for this field.</Typography>;
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
              <span style={{ color: 'white' }}>Opportunity</span>
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
                    onChange={handleChange}
                    required
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Title")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="process_owner"
                    label="Process Owner"
                    fullWidth
                    variant="outlined"
                    value={formData.process_owner}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Process Owner")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="sponsor"
                    label="Sponsor"
                    fullWidth
                    variant="outlined"
                    value={formData.sponsor}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Sponsor")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                <Autocomplete
        multiple
        id="general-manager-autocomplete"
        options={[{ value: 'selectAll', label: 'Select All' }, ...serviceTechnologyCentreOptions]}
        getOptionLabel={(option) => option.label}
        value={
          selectAllChecked
            ? serviceTechnologyCentreOptions
            : formData.service_technology_center || []
        }
        onChange={(event, newValue) => {
          const selectAllOption = newValue.find((option) => option.value === 'selectAll');

          if (selectAllOption && !selectAllChecked) {
            handleServiceTechnologyCenterChange(serviceTechnologyCentreOptions);
            setSelectAllChecked(true);
          } else if (selectAllChecked) {
            handleServiceTechnologyCenterChange([]);
            setSelectAllChecked(false);
          } else {
            const filteredOptions = newValue.filter((option) => option.value !== 'selectAll');
            handleServiceTechnologyCenterChange(filteredOptions);
            setSelectAllChecked(filteredOptions.length === serviceTechnologyCentreOptions.length);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            name="service_technology_center"
            label="Service Technology Center"
            fullWidth
            variant="outlined"
            sx={inputStyle}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {params.InputProps.endAdornment}
                  <InputAdornment position="end">
                    <IconButton onClick={() => handleOpenInfoDialog("Service Technology Center")}>
                      <InfoIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
            }}
          />
        )}
        sx={{
          ...selectStyle,
          '& .MuiAutocomplete-tag': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
          },
          '& .MuiAutocomplete-input': {
            color: 'white',
          },
        }}
        renderOption={(props, option) => (
          <li {...props} style={{ color: 'black' }}>
            {option.label}
          </li>
        )}
        PopperComponent={(props) => (
          <Popper {...props} sx={{
            '& .MuiPaper-root': {
              backgroundColor: 'white',
              color: 'black',
            },
          }} />
        )}
      />

              </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="description"
                    label="Description"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Description")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="business_benefit_value"
                    label="Business Benefits and Value"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.business_benefit_value}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Business Benefits and Value")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="current_pain_point_and_issue"
                    label="Current Pain Points and Issues"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={4}
                    value={formData.current_pain_point_and_issue}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Current Pain Points and Issues")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {!id && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel sx={{ color: 'white', fontSize: '1.1rem' }}>Status</InputLabel>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        label="Status"
                        sx={selectStyle}
                        disabled={!id}
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Converted">Converted</MenuItem>
                        <MenuItem value="Rejected">Rejected</MenuItem>
                        <MenuItem value="Planning">Planning</MenuItem>
                        <MenuItem value="Revisit">Revisit</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {(user?.role === 'admin' || user?.role === 'superadmin') && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="estimated_hours"
                        label="Estimated Hours"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={formData.estimated_hours}
                        onChange={handleChange}
                        sx={inputStyle}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <TextField
                        name="estimated_capex_cost"
                        label="Estimated Capex Cost"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={formData.estimated_capex_cost}
                        onChange={handleChange}
                        sx={inputStyle}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        name="estimated_opex_cost"
                        label="Estimated Opex Cost"
                        fullWidth
                        variant="outlined"
                        type="number"
                        value={formData.estimated_opex_cost}
                        onChange={handleChange}
                        sx={inputStyle}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid> */}
                  </>
                )}

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="strategy_alignment_score"
                    label="Strategy Alignment Score"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={formData.strategy_alignment_score}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Strategy Alignment Score")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="financial_return_score"
                    label="Financial Return Score"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={formData.financial_return_score}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Financial Return Score")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="delivery_success_score"
                    label="Delivery Success Score"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={formData.delivery_success_score}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Delivery Success Score")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="estimated_cost_saving"
                    label="Estimated Cost Saving"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={formData.estimated_cost_saving}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Estimated Cost Saving")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="estimated_revenue_generation"
                    label="Estimated Revenue Generation"
                    fullWidth
                    variant="outlined"
                    type="number"
                    value={formData.estimated_revenue_generation}
                    onChange={handleChange}
                    sx={inputStyle}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleOpenInfoDialog("Estimated Revenue Generation")}>
                            <InfoIcon sx={{ color: 'white' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleLocalSaveAsDraft}
                  sx={{ backgroundColor: '#E1B77E', color: '#054E5A', '&:hover': { backgroundColor: '#c49e6e' } }}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ backgroundColor: '#CED9D7', color: '#054E5A', '&:hover': { backgroundColor: '#b9c5c3' } }}
                >
                  Submit
                </Button>
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
            Your draft form has successfully been saved
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} sx={{ color: 'black', backgroundColor: '#E1B77E', '&:hover': { backgroundColor: '#b9c5c3' } }}>
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
            maxHeight: '80vh',
            overflowY: 'auto',
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
          {getInfoDialogContent(infoDialogContent)}
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default OpportunityForm;