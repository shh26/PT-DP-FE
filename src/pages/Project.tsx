import React, { useEffect, useState,ChangeEvent, SyntheticEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectsForm from '../components/ProjectsForm';
import { useAuth } from '../context/AuthContext';
import {api} from '../api/index'
import {SelectChangeEvent} from '@mui/material';

interface ProjectFormData {
  id?: number;  // Make this optional as it might not be present for new projects
  name: string;
  description: string;
  objective: string;
  type: string;
  product_owner: string;
  lead_developer: string;
  opportunity: number | null;
  project_sponsor: string;
  project_manager: string;
  general_manager: string[];
  development_sponsor: string;
  baseline_delivery_date: string;  // Changed from baseline_delivery_Date
  actual_delivery_date: string;    // Changed from actual_delivery_Date
  status: string;
  cost: string;
  scope: string;
  quality: string;
  time: string;
  created_by: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  division_type: string | null;
  team_member: any[];
  gate?: string;  // Add this field, make it optional if it's not always present
}

const today = new Date().toISOString().split('T')[0];
const Project: React.FC = () => {
  const [formData, setFormData] = React.useState<ProjectFormData>({
    name: '',
    description: '',
    objective: '',
    type: '',
    product_owner: '',
    lead_developer: '',
    opportunity: null,
    project_sponsor: '',
    project_manager: '',
    general_manager: [],
    development_sponsor: '',
    baseline_delivery_date: '',  // Changed from baseline_delivery_Date
    actual_delivery_date: '',    // Changed from actual_delivery_Date
    status: 'Active',
    cost: 'G',
    scope: 'G',
    quality: 'G',
    time: 'G',
    created_by: '',
    start_date: today,
    created_at: '',
    updated_at: '',
    team_member: [],
    division_type: '',
  });
  const { id, o_id } = useParams<{ id: string, o_id: string }>();
  const projectId = id ? parseInt(id, 10) : undefined;
const opportunityId = o_id ? parseInt(o_id, 10) : undefined;
  const navigate = useNavigate();
  const { user } = useAuth()
  const [users, setUsers] = useState<{ id: number; first_name: string, email: string, last_name: string, }[]>([]);
  const [division,setDivision]=useState('')
  useEffect(() => {
    const local_division=localStorage.getItem('division')
    setDivision(local_division)
    const fetchProjectData = async () => {
      if (id && user) {
        if (user?.role !== 'admin' && user?.role !== 'superadmin') {
          navigate('/projects');
        }

        try {
          const response = await api.get(`project/${projectId}`);
          const projectData = response.data;
          setFormData(prevData => ({
            ...prevData,
            ...projectData,
            team_member: projectData.team_member || [],  // Ensure team_member is an array
          }));
        } catch (error) {
          console.error('Error fetching project data', error);
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await api.get('users/get_users?page=1&limit=10');
        console.log(response?.data?.results, '?????????userapi data')
        setUsers(response?.data?.results);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchProjectData();
    fetchUsers();
  }, [projectId, user, navigate]);


  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }> | SyntheticEvent<Element, Event> | SelectChangeEvent<string>,
    newValue?: any
  ) => {
    console.log(event, newValue, 'handle change');
  
    if ('target' in event && event.target && 'name' in event.target) {
      const { name, value } = event.target as { name: string; value: unknown };
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    } else if (Array.isArray(newValue)) {
      setFormData(prevData => ({
        ...prevData,
        team_member: newValue,
      }));
    }
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedFormData = { ...formData };
      updatedFormData.team_member = formData.team_member?.map(user => user.id) || [];
      updatedFormData.division_type = division
      if (projectId) {
        // Update existing project
        await api.patch(`project/edit/${projectId}/`, updatedFormData);
      } else if (opportunityId) {
        updatedFormData.opportunity = opportunityId;
       
        const response = await api.post('project/add/', updatedFormData);
        if (response.status === 201) {
          const project_id = response.data.id;

          try {
            const newFormData = { status: "Converted" };
            await api.patch(`opportunity/edit/${opportunityId}/`, newFormData);
          } catch (error) {
            // Rollback: delete the newly created project if updating opportunity fails
            await api.delete(`project/delete/${project_id}/`);
            throw new Error('Failed to update opportunity, rolled back project creation');
          }
        }
      } else {
        await api.post('project/add/', updatedFormData);
      }

      console.log('Form data submitted successfully:', formData);
      navigate('/projects');  // Navigate to /projects on successful form submission
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const draftData = { ...formData };
      draftData.status = 'Draft'; // Set status as Draft
      draftData.division_type = division; // Include division if needed
  
      if (projectId) {
        // Update existing draft
        await api.patch(`project/edit/${projectId}/`, draftData);
      } else {
        // Create a new draft
        await api.post('project/add/', draftData);
      }
  
      console.log('Draft saved successfully:', draftData);
      navigate('/projects'); // Navigate to /projects or wherever appropriate
    } catch (error) {
      console.error('There was an error saving the draft:', error);
    }
  };
  

  return (
    <ProjectsForm
      formData={formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      handleSaveAsDraft={handleSaveAsDraft}
      users={users}
    />
  );
};

export default Project;
