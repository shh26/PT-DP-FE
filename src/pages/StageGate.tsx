import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useProject } from '../context/ProjectContext';

const glassStyle = {
    backgroundColor: 'rgba(40, 44, 52, 0.9)',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    backgroundImage: 'linear-gradient(to bottom, rgba(60, 64, 72, 0.5), rgba(40, 44, 52, 0.5))',
};

const buttonStyle = {
    backgroundColor: '#054E5A',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginLeft: '10px',
};

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#054E5A',
        },
        secondary: {
            main: '#E1B77E',
        },
    },
});

const stageGateData = [
    {
        stage: 'Ideation',
        requirements: {
            VSC: [
                'Project Name',
                'Development Sponsor',
                'Development Owner',
                'Objective',
                'Drivers',
                'Scope (Products, Service Levels, Volumes, Processes etc)',
                'Stakeholder Functions',
                '5 Yr Plan, Input / Output Model, and Capacity Model',
            ],
            VSS: [
                'Project Charter',
                'Project Sponsor',
                'Resource Assignment',
                'Project Initiation Document (PID)',
                'Project Requirements Document (PRD)',
            ],
        },
        url: 'https://yourcompany.sharepoint.com/sites/Ideation',
    },
    {
        stage: 'Scope',
        requirements: {
            VSC: [
                'Updates to all previous stage documents',
                'Teams Site & Structure',
                'Deliverables',
                'Exclusions',
                'Business Options Pugh Matrix',
                'Expected Benefits incl. how to measure, when, and by whom',
                'Expected Drawbacks',
                'Risks & Issues Log (including constraints & assumptions)',
                'Schedule & Milestones (Stakeholder Reviewed)',
                'Budget inc. % Accuracy Assessment',
                'Deliverables & Lessons Checklist',
            ],
            VSS: [
                'Updates to all previous stage gate documents',
                'Product Backlog',
                'High-level Architecture Diagram',
                'MVP Definition'
            ]
        },
        url: 'https://yourcompany.sharepoint.com/sites/Scope',
    },
    {
        stage: 'Planning',
        requirements: {
            VSC: [
                'Updates to all previous stage documents',
                'Project Org inc. PM Approach',
                'Equipment List & Specs, including Software and Test Equipment',
                'Facility Spec / Survey / Dwgs',
                'Equipment Utility Requirements',
                'Layout (Stakeholder Reviewed)',
                'Design & Bidding Phase quotes (architect)',
                'Post-Project Org Chart, Job Descriptions, and Salary Band Reviews',
                'Development CEP PPT',
                'Development CEP Financial Model',
            ],
            VSS: [
                'Updates to all previous stage gate documents',
                'Risk Assessment',
                'Impediment Log',
                'Release Planning Document (RPD)',
                'Wireframes'
            ]
        },
        url: 'https://yourcompany.sharepoint.com/sites/Planning',
    },
    {
        stage: 'Development',
        requirements: {
            VSC: [
                'Updates to all previous stage documents',
                'Execution Phase quotes (all vendors, including construction & equipment)',
                'Realisation CEP PPT Pack',
                'Realisation CEP Financial Model',
                'Realisation CEP CRW',
            ],
            VSS: [
                'Updates to all previous stage gate documents',
                'Sprint Plans',
                'Sprint Reviews',
                'Sprint Retrospectives',
                'Data Design Specification (DDS)',
                'Solution Design Specification (SDS)'
            ]
        },
        url: 'https://yourcompany.sharepoint.com/sites/Development',
    },
    {
        stage: 'Realisation',
        requirements: {
            VSC: [
                'Updates to all previous stage documents',
                'Note: All files to be created at workstream level and collated at project level',
                'Workstream Scope Breakdown',
                'Gantt',
                'Action Tracker',
                'Cost Tracker',
                'Communications Plan',
                'Project Call Slide Pack inc. Workstream One-Pagers',
                'SteerCo Slide Pack',
                'Control Calls – Individual Workstreams, Project Team, and SteerCo',
                'Decision Log (Changes since CEP)',
            ],
            VSS: [
                'Updates to all previous stage gate documents',
                'Solution Deployment',
                'Post-deployment log (bugs + support)',
            ]
        },
        url: 'https://yourcompany.sharepoint.com/sites/Realisation',
    },
    {
        stage: 'Review',
        requirements: {
            VSC: [
                'Updates to all previous stage documents',
                'Lessons Learned Report',
                'Expected Benefits Review (refer to stage 2)',
                'Finalised Control Documents',
                'Teams Site Archived',
            ],
            VSS: [
                'Updates to all previous stage gate documents',
                'User Documentation',
                'Lessons Learned',
                'Customer Feedback Analysis'
            ]
        },
        url: 'https://yourcompany.sharepoint.com/sites/Review',
    },
];

