import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, AppBar, Toolbar, Grid, Paper, useTheme, useMediaQuery } from '@mui/material';
import Plot from 'react-plotly.js';
import axios from 'axios';
import { BarChart, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

interface CostRow {
    id: number;
    cost_id: string;
    category: string;
    group: string;
    description: string;
    additional_comment: string;
    budget: number;
    spent: number;
    remaining_budget: number;
    spend_to_finish: number;
    forecast: number;
    variance: number;
    project: number;
}

const glassStyle = {
    backgroundColor: 'rgba(40, 44, 52, 0.9)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
};

const CostVisualization: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<CostRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [division, setDivision] = useState('');
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const new_division = localStorage.getItem('division');
        setDivision(new_division || '');
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get<{ results: CostRow[] }>(`http://localhost:8000/api/v1/cost/list?page=1&limit=1000&project=${id}&division=${division}`);
            setData(response.data.results);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const totalCostByCategory = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + Number(item.budget);
        return acc;
    }, {} as { [key: string]: number });

    const totalCostByGroup = data.reduce((acc, item) => {
        acc[item.group] = (acc[item.group] || 0) + Number(item.budget);
        return acc;
    }, {} as { [key: string]: number });

    const totalCostByCategoryAndGroup = data.reduce((acc, item) => {
        const key = `${item.category} - ${item.group}`;
        acc[key] = (acc[key] || 0) + Number(item.budget);
        return acc;
    }, {} as { [key: string]: number });

    const totalBudget = data.reduce((sum, item) => sum + Number(item.budget), 0);
    const totalSpent = data.reduce((sum, item) => sum + Number(item.spent), 0);
    const totalRemainingBudget = data.reduce((sum, item) => sum + Number(item.remaining_budget), 0);
    const totalSpendToFinish = data.reduce((sum, item) => sum + Number(item.spend_to_finish), 0);
    const totalVariance = data.reduce((sum, item) => sum + Number(item.variance), 0);

    const budgetPercentageByCategory = Object.entries(totalCostByCategory).map(([category, budget]) => ({
        category,
        percentage: (budget / totalBudget) * 100
    }));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212' }}>
                <Typography variant="h4" sx={{ color: 'white' }}>Loading...</Typography>
            </Box>
        );
    }

    const chartConfig = {
        responsive: true,
        displayModeBar: false,
    };

    const pieChartLayout = {
        height: 340,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: 'white', size: 12 },
        margin: { t: 30, b: 50, l: 10, r: 10 },
        legend: { orientation: 'h', y: -0.2 },
    };

    const barChartLayout = {
        height: 450,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: 'white', size: 12 },
        margin: { t: 30, b: 80, l: 50, r: 20 },
        xaxis: {
            tickangle: 0,
            title: {
                standoff: 25
            }
        },
    };

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: 'white' }}>
            <AppBar position="static" sx={{ ...glassStyle, boxShadow: 'none' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                        Cost Visualization
                    </Typography>
                    <Button
                        onClick={() => navigate(`/costs/${id}`)}
                        startIcon={<BarChart size={20} />}
                        sx={{
                            ...glassStyle,
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                        }}
                    >
                        Back to Costs
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ ...glassStyle, p: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <PieChart size={24} style={{ marginRight: '8px' }} />
                                Total Cost by Category
                            </Typography>
                            <Plot
                                data={[{
                                    type: 'pie',
                                    labels: Object.keys(totalCostByCategory),
                                    values: Object.values(totalCostByCategory),
                                    textinfo: 'label+percent',
                                    insidetextorientation: 'radial',
                                    hole: 0.4,
                                }]}
                                layout={pieChartLayout}
                                config={chartConfig}
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ ...glassStyle, p: 2, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <PieChart size={24} style={{ marginRight: '8px' }} />
                                Budget Split by Category
                            </Typography>
                            <Plot
                                data={[{
                                    type: 'pie',
                                    labels: budgetPercentageByCategory.map(item => item.category),
                                    values: budgetPercentageByCategory.map(item => item.percentage),
                                    textinfo: 'label+percent',
                                    insidetextorientation: 'radial',
                                    hole: 0.4,
                                }]}
                                layout={pieChartLayout}
                                config={chartConfig}
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ ...glassStyle, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <BarChart size={24} style={{ marginRight: '8px' }} />
                                Total Budget Overview
                            </Typography>
                            <Plot
                                data={[{
                                    type: 'bar',
                                    x: ['Total Budget', 'Total Spent', 'Remaining Budget', 'Spend to Finish'],
                                    y: [totalBudget, totalSpent, totalRemainingBudget, totalSpendToFinish],
                                    marker: {
                                        color: ['rgba(255, 159, 64, 0.8)', 'rgba(75, 192, 192, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(153, 102, 255, 0.8)']
                                    },
                                }]}
                                layout={{
                                    ...barChartLayout,
                                    height: isSmallScreen ? 350 : 450,
                                    xaxis: {
                                        ...barChartLayout.xaxis,
                                        title: {
                                            text: 'Budget Category',
                                            standoff: 25
                                        }
                                    },
                                    yaxis: { title: 'Amount' },
                                }}
                                config={chartConfig}
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ ...glassStyle, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <BarChart size={24} style={{ marginRight: '8px' }} />
                                Total Cost by Group
                            </Typography>
                            <Plot
                                data={[{
                                    type: 'bar',
                                    x: Object.keys(totalCostByGroup),
                                    y: Object.values(totalCostByGroup),
                                    marker: { color: 'rgba(0, 164, 204, 0.8)' },
                                }]}
                                layout={{
                                    ...barChartLayout,
                                    height: isSmallScreen ? 350 : 450,
                                    xaxis: {
                                        ...barChartLayout.xaxis,
                                        title: {
                                            text: 'Group',
                                            standoff: 25
                                        }
                                    },
                                    yaxis: { title: 'Total Cost' },
                                }}
                                config={chartConfig}
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ ...glassStyle, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <BarChart size={24} style={{ marginRight: '8px' }} />
                                Total Cost by Category and Group
                            </Typography>
                            <Plot
                                data={[{
                                    type: 'bar',
                                    x: Object.keys(totalCostByCategoryAndGroup),
                                    y: Object.values(totalCostByCategoryAndGroup),
                                    marker: { color: 'rgba(0, 204, 150, 0.8)' },
                                }]}
                                layout={{
                                    ...barChartLayout,
                                    height: isSmallScreen ? 350 : 450,
                                    xaxis: {
                                        ...barChartLayout.xaxis,
                                        title: {
                                            text: 'Category - Group',
                                            standoff: 25
                                        }
                                    },
                                    yaxis: { title: 'Total Cost' },
                                }}
                                config={chartConfig}
                                style={{ width: '100%' }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ ...glassStyle, p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <BarChart size={24} style={{ marginRight: '8px' }} />
                                Total Variance
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <Typography variant="h2" sx={{ fontWeight: 'bold', color: totalVariance >= 0 ? 'green' : 'red' }}>
                                    {totalVariance >= 0 ? '+' : '-'}${Math.abs(totalVariance).toLocaleString()}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                    {totalVariance >= 0 ? (
                                        <TrendingUp size={24} color="green" style={{ marginRight: '8px' }} />
                                    ) : (
                                        <TrendingDown size={24} color="red" style={{ marginRight: '8px' }} />
                                    )}
                                    <Typography variant="body1">
                                        {totalVariance >= 0 ? 'Under Budget' : 'Over Budget'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CostVisualization;