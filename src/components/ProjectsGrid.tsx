import React, { useState, useEffect } from 'react';
import ProjectsCard from './ProjectsCard';
import { CircularProgress, Pagination, Box, InputBase, Select, MenuItem, InputAdornment, Stack, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { projectApi } from '../api/projectApi';
import {api} from '../api/index'


const glassStyle = {
  backgroundColor: 'rgba(40, 44, 52, 0.9)',
  color: 'white',
  backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  ...glassStyle,
  flexGrow: 1,
  marginRight: theme.spacing(2),
  height: '40px',
  display: 'flex',
  alignItems: 'center',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#E1B77E',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#E1B77E',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: '#E1B77E',
  ...glassStyle,
  height: '40px',
  minWidth: '120px',
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSelect-select': {
    padding: '0 32px 0 14px',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },
  '& .MuiSelect-icon': {
    color: '#E1B77E',
  },
}));

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    color: '#E1B77E',
  },
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: '#E1B77E',
    color: 'white',
  },
});

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [division,setDivision]=useState('')
  const fetchProjects = async () => {
    setIsLoading(true);
    // let url = `http://localhost:8000/api/v1/project/list?page=${page}&limit=${limit}`;
    // if (searchQuery) {
    //   url += `&search=${searchQuery}`;
    // }
    // if (statusFilter && statusFilter !== 'All') {
    //   url += `&status=${statusFilter}`;
    // }
    // fetch(url)
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     setProjects(data.results);
    //     setTotalItems(data.total);
    //     setIsLoading(false);
    //   })
    //   .catch(error => {
    //     console.error('Error loading projects:', error);
    //     setIsLoading(false);
    //   });
      const response = await projectApi.getProjects(10,1,searchQuery,statusFilter,division)
      if(response.status===200){
        setProjects(response.data.results);
        setTotalItems(response.data.total);
        setIsLoading(false);
      }else{
        setIsLoading(false);
        
      }

  };

  useEffect(() => {
    const current_division=localStorage.getItem('division')
    setDivision(current_division)

    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, limit, searchQuery, statusFilter,division]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`project/delete/${id}/`);
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };


  return (
    <Box className="mt-10 min-h-screen bg-[#121212] text-white">
      <Box sx={{ maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          mb: 3,
          gap: 2,
          width: '100%',
        }}>
          <Box sx={{ display: 'flex', width: '100%', height: '40px' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search for Project..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearchChange}
                endAdornment={
                  searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={handleClearSearch}
                        edge="end"
                        sx={{ color: '#E1B77E' }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </Search>
            <StyledSelect
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="All">All</MenuItem>
            </StyledSelect>
          </Box>
        </Box>
        {isLoading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: '#E1B77E' }} />
          </Box>
        ) : (
          <Box>
            <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectsCard key={project.id} projects={project} onDelete={handleDelete}/>
              ))}
            </Box>
            <Stack spacing={2} alignItems="center" className="mt-6">
              <StyledPagination
                count={Math.ceil(totalItems / limit)}
                page={page}
                onChange={handlePageChange}
                shape="rounded"
                variant="outlined"
              />
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;