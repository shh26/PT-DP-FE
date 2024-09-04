import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, styled } from '@mui/material';
import '@fontsource/montserrat/400.css';
import { useAuth } from '../context/AuthContext';

const GradientBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: `linear-gradient(-45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.info.main}, ${theme.palette.warning.main})`,
    backgroundSize: '400% 400%',
    animation: 'gradient 15s ease infinite',
    '@keyframes gradient': {
        '0%': {
            backgroundPosition: '0% 50%',
        },
        '50%': {
            backgroundPosition: '100% 50%',
        },
        '100%': {
            backgroundPosition: '0% 50%',
        },
    },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    backgroundColor: 'rgba(29, 29, 29, 0.8)',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[4],
}));

const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(4),
}));

const StyledTypography = styled(Typography)({
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
});

const StyledButton = styled(Button)({
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 400,
});

const LandingPage: React.FC = () => {
    const navigate=useNavigate()
    const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
    const {user,isAuthenticated}=useAuth()
    console.log(user,isAuthenticated,'landing page')
    const handleDivisionSelect = (division: string) => {
        localStorage.setItem('division',division)
        setSelectedDivision(division);
        navigate('/')
    };

    // const renderDivisionContent = () => {
    //     switch (selectedDivision) {
    //         case 'VSS':
    //             return (
    //                 <Box sx={{ mt: 4 }}>
    //                     <StyledTypography variant="h4" gutterBottom>VSS Division</StyledTypography>
    //                     <StyledTypography>Welcome to the VSS division page.</StyledTypography>
    //                     <StyledButton
    //                         variant="outlined"
    //                         color="secondary"
    //                         sx={{ mt: 2 }}
    //                         onClick={() => setSelectedDivision(null)}
    //                     >
    //                         Back to Division Selection
    //                     </StyledButton>
    //                 </Box>
    //             );
    //         case 'VSC':
    //             return (
    //                 <Box sx={{ mt: 4 }}>
    //                     <StyledTypography variant="h4" gutterBottom>VSC Division</StyledTypography>
    //                     <StyledTypography>Welcome to the VSC division page.</StyledTypography>
    //                     <StyledButton
    //                         variant="outlined"
    //                         color="secondary"
    //                         sx={{ mt: 2 }}
    //                         onClick={() => setSelectedDivision(null)}
    //                     >
    //                         Back to Division Selection
    //                     </StyledButton>
    //                 </Box>
    //             );
    //         default:
    //             return (
    //                 <>
    //                     <StyledTypography variant="h3" component="h1" gutterBottom>
    //                         STC Platform
    //                     </StyledTypography>
    //                     <StyledTypography variant="h5" component="h2" gutterBottom>
    //                         Select Your Team
    //                     </StyledTypography>
    //                     <ButtonContainer>
    //                         <StyledButton
    //                             variant="contained"
    //                             color="primary"
    //                             size="large"
    //                             sx={{ minWidth: 120 }}
    //                             onClick={() => handleDivisionSelect('vss')}
    //                         >
    //                             Digital Transformation
    //                         </StyledButton>
    //                         <StyledButton
    //                             variant="contained"
    //                             color="primary"
    //                             size="large"
    //                             sx={{ minWidth: 120 }}
    //                             onClick={() => handleDivisionSelect('vsc')}
    //                         >
    //                             Strategic Projects
    //                         </StyledButton>
    //                     </ButtonContainer>
    //                 </>
    //             );
    //     }
    // };

    return (
        <GradientBackground>
            <Container maxWidth="sm">
                <ContentWrapper>
                    <StyledTypography variant="h3"  gutterBottom>
                        STC Platform
                    </StyledTypography>
                    <StyledTypography variant="h5"  gutterBottom>
                        Select Your Team
                    </StyledTypography>
                    <ButtonContainer>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ minWidth: 120 }}
                            onClick={() => handleDivisionSelect('VSS')}
                        >
                            Digital Transformation
                        </StyledButton>
                        <StyledButton
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ minWidth: 120 }}
                            onClick={() => handleDivisionSelect('VSC')}
                        >
                            Strategic Projects
                        </StyledButton>
                    </ButtonContainer>
                </ContentWrapper>
            </Container>
        </GradientBackground>
    );
};

export default LandingPage;