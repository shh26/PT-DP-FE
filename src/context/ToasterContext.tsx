import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastrContextProps {
  showToast: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const ToastrContext = createContext<ToastrContextProps | undefined>(undefined);

export const ToastrProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showToast = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastrContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastrContext.Provider>
  );
};

export const useToastr = () => {
  const context = useContext(ToastrContext);
  if (context === undefined) {
    throw new Error('useToastr must be used within a ToastrProvider');
  }
  return context;
};
