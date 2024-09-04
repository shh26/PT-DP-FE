import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  TrendingUp,
  AssignmentTurnedIn,
  AttachMoney,
  Lightbulb,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import {api} from '../api/index'



const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '16px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',

  minHeight: '200px',
};

const Dashboard: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();
  const [division,setDivision]=useState('')
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
  const [cancelledProjectsCount, setCancelledProjectsCount] = useState(0);


  const [activeOpportunitiesCount, setActiveOpportunitiesCount] = useState(0);
  const [convertedOpportunitiesCount, setConvertedOpportunitiesCount] = useState(0);
  const [rejectedOpportunitiesCount, setRejectedOpportunitiesCount] = useState(0);
  const [planningOpportunitiesCount, setPlanningOpportunitiesCount] = useState(0);
  const [revisitOpportunitiesCount, setRevisitOpportunitiesCount] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeOpportunityIndex, setActiveOpportunityIndex] = useState(0);

  useEffect(() => {
    const getDivision = localStorage.getItem('division');
      setDivision(getDivision);
      
    const fetchCounts = async (division) => {
      try {
        const activeProjectsResponse = await api.get(`project/list?status=Active&page=1&limit=10&division=${division}`);
        const completedProjectsResponse = await api.get(`project/list?status=Completed&page=1&limit=10&division=${division}`);
        const cancelledProjectsResponse = await api.get(`project/list?status=Cancelled&page=1&limit=10&division=${division}`);


        setActiveProjectsCount(activeProjectsResponse.data.count);
        setCompletedProjectsCount(completedProjectsResponse.data.count);
        setCancelledProjectsCount(cancelledProjectsResponse.data.count)
        const activeOpportunitiesResponse = await api.get(`opportunity/list?status=Active&page=1&limit=10&division=${division}`);
        const convertedOpportunitiesResponse = await api.get(`opportunity/list?status=Converted&page=1&limit=10&division=${division}`);
        const rejectedOpportunitiesResponse = await api.get(`opportunity/list?status=Rejected&page=1&limit=10&division=${division}`);
        const planningOpportunitiesResponse = await api.get(`opportunity/list?status=Planning&page=1&limit=10&division=${division}`);
        const revisitOpportunitiesResponse = await api.get(`opportunity/list?status=Revisit&page=1&limit=10&division=${division}`);

        setActiveOpportunitiesCount(activeOpportunitiesResponse.data.count);
        setConvertedOpportunitiesCount(convertedOpportunitiesResponse.data.count)
        setRejectedOpportunitiesCount(rejectedOpportunitiesResponse.data.count)
        setPlanningOpportunitiesCount(planningOpportunitiesResponse.data.count);
        setRevisitOpportunitiesCount(revisitOpportunitiesResponse.data.count);

      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    if (getDivision) {
      fetchCounts(getDivision);
    }
  }, [division]);

  const projectStatusData = [
    { name: 'Active', value: activeProjectsCount },
    { name: 'Completed', value: completedProjectsCount },
    { name: 'Cancelled', value: cancelledProjectsCount },
  ];

  const opportunityStatusData = [
    { name: 'Active', value: activeOpportunitiesCount },
    { name: 'Converted', value: convertedOpportunitiesCount },
    { name: 'Planning', value: planningOpportunitiesCount },
    { name: 'Revisit', value: revisitOpportunitiesCount },
    { name: 'Rejected', value: rejectedOpportunitiesCount },
  ];



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#ffffff" fontSize="16">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text 
          x={ex + (cos >= 0 ? 1 : -1) * 12} 
          y={ey} 
          textAnchor={textAnchor} 
          fill="#ffffff"
          fontSize="14"
          fontWeight="bold"
        >
          {`${payload.name}: ${value}`}
        </text>
      </g>
    );
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
            Dashboard
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
      <Grid container spacing={4}>
        {/* Key Metrics */}
        <Grid item xs={12} md={3}>
          <Paper style={glassStyle}>
            <Typography variant="h6" className="mb-2">Total Active Projects</Typography>
            <Typography variant="h3">{activeProjectsCount}</Typography>
            <TrendingUp className="mt-2" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper style={glassStyle}>
            <Typography variant="h6" className="mb-2">Completed Projects in {currentYear}</Typography>
            <Typography variant="h3">{completedProjectsCount}</Typography>
            <AssignmentTurnedIn className="mt-2" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper style={glassStyle}>
            <Typography variant="h6" className="mb-2">Total Active Opportunities</Typography>
            <Typography variant="h3">{activeOpportunitiesCount}</Typography>
            <Lightbulb className="mt-2" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper style={glassStyle}>
            <Typography variant="h6" className="mb-2">Total Converted Opportunities in {currentYear}</Typography>
            <Typography variant="h3">{convertedOpportunitiesCount}</Typography>
            <AssignmentTurnedIn className="mt-2" />
          </Paper>
        </Grid>


        {/* Project Status Chart */}
        <Grid item xs={12} md={6}>
  <Paper style={glassStyle}>
    <Typography variant="h6" className="mb-4">Project Status</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeProjectIndex}
          activeShape={renderActiveShape}
          data={projectStatusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={(_, index) => setActiveProjectIndex(index)}
          onMouseLeave={() => setActiveProjectIndex(0)}
        >
          {projectStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </Paper>
</Grid>

        {/* Budget Overview Chart */}
        <Grid item xs={12} md={6}>
  <Paper style={glassStyle}>
    <Typography variant="h6" className="mb-4">Opportunity Status</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeOpportunityIndex}
          activeShape={renderActiveShape}
          data={opportunityStatusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={(_, index) => setActiveOpportunityIndex(index)}
          onMouseLeave={() => setActiveOpportunityIndex(0)}
        >
          {opportunityStatusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </Paper>
</Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;