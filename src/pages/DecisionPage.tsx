import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  PaperProps
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { useAuth } from '../context/AuthContext';
import {api} from '../api/index'

const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  padding: '10px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

interface StyledPaperProps extends PaperProps {
  isSelected?: boolean;
  isHighlighted?: boolean;
}


const StyledPaper = styled(Paper)<StyledPaperProps>(({ theme, isSelected, isHighlighted }) => ({
  ...glassStyle,
  backgroundColor: isHighlighted ? '#4CAF50' : isSelected ? '#FFFC39' : 'rgba(40, 44, 52, 0.9)',
  color: isHighlighted || isSelected ? 'black' : 'white',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.3s ease',
  transform: (isSelected || isHighlighted) ? 'scale(1.02)' : 'scale(1)',
  boxShadow: (isSelected || isHighlighted) ? theme.shadows[10] : theme.shadows[1],
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#054E5A',
    color: 'white',
  },
}));

const DecisionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
 const storageKey = `project_${id}`;
  const { user } = useAuth();
  console.log(user,'????????')
  const [currentStatus, setCurrentStatus] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_selectedQuadrant`);
    return saved ? JSON.parse(saved) : null;
  });
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_comments`);
    return saved ? JSON.parse(saved) : {
      'Plan Now': '',
      'Do Now': '',
      'Reject': '',
      'Revisit': ''
    };
  });
  const [displayedComments, setDisplayedComments] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_displayedComments`);
    return saved ? JSON.parse(saved) : {
      'Plan Now': [],
      'Do Now': [],
      'Reject': [],
      'Revisit': []
    };
  });

  const [convertButtonTexts, setConvertButtonTexts] = useState(() => {
    const saved = localStorage.getItem(`${storageKey}_convertButtonTexts`);
    return saved ? JSON.parse(saved) : {
      'Plan Now': 'Convert for Planning',
      'Do Now': 'Convert to Project',
      'Reject': 'Convert to Rejected',
      'Revisit': 'Convert for Revisit'
    };
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');

  const quadrantStatusMapping = {
    'Plan Now': 'Planning',
    'Do Now': 'Converted',
    'Reject': 'Rejected',
    'Revisit': 'Revisit'
  };
  
  useEffect(() => {
    api.get(`comment/list?page=1&limit=10&opportunity=${id}`)
      .then(res => {
        const commentsByQuadrant = {
          'Plan Now': [],
          'Do Now': [],
          'Reject': [],
          'Revisit': []
        };
        res.data.results.forEach(comment => {
          // Find the quadrant key based on the comment's status
          const quadrant = Object.keys(quadrantStatusMapping).find(
            key => quadrantStatusMapping[key] === comment.status
          );
          if (quadrant && commentsByQuadrant[quadrant]) {
            commentsByQuadrant[quadrant].push(comment);
          }
        });
        setDisplayedComments(commentsByQuadrant);
      })
      .catch(error => {
        console.error('Error fetching comments:', error);
      });


      api.get(`opportunity/${id}/`)
      .then(res => {
        console.log(res,'?????????????????res')
        setCurrentStatus(res.data.status);
      })
      .catch(error => {
        console.error('Error fetching opportunity status:', error);
      });


  }, [id]);

  const handleQuadrantClick = (quadrant) => {
    setSelectedQuadrant(quadrant === selectedQuadrant ? null : quadrant);
  };

  const handleCommentChange = (quadrant, value) => {
    setComments({ ...comments, [quadrant]: value });
  };
const shouldHighlight = (quadrant) => {
  return currentStatus === quadrantStatusMapping[quadrant];
};

  const handleCommentSubmit = (quadrant, e) => {
    if (e.key === 'Enter' && comments[quadrant].trim() !== '') {
      const formData = {
        comment: comments[quadrant],
        opportunity: id,
        created_by: user.id,
        status: quadrantStatusMapping[quadrant] // Use the mapping to set the correct status
      };
      api.post(`comment/add/`, formData)
        .then(response => {
          console.log('Comment added', response.data);
          setDisplayedComments(prevComments => ({
            ...prevComments,
            [quadrant]: [...prevComments[quadrant], response.data]
          }));
          setComments(prevComments => ({ ...prevComments, [quadrant]: '' }));
        })
        .catch(error => {
          console.log('Comment add failed', error);
        });
    }
  };

  const handleDeleteComment = (quadrant, commentId, e) => {
    e.stopPropagation();
    api.delete(`comment/delete/${commentId}`)
      .then(res => {
        console.log('Comment deleted', res);
        setDisplayedComments(prevComments => ({
          ...prevComments,
          [quadrant]: prevComments[quadrant].filter(comment => comment.id !== commentId)
        }));
      })
      .catch(error => {
        console.log('Comment not deleted', error);
      });
  };

  const handleContainerClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedQuadrant(null);
    }
  }, []);

  const handleConvertClick = (quadrant) => {
    let message = '';
    switch (quadrant) {
      case 'Plan Now':
        message = 'Are you sure you want to convert this opportunity to a status of planning?';
        break;
      case 'Do Now':
        message = 'Are you sure you want to convert this opportunity to a project?';
        break;
      case 'Reject':
        message = 'Are you sure you want to convert this opportunity to a status of rejected?';
        break;
      case 'Revisit':
        message = 'Are you sure you want to convert this opportunity to a status of revisit?';
        break;
      default:
        message = 'Are you sure you want to convert this opportunity?';
    }
    setDialogContent(message);
    setOpenDialog(true);
    setSelectedCard(quadrant)
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const [formData, setFormData] = useState({ status: '' });

  const handleDialogConfirm = () => {
    console.log("Converting...", selectedCard);
  
    let status = '';
    switch (selectedCard) {
      case 'Do Now':
        navigate(`/project/create/${id}`);
        return;
      case 'Reject':
        status = 'Rejected';
        break;
      case 'Plan Now':
        status = 'Planning';
        break;
      case 'Revisit':
        status = 'Revisit';
        break;
      default:
        console.error('Unknown quadrant selected');
        return;
    }
  
    setFormData({ status });
  
    api.patch(`opportunity/edit/${id}/`, { status })
      .then(response => {
        console.log('Status updated successfully', response.data);
        navigate('/pipeline')
        // Handle successful update (e.g., show a success message)
      })
      .catch(error => {
        console.error('Error updating status', error);
        // Handle error (e.g., show an error message)
      });
  
    setOpenDialog(false);
  };

  const quadrantDescriptions = {
    'Plan Now': 'High value, needs preparation',
    'Do Now': 'High value, ready to execute',
    'Reject': 'Low value, not worth pursuing',
    'Revisit': 'Potential value, needs reassessment'
  };

  const renderQuadrant = (quadrant) => {
    const isSelected = selectedQuadrant === quadrant;
    const isHighlighted = shouldHighlight(quadrant);
    return (
      <StyledPaper
        elevation={3}
        isSelected={isSelected}
        isHighlighted={isHighlighted}
        onClick={() => handleQuadrantClick(quadrant)}
        className="cursor-pointer flex flex-col"
        style={{ height: '45vh' }}
      >
        <Typography variant="h5" component="h2" className="font-bold mb-2">
          {quadrant}
        </Typography>
        <Typography variant="body2" className="mb-4">
          {quadrantDescriptions[quadrant]}
        </Typography>
        {(user.role === 'admin' || user?.role === 'superadmin') && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={(e) => { e.stopPropagation(); handleConvertClick(quadrant); }}
            className="mb-4"
            style={{ borderColor: isSelected ? 'black' : 'white', color: isSelected ? 'black' : 'white' }}
          >
            {convertButtonTexts[quadrant]}
          </Button>
        )}
       <List className="flex-grow overflow-auto mb-4" style={{ maxHeight: 'calc(100% - 180px)' }}>
  {displayedComments[quadrant] && displayedComments[quadrant].map((comment) => (
    <ListItem key={comment.id} className={`mb-2 rounded ${isSelected ? 'bg-white bg-opacity-20' : 'bg-black bg-opacity-10'}`}>
      <ListItemText 
        primary={comment.comment} 
        secondary={`By: ${comment.created_by_name || 'Unknown'}`}
        style={{ color: isSelected ? 'black' : 'white' }} 
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={(e) => handleDeleteComment(quadrant, comment.id, e)}
          style={{ color: isSelected ? 'black' : 'white' }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  ))}
</List>
        <TextField
          fullWidth
          variant="outlined"
          value={comments[quadrant]}
          onChange={(e) => handleCommentChange(quadrant, e.target.value)}
          onKeyPress={(e) => handleCommentSubmit(quadrant, e)}
          onClick={(e) => e.stopPropagation()}
          placeholder="Add a comment..."
          className={`bg-white bg-opacity-20 rounded ${isSelected ? 'text-black' : 'text-white'}`}
          InputProps={{
            style: { color: isSelected ? 'black' : 'white' }
          }}
        />
      </StyledPaper>
    );
  };

  return (
    <div
      className="h-screen bg-[#121212] p-8"
      onClick={handleContainerClick}
    >
      <div className="grid grid-cols-2 gap-8 h-full">
        {renderQuadrant('Plan Now')}
        {renderQuadrant('Do Now')}
        {renderQuadrant('Reject')}
        {renderQuadrant('Revisit')}
      </div>
      <StyledDialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Conversion"}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: 'white' }}>
            {dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: 'white' }}>
            No
          </Button>
          <Button onClick={handleDialogConfirm} autoFocus style={{ color: 'white' }}>
            Yes
          </Button>
        </DialogActions>
      </StyledDialog>
    </div>
  );
};

export default DecisionPage;