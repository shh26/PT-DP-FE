import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginBackground from '../assets/loginBackground.svg';
import { ButtonBaseFullWidth } from '../components/Buttons/ButtonBaseFullWidth';
import MicrosoftLogo from '../assets/logo.png';
import { Typography, Snackbar, Alert } from '@mui/material';
import { useToastr } from '../context/ToasterContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isAuthenticated, handleMicrosoftLogin, handleEmailLogin } = useAuth();
const {showToast}=useToastr()
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/landing');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailPassLogin = async () => {
    try{
      await handleEmailLogin(email, password);
    }catch(error){
      showToast('Invalid email or password. Please try again','error')
    }
  };

  const handleMsLogin = async () => {
    await handleMicrosoftLogin();
  };


 

  return (
    <div className="w-full">
      <img src={LoginBackground} className="w-full h-screen object-cover" alt="login background" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg px-16 py-24">
        <h1 className="text-3xl font-bold text-ac-teal text-center pb-7">STC Digital Platform</h1>
        <div className="text-center">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded mb-4 w-full text-black"
          />
          <div className="flex justify-center">
            <ButtonBaseFullWidth text="Login" onClick={handleEmailPassLogin} />
          </div>
        </div>
        <div className="flex items-center justify-center my-4">
          <hr className="w-1/5 border-gray-300" />
          <span className="mx-2 text-gray-500">or continue with</span>
          <hr className="w-1/5 border-gray-300" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <button onClick={handleMsLogin} className="flex items-center p-2 border border-gray-300 rounded mb-2">
            <img src={MicrosoftLogo} alt="Microsoft Logo" className="w-6 h-6 mr-2" />
            <Typography variant="body1" className="text-black">
              Single Sign-On
            </Typography>
          </button>
        </div>
      </div>
    
    </div>
  );
};

export default Login;