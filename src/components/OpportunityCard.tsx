import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const titleContainerStyle = {
  maxWidth: '170px',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1.125rem',
  fontWeight: 'bold',
  color: 'white',
  overflowWrap: 'break-word',
  whiteSpace: 'normal',
  lineHeight: '1.4',
  display: '-webkit-box',
  WebkitLineClamp: '2',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

const OpportunityCard = ({ opportunity, onDelete }) => {
  const { id, name, created_by_name, overall_score, status, created_by, dateAdded } = opportunity;
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (e) => {
    if (open) {
      e.stopPropagation();
      return;
    }
    navigate(`/opportunityDetail/${id}`, { state: { opportunity } });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

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

  return (
    <div onClick={handleClick} className="block no-underline text-inherit" style={{ color: 'inherit' }}>
      <div
        className={`bg-ac-teal shadow-md rounded-lg p-4 transition-all duration-300 ease-in-out transform ${isHovered ? 'hover:shadow-gold' : 'hover:scale-105'
          }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ boxShadow: isHovered ? '0 4px 20px rgba(225, 183, 126, 0.8)' : 'none' }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div style={titleContainerStyle}>
              <div style={titleStyle}>{name}</div>
            </div>
            {user.id === created_by || user.role === 'admin' || user.role === 'superadmin' ? (
              <a
                href={`/opportunity/edit/${id}`}
                className="text-white hover:text-ac-gold"
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'inherit' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.414 2.586a2 2 0 010 2.828L8.828 14H5v-3.828l8.586-8.586a2 2 0 012.828 0zM4 16v2h2l10.293-10.293-2-2L4 16z" />
                </svg>
              </a>
            ) : null}
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
              PaperProps={{
                style: {
                  backgroundColor: '#054E5A',
                  color: 'white',
                },
              }}
            >
              <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description" style={{ color: 'white' }}>
                  Are you sure you want to delete this opportunity?
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
          <span className={`px-2 py-1 rounded ${status === 'Completed' ? 'bg-green-500' : 'bg-ac-teal-hover'}`}>{status}</span>
        </div>

        <div>
          <span className="text-sm text-gray-200">Created By: {created_by_name}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-200">Date Added: {dateAdded}</span>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded ${overall_score >= 70 ? 'bg-green-800' :
              overall_score >= 40 && overall_score <= 69 ? 'bg-yellow-700' :
                'bg-red-900'
              }`}>
              Priority: {overall_score}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;