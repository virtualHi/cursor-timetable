import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Tabs, 
  Tab, 
  IconButton, 
  Button, 
  Badge,
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Event as EventIcon,
  AccessTime as ClockIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import RosterCalendar from './RosterCalendar';
import { users, rosterEntries } from '../data/mockData';
import { UserRole, ApprovalStatus } from '../models/types';

// TabPanel component to render content for different tabs
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: 'calc(100vh - 180px)' }}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Mock current user (for demonstration)
const currentUser = users[0]; // Using the first user (Service Supervisor) as the current user

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Count pending approvals for notifications
  const pendingApprovals = rosterEntries.filter(entry => entry.status === ApprovalStatus.PENDING).length;
  
  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Team Duty Roster
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={pendingApprovals} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button color="inherit" startIcon={<PersonIcon />}>
            {currentUser.name} ({currentUser.role})
          </Button>
        </Toolbar>
        
        {/* Tabs */}
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="dashboard tabs"
          sx={{ bgcolor: 'primary.dark' }}
          centered
        >
          <Tab label="Roster" icon={<EventIcon />} iconPosition="start" />
          <Tab label="Clock In/Out" icon={<ClockIcon />} iconPosition="start" />
          {currentUser.role !== UserRole.STAFF && (
            <Tab label="Approvals" icon={<DashboardIcon />} iconPosition="start" />
          )}
        </Tabs>
      </AppBar>
      
      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer}
        >
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Menu</Typography>
          </Box>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem>
              <ListItemIcon><EventIcon /></ListItemIcon>
              <ListItemText primary="My Roster" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ClockIcon /></ListItemIcon>
              <ListItemText primary="Clock Records" />
            </ListItem>
            <ListItem>
              <ListItemIcon><GroupIcon /></ListItemIcon>
              <ListItemText primary="Team" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Tab Content */}
      <Container maxWidth="xl" sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={tabValue} index={0}>
          <RosterCalendar />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Clock In/Out</Typography>
              
              <Box>
                <Button 
                  variant="contained" 
                  color="success" 
                  sx={{ mr: 2 }}
                  startIcon={<ClockIcon />}
                >
                  Clock In
                </Button>
                
                <Button 
                  variant="contained" 
                  color="error"
                  startIcon={<ClockIcon />}
                >
                  Clock Out
                </Button>
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
              This is where users can clock in and out, and view their clock records.
              The full implementation will include a table of recent clock records and
              functionality to log backdated entries when needed.
            </Typography>
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              <Typography variant="h6">Today's Schedule</Typography>
              <Typography variant="body1">
                Your next task: Team Meeting (9:00 AM - 10:00 AM)
              </Typography>
            </Box>
          </Paper>
        </TabPanel>
        
        {currentUser.role !== UserRole.STAFF && (
          <TabPanel value={tabValue} index={2}>
            <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 2 }}>Pending Approvals</Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                This is where team leaders and supervisors can review and approve roster submissions.
                The full implementation will include a table of pending submissions with approve/reject actions.
              </Typography>
              
              <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  You have {pendingApprovals} pending approval{pendingApprovals !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Paper>
          </TabPanel>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard; 