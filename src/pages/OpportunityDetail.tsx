import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const glassStyle: React.CSSProperties = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
  textAlign: 'center',
};

const getPriorityScoreStyle = (score) => {
  let backgroundColor;
  if (score >= 70) {
    backgroundColor = '#166534';
  } else if (score >= 40 && score <= 69) {
    backgroundColor = '#A16207';
  } else {
    backgroundColor = '#990000';
  }

  return {
    ...glassStyle,
    backgroundColor,
    backgroundImage: 'none',
    color: 'black',
  };
};

const prioritisationStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #054E5A 68%, #7D8083 50%)',
  color: 'white',
  padding: '1px',
  borderRadius: '12px',
  boxShadow: '0 5px 10px -3px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
  marginBottom: '16px',
  marginTop: '30px',
  textAlign: 'center',
};

const largeContentStyle: React.CSSProperties = {
  ...glassStyle,
  height: '200px',
  overflowY: 'auto',
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#054E5A',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '17px',
  fontWeight: 'bold',
};

const OpportunityDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunity, setOpportunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/opportunity/${id}/`);
        setOpportunity(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching opportunity:', error);
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);
  console.log(opportunity,'????????opp')

  const handleMakeDecision = () => {
    navigate(`/decision/${id}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!opportunity) {
    return <div>Opportunity not found</div>;
  }

  const calculateTotalCost = () => {
    const capex = parseFloat(opportunity.estimated_capex_cost) || 0;
    const opex = parseFloat(opportunity.estimated_opex_cost) || 0;
    return (capex + opex).toFixed(2);
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
          },
          textAlign: 'left',
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}
          >
            <span style={{ color: 'White' }}>Opportunity</span>&nbsp;
            <span
              style={{
                color: '#E1B77E',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 120px)', // Adjust based on the width of "Opportunity"
              }}
            >
              {opportunity.name}
            </span>
          </Typography>
          {!(opportunity.status === 'Rejected' || opportunity.status === 'Converted') && (<Button
            style={buttonStyle}
            onClick={handleMakeDecision}
          >
            Make Decision
          </Button>)}

        </Toolbar>
      </AppBar>

      <div style={prioritisationStyle} className="mt-2">
        <h2 className="text-2xl font-bold mb-1">Prioritisation</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {[
          { title: 'Strategy Alignment Score', value: opportunity.strategy_alignment_score },
          { title: 'Financial Return Score', value: opportunity.financial_return_score },
          { title: 'Delivery Success Score', value: opportunity.delivery_success_score },
        ].map((item, index) => (
          <div key={index} style={glassStyle}>
            <h2 className="text-base font-bold mb-2">{item.title}</h2>
            <div className="text-4xl font-bold">
              {item.value ?? 'N/A'}
            </div>
          </div>
        ))}
        <div style={getPriorityScoreStyle(opportunity.overall_score)}>
          <h2 className="text-base text-white font-bold mb-2">Priority Score</h2>
          <div className="text-4xl text-white font-bold">{opportunity.overall_score}</div>
        </div>
      </div>

      <div style={prioritisationStyle} className="mt-2">
        <h2 className="text-2xl font-bold mb-1">Owners</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        {[
          { title: 'Sponsor', name: opportunity.sponsor },
          { title: 'Process Owner', name: opportunity.process_owner }
        ].map((item, index) => (
          <div key={index} style={glassStyle} className="rounded-lg p-2 shadow-md">
            <h2 className="text-base font-bold mb-1">{item.title}</h2>
            <p className="text-2xl font-semibold">{item.name ?? 'N/A'}</p>
          </div>
        ))}
        <div style={{
          ...glassStyle,
          textAlign: 'center',
          maxHeight: '100px',
          overflowY: 'auto'
        }}
          className="rounded-lg p-2 shadow-md">
          <h2 className="text-base font-bold mb-1">Service Technology Center(s)</h2>
          <div className="text-2xl font-semibold">
            {opportunity?.service_technology_center?.map((stc, index) => (
              <p key={index}>{stc.label}</p>
            ))}
          </div>
        </div>
      </div>


      <div style={prioritisationStyle} className="mt-2">
        <h2 className="text-2xl font-bold mb-1">Costs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        {[
          { title: 'Estimated Hours', value: opportunity.estimated_hours },        
          { title: 'Estimated Cost Saving', value: opportunity.estimated_cost_saving },
          { title: 'Estimated Revenue Generation', value: opportunity.estimated_revenue_generation }
        ].map((item, index) => (
          <div key={index} style={glassStyle} className="rounded-lg p-2 shadow-md">
            <h2 className="text-base font-bold mb-1">{item.title}</h2>
            <p className="text-3xl font-semibold">
              {item.value ? `£${item.value}` : 'N/A'}
            </p>
          </div>
        ))}
      </div>

      <div style={prioritisationStyle} className="mt-2">
        <h2 className="text-2xl font-bold mb-1">Forecasts and Value Statement</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        {[
          { title: 'Pain Points and Issues', content: opportunity.current_pain_point_and_issue },
          { title: 'Business Benefits and Value', content: opportunity.business_benefit_value },

        ].map((item, index) => (
          <div key={index} style={largeContentStyle}>
            <h2 className="text-base font-bold mb-1">{item.title}</h2>
            <p className="text-sm">{item.content ?? 'N/A'}</p>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default OpportunityDetail;