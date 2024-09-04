import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpportunityForm from '../components/OpportunityForm';
import { useAuth } from '../context/AuthContext';
import {api} from '../api/index'
import {
  SelectChangeEvent,CircularProgress,Box
} from '@mui/material';

const Opportunity: React.FC = () => {
  const {user,isAuthenticated,loading: authLoading}=useAuth();
  const [division,setDivision]=useState('')
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = React.useState({
    id:'',
    name: '',
    description: '',
    created_by: user?.id,
    process_owner: '',
    status:'Active',
    strategy_alignment_score:'',
    financial_return_score:'',
    delivery_success_score:'',
    overall_score:'',
    sponsor:'',
    general_manager:'',
    estimated_capex_cost:'',
    estimated_opex_cost:'',
    high_level_value_statement:'',
    current_pain_point_and_issue:'',
    estimated_hours:'',
    division_type:'',
    service_technology_center: [],
    business_benefit_value: '',
    estimated_cost_saving: '',
    estimated_revenue_generation:''
  });
  
  const {id}=useParams()
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading) {
      
      const getDivision = localStorage.getItem('division');
      setDivision(getDivision);
  
      const fetchData = async () => {
        if (id && user) {
          try {
            const response = await api.get(`opportunity/${id}/`);
            const opportunityData = response.data;
            if (user?.id !== opportunityData.created_by && user?.role !== 'admin' && user?.role !== 'superadmin') {
              navigate('/pipeline');
            } else {
              setFormData({
                ...formData,
                ...opportunityData
              });
            }
          } catch (error) {
            console.error('Error fetching opportunity', error);
          }
        } else if (!id) {
          try {
            const response = await api.get(`opportunity/list/?page=1&limit=10&status=draft&division=${division}`);
            const draftData = response.data.results[0];
            if (draftData) {
              setFormData(prevFormData => ({
                ...prevFormData,
                ...draftData
              }));
            }
          } catch (error) {
            console.error('Error fetching draft:', error);
          }
        }
        setIsLoading(false);
      };
  
      fetchData();
    }
  }, [id, user, isAuthenticated, navigate, authLoading]);
  

  if (authLoading || isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
  newValue?: any
) => {
  const { name, value } = event.target;

  if (name === 'service_technology_center' && newValue) {
    setFormData(prevState => ({
      ...prevState,
      [name]: newValue, // Directly use newValue for service_technology_center
    }));
  } else {
    setFormData(prevState => ({
      ...prevState,
      [name]: value as string,
    }));
  }
};

const handleServiceTechnologyCenterChange = (newValue: { value: string; label: string }[]) => {
  setFormData(prevState => ({
    ...prevState,
    service_technology_center: newValue,
  }));
};

  
  
  
  


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        status: 'Active',
        division_type: division
      };
      console.log(updatedFormData,'formopp')
      if (id) { 
        await api.patch(`opportunity/edit/${id}/`, updatedFormData);
      } else if (updatedFormData.id) {
        await api.patch(`opportunity/edit/${formData.id}/`, updatedFormData);
      } else {
        await api.post('opportunity/add/', updatedFormData);
      }
      console.log('Form data submitted:', updatedFormData);
      navigate('/pipeline');
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const draftData = {
        ...formData,
        status: 'Draft',
        division_type: division
      };
      if (draftData.id) { 
        await api.patch(`opportunity/edit/${draftData.id}/`, draftData);
      } else {
        const response = await api.post('opportunity/add/', draftData);
        setFormData({
          ...formData,
          id: response.data.id, 
        });
      }
      console.log('Draft data saved:', draftData);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };


  return (
    <div className="">
    <OpportunityForm 
      formData={formData} 
      handleChange={handleChange} 
      handleSubmit={handleSubmit} 
      handleSaveAsDraft={handleSaveAsDraft}
      handleServiceTechnologyCenterChange={handleServiceTechnologyCenterChange}
    />
    </div>
  );
};

export default Opportunity;