import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {api} from '../../api/index'

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      if (code) {
        try {
          // Exchange code for access token
          const response = await api.post('users/callback/', { code });

          if (response.status === 200) {
            // Store access token in local storage and set isAuthenticated
            login(response.data.access_token);

            // Fetch user data using Microsoft Graph API
            const accessToken = response.data.access_token;
            const userResponse = await fetchUserData(accessToken);

           
            if (userResponse.ok) {
                const userData = await userResponse.json();
                 // Check if user already exists
              const userExists = await checkUserExists(userData.mail);
              
              if(userExists?.status!==200){
             
                try {
                    const data = {
                        email: userData.mail,
                        role: 'user',
                        mobile: userData.mobilePhone || '',
                        first_name: userData.givenName || '',
                        last_name: userData.surname || '',
                        office_location: userData.officeLocation || '',
                        job_title: userData.jobTitle || '',
                        ms_id: userData.id
                    };
                    const response = await api.post('users/signup/', data);
                    if (response.status === 201) {
                      localStorage.setItem('user',JSON.stringify(response.data))

                        console.log('User created successfully');
                    } else {
                        console.log('Failed to create user:', response.statusText);
                    }
                } catch (error) {
                    console.error('User creation failed:', error);
                }
              
            }else{
              localStorage.setItem('user',JSON.stringify(userExists.data))

            }
          
           
              navigate('/landing');
            } else {
              console.error('Failed to fetch user data:', userResponse.statusText);
              navigate('/login');
            }
          } else {
            console.error('Authentication failed:', response.statusText);
            navigate('/login');
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          navigate('/login');
        }
      } else {
        console.error('Authorization code not provided');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, login,setUser]);

  // Function to fetch user data from Microsoft Graph API
  const fetchUserData = async (accessToken) => {
    try {
      const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return userResponse;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  };

   // Function to check if user already exists
   const checkUserExists = async (email) => {
    try {
      const response = await api.post('users/profile/',{email});
      console.log(response,'??????????')
      return response
    } catch (error) {
      console.error('Error checking user existence:', error);
      
    }
  };

  return <div>Loading...</div>;
};

export default AuthCallback;
