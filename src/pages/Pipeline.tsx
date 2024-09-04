import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import OpportunityGrid from '../components/OpportunityGrid';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const buttonStyle = {
  backgroundColor: '#054E5A',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 'bold',
};

const Pipelines: React.FC = () => {
  const title = 'Opportunity Pipeline';
  const { isAuthenticated } = useAuth();
  const user = localStorage.getItem('user')
  console.log(user,isAuthenticated,'?????????????pipeline')
  const navigate = useNavigate();

  const handleCreateOpportunity = () => {
    navigate('/opportunity/create');
  };

  return (
    <Box className="p-8 min-h-screen bg-[#121212] text-white">
      <AppBar
        position="static"
        sx={{
          mb: 2,
          ...glassStyle,
          boxShadow: 'none',
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
            {title}
          </Typography>
          <div>
            <Button
              style={buttonStyle}
              onClick={handleCreateOpportunity}
            >
              Add Opportunity
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <div className="">
        <OpportunityGrid />
      </div>
    </Box>
  );
}

export default Pipelines;