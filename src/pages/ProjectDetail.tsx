import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Avatar, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import axios from 'axios';

const glassStyle: React.CSSProperties = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const prioritisationStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #054E5A 65%, #7D8083 50%)',
  color: 'white',
  padding: '1px',
  borderRadius: '12px',
  boxShadow: '0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  marginBottom: '16px',
  marginTop: '30px',
  textAlign: 'center',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#054E5A',
  color: 'white',
  padding: '6px 12px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
};

const largeContentStyle: React.CSSProperties = {
  ...glassStyle,
  height: '200px',
  overflowY: 'auto',
  textAlign: 'left',
};

const theme = createTheme({
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: 'rgba(60, 64, 72, 0.5)',
          '&.Mui-active': {
            color: '#E1B77E',
          },
          '&.Mui-completed': {
            color: '#E1B77E',
          },
          fontSize: '2.5rem',
        },
        text: {
          fill: 'white',
          fontSize: '1.2rem',
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: 'white',
          '&.Mui-active': {
            color: '#E1B77E',
          },
          '&.Mui-completed': {
            color: '#E1B77E',
          },
          fontSize: '1.2rem',
        },
      },
    },
  },
});

interface Project {
  id: number;
  name: string;
  pain_points_and_issues: string;
  business_benefits_and_value: string;
  type: string;
  product_owner: string;
  scrum_master: string;
  project_sponsor: string;
  project_manager: string;
  general_manager: string[];
  development_sponsor: string;
  phase: string;
  baseline_delivery_date: string;
  actual_delivery_date: string;
  status: string;
  scope: string;
  cost: string;
  quality: string;
  time: string;
  first_name: string;
  last_name: string;
  team_member: Array<{ first_name: string; last_name: string }>;
  gate: string;
  lead_developer: string;
  objective: string;
  description: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { completedGates } = useProject();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [division, setDivision] = useState('');
  const [currentGate, setCurrentGate] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:8000/api/v1/project/${id}`)
      .then((res) => {
        setProject(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching project:', error);
        setProject(null);
        setLoading(false);
      });
    const storedDivision = localStorage.getItem('division');
    setDivision(storedDivision || '');
  }, [id]);

  useEffect(() => {
    if (completedGates[id]) {
      const gates = ['ideation', 'scope', 'planning', 'development', 'realisation', 'review'];
      const lastCompletedIndex = gates.findIndex(gate => !completedGates[id][gate]);
      if (lastCompletedIndex === -1) {
        setCurrentGate('Complete');
      } else if (lastCompletedIndex === 0) {
        setCurrentGate('Ideation');
      } else {
        setCurrentGate(gates[lastCompletedIndex].charAt(0).toUpperCase() + gates[lastCompletedIndex].slice(1));
      }
    }
  }, [completedGates, id]);

  const handleProvideFeedback = () => {
    navigate(`/feedback/${id}`);
  };

  const handleRisks = () => {
    navigate(`/risks/${id}`);
  };

  const handleDecisionLog = () => {
    navigate(`/decision-log/${id}`);
  };

  const handleCosts = () => {
    navigate(`/costs/${id}`);
  };

  const handleStageGate = () => {
    navigate(`/stage-gate/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="p-8 min-h-screen bg-[#121212] text-white">
        <AppBar
          position="static"
          sx={{
            mb: 2,
            ...glassStyle,
            height: '80px',
            minHeight: '40px',
            '& .MuiToolbar-root': {
              minHeight: '40px',
              paddingTop: '0',
              paddingBottom: '0',
            }
          }}
        >
          <Toolbar
            variant="dense"
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              <span style={{ color: 'white' }}>Project</span>&nbsp;
              <span style={{ color: '#E1B77E' }}> {project.name}</span>
            </Typography>
            <div>
              <Button style={buttonStyle} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Button style={buttonStyle} onClick={handleDecisionLog} sx={{ mr: 1 }}>
                Decision Log
              </Button>
              <Button style={buttonStyle} onClick={handleRisks} sx={{ mr: 1 }}>
                Risks
              </Button>
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <Button style={buttonStyle} onClick={handleCosts} sx={{ mr: 1 }}>
                  Costs
                </Button>
              )}
              <Button style={buttonStyle} onClick={handleStageGate} sx={{ mr: 1 }}>
                Stage Gate
              </Button>
              <Button style={buttonStyle} onClick={handleProvideFeedback}>
                Feedback
              </Button>
            </div>
          </Toolbar>
        </AppBar>

        <div style={prioritisationStyle} className="mt-2">
          <h2 className="text-2xl font-bold mb-1">Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <div style={{ ...glassStyle, textAlign: 'center' }}>
            <h2 className="text-base font-bold mb-2">Current Project Gate</h2>
            <div className="text-4xl font-bold">
              {currentGate}
            </div>
          </div>
          <div style={{ ...glassStyle, textAlign: 'center' }}>
            <h2 className="text-base font-bold mb-2">Baseline Delivery Date</h2>
            <div className="text-4xl font-bold">
              {project.baseline_delivery_date}
            </div>
          </div>
          <div style={{ ...glassStyle, textAlign: 'center' }}>
            <h2 className="text-base font-bold mb-2">Actual Delivery Date</h2>
            <div className="text-4xl font-bold">
              {project.actual_delivery_date}
            </div>
          </div>
          <div style={{ ...glassStyle, textAlign: 'center' }}>
            <h2 className="text-base font-bold mb-2">RAG Status</h2>
            <div className="flex justify-center space-x-6">
              {['scope', 'cost', 'quality', 'time'].map((item) => (
                <div key={item} className="flex flex-col items-center">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      marginBottom: '4px',
                      backgroundColor: project[item] === 'A' ? '#FCD34D' :
                        project[item] === 'G' ? '#10B981' :
                          project[item] === 'R' ? '#EF4444' : '#10B981'
                    }}
                  ></div>
                  <span className="text-xs">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={prioritisationStyle} className="mt-2">
          <h2 className="text-2xl font-bold mb-1">Project Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div style={largeContentStyle}>
            <h2 className="text-base font-bold mb-1 text-center">Project Description</h2>
            <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {project.description ?? 'N/A'}
            </p>
          </div>
          <div style={largeContentStyle}>
            <h2 className="text-base font-bold mb-1 text-center">Project Objectives</h2>
            <p className="text-sm" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {project.objective ?? 'N/A'}
            </p>
          </div>
        </div>

        <div style={prioritisationStyle} className="mt-2">
          <h2 className="text-2xl font-bold mb-1">Owners</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          {division === 'VSS' ? (
            <>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">Product Owner</h2>
                <p className="text-2xl font-semibold">{project.product_owner}</p>
              </div>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">Project Sponsor</h2>
                <p className="text-2xl font-semibold">{project.project_sponsor}</p>
              </div>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">Lead Developer</h2>
                <p className="text-2xl font-semibold">{project.lead_developer}</p>
              </div>
            </>
          ) : division === 'VSC' ? (
            <>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">Project Manager</h2>
                <p className="text-2xl font-semibold">{project.project_manager}</p>
              </div>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">General Manager</h2>
                <div className="text-2xl font-semibold">
                  {project.general_manager.map((gm, index) => (
                    <p key={index}>{gm}</p>
                  ))}
                </div>
              </div>
              <div style={{ ...glassStyle, textAlign: 'center' }} className="rounded-lg p-2 shadow-md">
                <h2 className="text-base font-bold mb-1">Development Sponsor</h2>
                <p className="text-2xl font-semibold">{project.development_sponsor}</p>
              </div>
            </>
          ) : null}
        </div>

        <div style={prioritisationStyle} className="mt-2">
          <h2 className="text-2xl font-bold mb-1">Project Team</h2>
        </div>

        <div style={{ ...glassStyle, textAlign: 'center' }} className="mt-2 p-4">
          <div className="flex justify-center space-x-12 mb-4">
            {project.team_member.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <Avatar alt={`${member.first_name} ${member.last_name}`} src={`/path-to-avatar${index + 1}.jpg`} className="mb-2" />
                <Typography variant="subtitle2">{member.first_name} {member.last_name}</Typography>
              </div>
            ))}
          </div>
        </div>
      </Box>
    </ThemeProvider>
  );
};

export default ProjectDetail;