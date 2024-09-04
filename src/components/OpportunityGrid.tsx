import React, { useState, useEffect, useCallback } from 'react';
import OpportunityCard from './OpportunityCard';
import { CircularProgress, Pagination, Box, InputBase, Select, MenuItem, InputAdornment, Stack, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
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

const OpportunityGrid = () => {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [division, setDivision] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchOpportunity = useCallback(async () => {
    setIsLoading(true);

    try {
      let url = `opportunity/list/?page=${page}&limit=${limit}`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (statusFilter && statusFilter !== 'All') {
        url += `&status=${encodeURIComponent(statusFilter)}`;
      }
      if (division) {
        url += `&division=${encodeURIComponent(division)}`;
      }
      const response = await api.get(url);
      const data = response.data;
      const formattedData = data.results.map(item => ({
        id: item.id,
        created_by: item.created_by,
        created_by_name: item.created_by_name,
        name: item.name,
        overall_score: item.overall_score,
        description: item.description,
        status: item.status,
        priority: item.overall_score,
        dateAdded: new Date(item.created_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      }));
      setProjects(formattedData);
      setTotalItems(data.total);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter, division]);

  useEffect(() => {
    const getDivision = localStorage.getItem('division');
    setDivision(getDivision);
    const delayDebounceFn = setTimeout(() => {
      fetchOpportunity();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchOpportunity]);

  const getPriorityCategory = (score) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesPriority = priorityFilter === 'all' || getPriorityCategory(project.priority) === priorityFilter;
      return matchesPriority;
    })
    .sort((a, b) => b.priority - a.priority);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setPage(1);
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
      await api.delete(`opportunity/delete/${id}/`);
      await fetchOpportunity();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const handlePriorityChange = (e) => {
    setPriorityFilter(e.target.value);
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
                placeholder="Search for Opportunity or Created By..."
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
              value={priorityFilter}
              onChange={handlePriorityChange}
              displayEmpty
              sx={{ marginLeft: 2, minWidth: '150px' }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="High">High Priority</MenuItem>
              <MenuItem value="Medium">Medium Priority</MenuItem>
              <MenuItem value="Low">Low Priority</MenuItem>
            </StyledSelect>
            <StyledSelect
              value={statusFilter}
              onChange={handleStatusChange}
              displayEmpty
              sx={{ marginLeft: 2, minWidth: '150px' }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Converted">Converted To Project</MenuItem>
              <MenuItem value="Planning">Planning</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Revisit">Revisit</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
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
              {filteredAndSortedProjects.map((opportunity, index) => (
                <OpportunityCard key={index} opportunity={opportunity} onDelete={handleDelete} />
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

export default OpportunityGrid;