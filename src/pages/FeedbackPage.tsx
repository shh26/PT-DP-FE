import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Rating,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  createTheme,
  ThemeProvider,
  Container,
  Alert,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import {api} from '../api/index'

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
  boxShadow: 'none',
  height: '80px',
  minHeight: '40px',
  '& .MuiToolbar-root': {
    minHeight: '40px',
    height: '100%',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};

const FeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [feedbackExists, setFeedbackExists] = useState(false);
  const [ratings, setRatings] = useState({
    clarity_of_communication: 0,
    responsiveness: 0,
    collaboration: 0,
    deliverable_quality: 0,
    attention_to_detail: 0,
    testing_and_validation: 0,
    adherence_to_deadlines: 0,
    time_management: 0,
    knowledge_and_skills: 0,
    problem_solving: 0,
    overall_satisfaction: 0,
    expectations_met: 0,
    planning_and_organization: 0,
    risk_management: 0,
    flexibility: 0,
    post_implementation_support: 0,
    training_and_documentation: 0,
  });

  const [textFields, setTextFields] = useState({
    business_impact: '',
    efficiency_improvement: '',
    user_adoption: '',
    areas_for_improvement: '',
    additional_comments: '',
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoringGuideOpen, setScoringGuideOpen] = useState(false);
  const [error, setError] = useState('');
  const [feedbackId,setFeedbackId]=useState(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(`feedback/list?page=1&limit=10&project=${id}`);
        const data = response.data.results[0];
        
        if (data) {
          setFeedbackExists(true);
          setFeedbackId(data.id)
          setRatings({
            clarity_of_communication: data.clarity_of_communication || 0,
            responsiveness: data.responsiveness || 0,
            collaboration: data.collaboration || 0,
            deliverable_quality: data.deliverable_quality || 0,
            attention_to_detail: data.attention_to_detail || 0,
            testing_and_validation: data.testing_and_validation || 0,
            adherence_to_deadlines: data.adherence_to_deadlines || 0,
            time_management: data.time_management || 0,
            knowledge_and_skills: data.knowledge_and_skills || 0,
            problem_solving: data.problem_solving || 0,
            overall_satisfaction: data.overall_satisfaction || 0,
            expectations_met: data.expectations_met || 0,
            planning_and_organization: data.planning_and_organization || 0,
            risk_management: data.risk_management || 0,
            flexibility: data.flexibility || 0,
            post_implementation_support: data.post_implementation_support || 0,
            training_and_documentation: data.training_and_documentation || 0,
          });

          setTextFields({
            business_impact: data.business_impact || '',
            efficiency_improvement: data.efficiency_improvement || '',
            user_adoption: data.user_adoption || '',
            areas_for_improvement: data.areas_for_improvement || '',
            additional_comments: data.additional_comments || '',
          });
        } else {
          setFeedbackExists(false);
        }
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedback();
  }, [id]);

  const handleRatingChange = (name) => (event, value) => {
    setRatings((prev) => ({ ...prev, [name]: value || 0 }));
  };

  const handleTextFieldChange = (name) => (event) => {
    setTextFields((prev) => ({ ...prev, [name]: event.target.value }));
  };

  const handleSubmit = async () => {
    const hasZeroRating = Object.values(ratings).some(rating => rating === 0);

    if (hasZeroRating) {
      setError('All rating fields must be filled.');
      return;
    }

    setError('');
    try {
      if (feedbackExists) {
        await api.patch(`feedback/edit/${feedbackId}/`, {
          ...ratings,
          ...textFields,
        });
      } else {
        await api.post(`feedback/add/`, {
          ...ratings,
          ...textFields,
          project: id,
        });
      }
      setDialogOpen(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    navigate(`/projects/${id}`);
  };

  const handleOpenScoringGuide = () => {
    setScoringGuideOpen(true);
  };

  const handleCloseScoringGuide = () => {
    setScoringGuideOpen(false);
  };

  const renderRatingSection = (title, items) => (
    <Paper style={{ ...glassStyle, marginBottom: '24px' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(items).map(([key, label]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="body1">{label as React.ReactNode}</Typography>
            <Rating
              name={key}
              value={ratings[key]}
              onChange={handleRatingChange(key)}
              size="large"
              sx={{
                color: '#E1B77E',
                '& .MuiRating-iconEmpty': {
                  color: 'white',
                },
                '& .MuiRating-iconHover': {
                  color: '#E1B77E',
                },
              }}
              emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderTextField = (name, label) => (
    <TextField
      fullWidth
      multiline
      rows={4}
      value={textFields[name]}
      onChange={handleTextFieldChange(name)}
      label={label}
      variant="outlined"
      sx={{
        mb: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 1,
        '& .MuiOutlinedInput-root': {
          color: 'white',
          '& fieldset': {
            borderColor: '#CED9D7',
          },
          '&:hover fieldset': {
            borderColor: '#CED9D7',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#CED9D7',
          },
        },
        '& .MuiInputLabel-root': {
          color: '#CED9D7',
        },
      }}
    />
  );

  return (
    <ThemeProvider theme={theme}>
      <Box className="min-h-screen bg-[#121212] text-white" sx={{ pt: 4 }}>
        <Container maxWidth="lg">
          <AppBar position="static" sx={{ ...appBarStyle, ...glassStyle, mb: 4 }}>
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                <span style={{ color: 'white' }}>Feedback</span>
               
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenScoringGuide}
                sx={{
                  backgroundColor: '#054E5A',
                  color: 'white',
                  '&:hover': { backgroundColor: '#043c46' },
                }}
              >
                Scoring Guide
              </Button>
            </Toolbar>
          </AppBar>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {renderRatingSection('Team Interaction & Responsiveness', {
            clarity_of_communication: 'Clarity of Communication',
            responsiveness: 'Responsiveness',
            collaboration: 'Collaboration',
          })}

          {renderRatingSection('Deliverable & Project Management', {
            deliverable_quality: 'Deliverable Quality',
            attention_to_detail: 'Attention to Detail',
            testing_and_validation: 'Testing and Validation',
            adherence_to_deadlines: 'Adherence to Deadlines',
            time_management: 'Time Management',
          })}

          {renderRatingSection('Skills & Expertise', {
            knowledge_and_skills: 'Knowledge and Skills',
            problem_solving: 'Problem Solving',
            overall_satisfaction: 'Overall Satisfaction',
          })}

          {renderRatingSection('Planning & Risk Management', {
            expectations_met: 'Expectations Met',
            planning_and_organization: 'Planning and Organization',
            risk_management: 'Risk Management',
            flexibility: 'Flexibility',
          })}

          {renderRatingSection('Post-Implementation', {
            post_implementation_support: 'Post-Implementation Support',
            training_and_documentation: 'Training and Documentation',
          })}

          <Paper style={{ ...glassStyle, marginBottom: '24px' }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            {renderTextField('business_impact', 'Business Impact')}
            {renderTextField('efficiency_improvement', 'Efficiency Improvement')}
            {renderTextField('user_adoption', 'User Adoption')}
            {renderTextField('areas_for_improvement', 'Areas for Improvement')}
            {renderTextField('additional_comments', 'Additional Comments')}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                width: '200px',
                height: '50px',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: '#054E5A',
                '&:hover': { backgroundColor: '#043c46' },
              }}
            >
              {feedbackExists ? 'Save' : 'Submit'}
            </Button>
          </Box>
        </Container>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>Your feedback has been successfully {feedbackExists ? 'updated' : 'submitted'}.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={scoringGuideOpen} onClose={handleCloseScoringGuide}>
          <DialogTitle>Scoring Guide</DialogTitle>
          <DialogContent>
            <Typography>
              Detailed explanation of each scoring criteria and the meaning of each rating level.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseScoringGuide} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default FeedbackPage;
