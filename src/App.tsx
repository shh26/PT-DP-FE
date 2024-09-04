import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Pipeline from './pages/Pipeline';
import Projects from './pages/ProjectList';
import Opportunity from './pages/Opportunity';
import Project from './pages/Project';
import OpportunityDetail from './pages/OpportunityDetail';
import ProjectDetail from './pages/ProjectDetail';
import DecisionPage from './pages/DecisionPage';
import FeedbackPage from './pages/FeedbackPage';
import Risks from './pages/Risks';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthCallback from './components/Auth/AuthCallback';
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/Auth/PrivateRoute';
import DecisionLog from './pages/DecisionLog';
import Costs from './pages/Costs';
import StageGate from './pages/StageGate';
import CostVisualization from './pages/CostVisualization';
import { ProjectProvider } from './context/ProjectContext';
import LandingPage from './pages/LandingPage';
import User from './pages/User';
import { ToastrProvider } from './context/ToasterContext';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#054E5A', // Teal
    },
    secondary: {
      main: '#E1B77E', // Gold
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1D1D1D', // Darker paper background
    },
    text: {
      primary: '#FFFFFF', // White
      secondary: '#B6BBBF', // Text-30
      disabled: '#7D8083', // Text-60
    },
    success: {
      main: '#3C8544', // Func Green
    },
    error: {
      main: '#CF2436', // Func. Red
    },
    info: {
      main: '#1072B9', // Func Blue
    },
    warning: {
      main: '#F68363', // Peach
    },
    divider: '#3E3F41', // Text-90
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <ProjectProvider>
        <ToastrProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>} >
                <Route index element={<Home />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/opportunity/create" element={<Opportunity />} />
                <Route path="/project/create/:o_id" element={<Project />} />
                <Route path="/opportunity/edit/:id" element={<Opportunity />} />
                <Route path="/project/edit/:id" element={<Project />} />
                <Route path="/opportunityDetail/:id" element={<OpportunityDetail />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/decision/:id" element={<DecisionPage />} />
                <Route path="/opportunityDetail/:id" element={<OpportunityDetail />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/risks/:id" element={<Risks />} />
                <Route path="/feedback/:id" element={<FeedbackPage />} />
                <Route path="/decision-log/:id" element={<DecisionLog />} />
                <Route path="/costs/:id" element={<Costs />} />
                <Route path="/stage-gate/:id" element={<StageGate />} />
                <Route path="/projects/:id/cost-visualization" element={<CostVisualization />} />
                <Route path="/users" element={<User/>} />
                <Route index element={<Home />} />
              </Route>
            </Routes>
          </Router>
          </ToastrProvider>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;