const StageGate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [statuses, setStatuses] = useState<{ [key: string]: string }>({});
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [division, setDivision] = useState('VSC');
    const { completedGates, setCompletedGate, stageStatuses, setStageStatuses } = useProject();

    useEffect(() => {
        const storedDivision = localStorage.getItem('division');
        setDivision(storedDivision || 'VSC');

        if (stageStatuses[id]) {
            setStatuses(stageStatuses[id]);
        }
    }, [id, stageStatuses]);

    useEffect(() => {
        if (Object.keys(statuses).length > 0) {
            setStageStatuses(id, statuses);
            updateCompletedGates();
        }
    }, [statuses]);

    const updateCompletedGates = () => {
        const newCompletedGates = { ...completedGates[id] };
        stageGateData.forEach((stage) => {
            const isCompleted = isStageCompleted(stage.stage);
            newCompletedGates[stage.stage.toLowerCase()] = isCompleted;
            setCompletedGate(id, stage.stage.toLowerCase(), isCompleted);
        });
    };

    const getStatusColor = (stage: string, requirement: string) => {
        const key = `${stage}-${requirement}`;
        return statuses[key] || 'gray';
    };

    const handleStatusChange = (stage: string, requirement: string) => {
        const key = `${stage}-${requirement}`;
        const currentStatus = statuses[key] || 'gray';
        let newStatus;

        switch (currentStatus) {
            case 'gray':
                newStatus = 'green';
                break;
            case 'green':
                newStatus = '#4DA6FF'; // blue
                break;
            case '#4DA6FF':
                newStatus = 'gray';
                break;
            default:
                newStatus = 'gray';
                break;
        }

        setStatuses(prevStatuses => ({
            ...prevStatuses,
            [key]: newStatus,
        }));
    };

    const handleStageHeaderClick = (stage: string, clickCount: number) => {
        const newStatuses = { ...statuses };
        const clickedStageIndex = stageGateData.findIndex(s => s.stage === stage);

        if (clickCount === 2) {
            // Double-click: Set all to gray (blank) for this stage and all subsequent stages
            stageGateData.forEach((s, index) => {
                if (index >= clickedStageIndex) {
                    const stageRequirements = s.requirements[division] || [];
                    stageRequirements.forEach(req => {
                        newStatuses[`${s.stage}-${req}`] = 'gray';
                    });
                }
            });
        } else if (clickCount === 3) {
            // Triple-click: Set all to green for this stage only
            const stageRequirements = stageGateData[clickedStageIndex].requirements[division] || [];
            stageRequirements.forEach(req => {
                newStatuses[`${stage}-${req}`] = 'green';
            });
        } else {
            // Single-click: Toggle between all green and all gray for this stage only
            const stageRequirements = stageGateData[clickedStageIndex].requirements[division] || [];
            const allGreen = stageRequirements.every(req => statuses[`${stage}-${req}`] === 'green');
            stageRequirements.forEach(req => {
                newStatuses[`${stage}-${req}`] = allGreen ? 'gray' : 'green';
            });
        }

        setStatuses(newStatuses);
    };

    const isStageCompleted = (stage: string) => {
        const requirements = stageGateData.find(s => s.stage === stage)?.requirements[division] || [];
        return requirements.every(req => {
            const status = statuses[`${stage}-${req}`];
            return status === 'green' || status === '#4DA6FF';
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleStageGateDocuments = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-8 min-h-screen bg-[#121212] text-white">
                <AppBar position="static" sx={{ ...glassStyle, mb: 2 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Stage Gate Requirements
                        </Typography>
                        <Button color="inherit" onClick={handleBack} style={buttonStyle}>
                            Back
                        </Button>
                        <Button color="inherit" onClick={handleStageGateDocuments} style={buttonStyle}>
                            Stage Gate Documents
                        </Button>
                    </Toolbar>
                </AppBar>

                <TableContainer component={Paper} sx={{ ...glassStyle, mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {stageGateData.map((stage) => (
                                    <TableCell
                                        key={stage.stage}
                                        align="center"
                                        onClick={(e) => {
                                            const clickCount = e.detail;
                                            handleStageHeaderClick(stage.stage, clickCount);
                                        }}
                                        sx={{
                                            fontWeight: 'bold',
                                            fontSize: '1.1rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="center">
                                            <Typography variant="body1">
                                                {stage.stage}
                                            </Typography>
                                            {isStageCompleted(stage.stage) && (
                                                <CheckCircleIcon sx={{ color: 'green', ml: 1 }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.from({ length: Math.max(...stageGateData.map(stage => stage.requirements[division]?.length || 0)) }).map((_, index) => (
                                <TableRow key={index}>
                                    {stageGateData.map((stage) => {
                                        const requirements = stage.requirements[division] || [];
                                        return (
                                            <TableCell key={`${stage.stage}-${index}`} align="left">
                                                {requirements[index] && (
                                                    <Box display="flex" alignItems="center">
                                                        <Tooltip title="Click to change status">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleStatusChange(stage.stage, requirements[index])}
                                                            >
                                                                <FiberManualRecordIcon sx={{ color: getStatusColor(stage.stage, requirements[index]) }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Typography variant="body2" sx={{ ml: 1 }}>
                                                            {requirements[index]}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={isDialogOpen} onClose={handleCloseDialog} PaperProps={{ style: { ...glassStyle, width: '400px' } }}>
                    <DialogTitle>
                        Stage Gate Documents
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        {stageGateData.map((stage) => (
                            <Button
                                key={stage.stage}
                                onClick={() => window.open(stage.url, '_blank')}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                {stage.stage}
                            </Button>
                        ))}
                    </DialogContent>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
};

export default StageGate;