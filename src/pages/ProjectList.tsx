import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import ProjectsGrid from '../components/ProjectsGrid';
import { useAuth } from '../context/AuthContext';

const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

function Projects() {
  const { user } = useAuth();

  return (
    <Box className="p-8 min-h-screen bg-[#121212] text-white">
      <Box sx={{ position: 'relative', mb: 2 }}>
        <AppBar
          position="static"
          sx={{
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
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              Project <span style={{ color: '#E1B77E' }}>&nbsp; Pipeline</span>

            </Typography>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '1.1rem',
                  }}
                >
                  Hi {user?.first_name}
                </Typography>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      <ProjectsGrid />
    </Box>
  );
}

export default Projects;