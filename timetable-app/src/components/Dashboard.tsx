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
  ListItemButton,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
  Chip,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Event as EventIcon,
  AccessTime as ClockIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon,
  History as HistoryIcon,
  Add as AddIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import RosterCalendar from './RosterCalendar';
import TeamRosterTable from './TeamRosterTable';
import MyRoster from './MyRoster';
import { users, rosterEntries, clockRecords } from '../data/mockData';
import { UserRole, ApprovalStatus, ClockRecord } from '../models/types';
import { format } from 'date-fns';

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
      style={{ height: 'calc(100vh - 180px)', overflow: 'auto' }}
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
const currentUser = users[3]; // Using Sarah Davis (Staff) as the current user

const Dashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backDateDialogOpen, setBackDateDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [isBackdated, setIsBackdated] = useState(false);
  const [notes, setNotes] = useState('');
  const [clockInType, setClockInType] = useState<'in' | 'out'>('in');
  
  // Count pending approvals for notifications
  const pendingApprovals = rosterEntries.filter(entry => entry.status === ApprovalStatus.PENDING).length;
  
  // Get user's clock records
  const userClockRecords = clockRecords.filter(record => record.userId === currentUser.id);
  
  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle clock in action
  const handleClockIn = () => {
    setIsClockedIn(true);
    setClockInTime(new Date());
    // In a real app, this would make an API call to record the clock in
  };

  // Handle clock out action
  const handleClockOut = () => {
    setIsClockedIn(false);
    // In a real app, this would make an API call to record the clock out
  };

  // Open backdated entry dialog
  const openBackdateDialog = (type: 'in' | 'out') => {
    setClockInType(type);
    setBackDateDialogOpen(true);
    setSelectedDate(new Date());
    setIsBackdated(true);
    setNotes('');
  };

  // Submit backdated entry
  const submitBackdatedEntry = () => {
    // In a real app, this would make an API call to record the backdated entry
    setBackDateDialogOpen(false);
    // Show success notification or feedback
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
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="My Roster" icon={<CalendarMonthIcon />} iconPosition="start" />
          <Tab label="Team Roster" icon={<GroupIcon />} iconPosition="start" />
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
            <ListItem disablePadding>
              <ListItemButton onClick={() => setTabValue(0)}>
                <ListItemIcon><CalendarMonthIcon /></ListItemIcon>
                <ListItemText primary="My Roster" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setTabValue(1)}>
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Team Roster" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setTabValue(2)}>
                <ListItemIcon><ClockIcon /></ListItemIcon>
                <ListItemText primary="Clock In/Out" />
              </ListItemButton>
            </ListItem>
            {currentUser.role !== UserRole.STAFF && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => setTabValue(3)}>
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Approvals" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      
      {/* Tab Content */}
      <Container maxWidth="xl" sx={{ mt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <TabPanel value={tabValue} index={0}>
          <MyRoster currentUser={currentUser} />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <TeamRosterTable />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Clock In / Clock Out
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {format(new Date(), 'EEEE')}
                    </Typography>
                    <Typography variant="h6">
                      {format(new Date(), 'MMMM d, yyyy')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center', minWidth: 150 }}>
                    <Typography variant="h3">
                      {format(new Date(), 'HH:mm')}
                    </Typography>
                    <Typography variant="subtitle1">
                      Current Time
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
                {isClockedIn ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleClockOut}
                    startIcon={<ClockIcon />}
                  >
                    Clock Out
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleClockIn}
                    startIcon={<ClockIcon />}
                  >
                    Clock In
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => openBackdateDialog(isClockedIn ? 'out' : 'in')}
                  startIcon={<HistoryIcon />}
                >
                  Backdate Entry
                </Button>
              </Box>
              
              {isClockedIn && clockInTime && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  <Typography>
                    You are currently clocked in. Clock-in time: {format(clockInTime, 'HH:mm')}
                  </Typography>
                </Alert>
              )}
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Recent Activity
              </Typography>
              
              <TableContainer component={Paper} variant="outlined" sx={{ flexGrow: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Clock In</TableCell>
                      <TableCell>Clock Out</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userClockRecords.slice(0, 5).map((record) => {
                      // Calculate duration
                      const durationInMs = record.clockOutTime 
                        ? new Date(record.clockOutTime).getTime() - new Date(record.clockInTime).getTime() 
                        : 0;
                      const hours = Math.floor(durationInMs / (1000 * 60 * 60));
                      const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
                      const durationStr = record.clockOutTime 
                        ? `${hours}h ${minutes}m` 
                        : 'In Progress';
                      
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.clockInTime), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            {format(new Date(record.clockInTime), 'HH:mm')}
                            {record.isDateBack && (
                              <Chip size="small" label="Backdated" color="warning" sx={{ ml: 1 }} />
                            )}
                          </TableCell>
                          <TableCell>
                            {record.clockOutTime 
                              ? format(new Date(record.clockOutTime), 'HH:mm')
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>{durationStr}</TableCell>
                          <TableCell>
                            {!record.clockOutTime ? (
                              <Chip size="small" label="Active" color="success" />
                            ) : (
                              <Chip size="small" label="Complete" color="default" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </TabPanel>
        
        {currentUser.role !== UserRole.STAFF && (
          <TabPanel value={tabValue} index={3}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom>
                Approvals
              </Typography>
              
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff Name</TableCell>
                      <TableCell>Entry</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rosterEntries
                      .filter(entry => entry.status === ApprovalStatus.PENDING)
                      .map((entry) => {
                        const user = users.find(u => u.id === entry.userId);
                        
                        return (
                          <TableRow key={entry.id}>
                            <TableCell>{user?.name}</TableCell>
                            <TableCell>{entry.title}</TableCell>
                            <TableCell>{format(new Date(entry.start), 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              {format(new Date(entry.start), 'HH:mm')} - {format(new Date(entry.end), 'HH:mm')}
                            </TableCell>
                            <TableCell>{entry.location}</TableCell>
                            <TableCell>
                              <Chip 
                                size="small" 
                                label="Pending" 
                                color="warning" 
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Button size="small" variant="contained" color="primary">
                                  Approve
                                </Button>
                                <Button size="small" variant="outlined" color="error">
                                  Reject
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </TabPanel>
        )}
      </Container>
      
      {/* Backdated Entry Dialog */}
      <Dialog open={backDateDialogOpen} onClose={() => setBackDateDialogOpen(false)}>
        <DialogTitle>
          Backdated {clockInType === 'in' ? 'Clock-In' : 'Clock-Out'} Entry
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, minWidth: 300 }}>
            <DateTimePicker
              label="Select Date & Time"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              sx={{ width: '100%', mb: 3 }}
            />
            
            <TextField
              label="Notes (required)"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              placeholder="Please provide a reason for backdated entry"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={isBackdated} 
                  onChange={(e) => setIsBackdated(e.target.checked)} 
                />
              }
              label="Mark as backdated entry"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackDateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={submitBackdatedEntry} 
            variant="contained" 
            disabled={!notes.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 