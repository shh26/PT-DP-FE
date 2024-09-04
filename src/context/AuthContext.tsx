import React ,{createContext,useState,useContext,useEffect} from 'react';
import {api} from '../api/index'
import axios from 'axios'

interface User {
  id: number,
  role: 'admin' | 'superadmin' | 'user'; 
  first_name: string,
  last_name: string,
  email: string
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; 
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  handleMicrosoftLogin: () => void;
  handleEmailLogin: (email: string, password: string) => Promise<void>;
}



const AuthContext= createContext<AuthContextType | undefined>(undefined);

export const AuthProvider =({children})=>{
const [isAuthenticated,setIsAuthenticated]=useState(false)
const [loading,setLoading]=useState(true);
const [user, setUser] = useState<User | null>(null);


useEffect(()=>{
  const initializeAuth = () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    }
    if (user) {
      setUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
    setLoading(false);
  };
  initializeAuth();
},[])


const login = (token)=>{
    localStorage.setItem('access_token',token)
    setIsAuthenticated(true)
    fetchUserData(token)
}


const logout = ()=>{
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUser(null);

}


const fetchUserData= async (token) =>{
    try{
    const email = await fetchUserEmail(token)
    const userResponse = await api.post('users/profile/', { email })
    if(userResponse.status==200){
        setUser(userResponse.data);
    }}catch(error){
        console.error('Failed to fetch user data:', error);
    }


}


const fetchUserEmail = async (token) =>{
    try{
    const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status==200) {
        
      return response.data.mail}}
      catch(error){
        console.error('Error fetching user email:', error);
      }
}


const handleMicrosoftLogin = async () => {
  try {
    const response = await api.post('users/ms_login/');
    if (response.status === 200) {
      const auth_url = response.data.auth_url;
      window.location.href = auth_url;
    }
  } catch (error) {
    console.log('Microsoft login failed', error);
  }
};


const handleEmailLogin = async (email, password) => {
  try {
    const response = await api.post('users/login/', { email, password });
    if (response.status === 200) {
      const user_data = response.data?.data;
      localStorage.setItem('user',JSON.stringify(user_data))
      setUser(user_data)
      setIsAuthenticated(true)
    }
  } catch (error) {
    console.log('Email login failed', error);
    throw new Error('Invalid email or password'); 
  }
};


return (
    <AuthContext.Provider value={{isAuthenticated, user, login, logout, loading, setUser, setIsAuthenticated, handleMicrosoftLogin,handleEmailLogin}}>
        {children}
    </AuthContext.Provider>
);
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};