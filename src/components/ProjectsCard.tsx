import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const gateNames = ['Ideation', 'Scope', 'Planning', 'Development', 'Realization', 'Review'];

const ProjectsCard = ({ projects, onDelete }) => {
  const { id, status, theme } = projects;
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e) => {
    if (open) {
      e.stopPropagation();
      return;
    }
    navigate(`/projects/${id}`, { state: { projects } })
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(id);
      handleClose();
    } catch (error) {
      handleClose();
    }
  };

  // Get the current project gate (phase) from the projects object
  const currentGate = projects.currentGate || 0;
  const currentPhase = gateNames[currentGate];

  return (
    <>
      <div
        className={`bg-ac-teal shadow-md rounded-lg p-4 transition-all duration-300 ease-in-out transform ${isHovered ? 'hover:shadow-gold' : 'hover:scale-105'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ boxShadow: isHovered ? '0 4px 20px rgba(225, 183, 126, 0.8)' : 'none' }}
        onClick={handleClick}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="text-lg font-bold text-white mr-2">{projects.name}</div>
            {user?.role == 'admin' || user?.role === 'superadmin' ? (<Link
              to={`/project/edit/${id}`}
              className="text-white hover:text-ac-gold"
              onClick={(e) => e.stopPropagation()}
              style={{ color: 'inherit' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H5v-3.828l8.586-8.586a2 2 0 012.828 0zM4 16v2h2l10.293-10.293-2-2L4 16z" />
              </svg>
            </Link>) : null}
            {(user.role === 'admin' || user.role === 'superadmin') && (
              <IconButton
                aria-label="delete"
                onClick={handleDeleteClick}
                sx={{ color: '#E1B77E' }}
              >
                <DeleteIcon />
              </IconButton>
            )}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this project?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} color="secondary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          <span className={`px-2 py-1 rounded ${status === 'Completed' ? 'bg-green-500' : 'bg-ac-teal-hover'}`}>{projects.status}</span>
        </div>
        <p className="text-sm text-gray-100 mb-4">Category: {projects.type}</p>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-200">Current Phase: {currentPhase}</span>
        </div>
      </div>
    </>
  );
};

export default ProjectsCard;