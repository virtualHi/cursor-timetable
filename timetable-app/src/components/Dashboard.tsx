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
          <RosterCalendar />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Paper elevation={3} sx={{ p: 2, height: 'auto', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">Clock In/Out</Typography>
              
              <Box>
                {!isClockedIn ? (
                  <Button 
                    variant="contained" 
                    color="success" 
                    sx={{ mr: 2 }}
                    startIcon={<ClockIcon />}
                    onClick={handleClockIn}
                  >
                    Clock In
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<ClockIcon />}
                    onClick={handleClockOut}
                  >
                    Clock Out
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  startIcon={<HistoryIcon />}
                  onClick={() => openBackdateDialog('in')}
                  sx={{ mr: 1 }}
                >
                  Backdate Clock In
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<HistoryIcon />}
                  onClick={() => openBackdateDialog('out')}
                >
                  Backdate Clock Out
                </Button>
              </Box>
            </Box>
            
            {isClockedIn && clockInTime && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body1">
                  You clocked in at {format(clockInTime, 'h:mm a')} on {format(clockInTime, 'EEEE, MMMM d, yyyy')}
                </Typography>
              </Alert>
            )}
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="h6">Today's Schedule</Typography>
              {rosterEntries
                .filter(entry => 
                  entry.userId === currentUser.id && 
                  format(entry.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                )
                .map(entry => (
                  <Box key={entry.id} sx={{ mt: 2, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Typography variant="subtitle1">{entry.title}</Typography>
                    <Typography variant="body2">
                      {format(entry.start, 'h:mm a')} - {format(entry.end, 'h:mm a')}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {entry.location}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tasks:</strong> {entry.tasks}
                    </Typography>
                    <Chip 
                      size="small" 
                      sx={{ mt: 1 }}
                      label={entry.status} 
                      color={
                        entry.status === ApprovalStatus.APPROVED ? "success" : 
                        entry.status === ApprovalStatus.PENDING ? "warning" : "error"
                      } 
                    />
                  </Box>
                ))}
              {rosterEntries
                .filter(entry => 
                  entry.userId === currentUser.id && 
                  format(entry.start, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                ).length === 0 && (
                  <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
                    No scheduled tasks for today.
                  </Typography>
                )}
            </Box>
            
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Clock Records</Typography>
            
            <TableContainer component={Paper} sx={{ mb: 2 }}>
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
                  {userClockRecords.length > 0 ? (
                    userClockRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{format(record.clockInTime, 'yyyy-MM-dd')}</TableCell>
                        <TableCell>
                          {format(record.clockInTime, 'h:mm a')}
                          {record.isDateBack && (
                            <Chip size="small" label="Backdated" color="warning" sx={{ ml: 1 }} />
                          )}
                        </TableCell>
                        <TableCell>
                          {record.clockOutTime ? format(record.clockOutTime, 'h:mm a') : '-'}
                        </TableCell>
                        <TableCell>
                          {record.clockOutTime 
                            ? `${Math.round((record.clockOutTime.getTime() - record.clockInTime.getTime()) / (1000 * 60 * 60))} hrs` 
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            size="small" 
                            label={record.clockOutTime ? "Completed" : "Active"} 
                            color={record.clockOutTime ? "success" : "info"} 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No recent clock records</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
        
        {currentUser.role !== UserRole.STAFF && (
          <TabPanel value={tabValue} index={3}>
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
      
      {/* Backdated Entry Dialog */}
      <Dialog open={backDateDialogOpen} onClose={() => setBackDateDialogOpen(false)}>
        <DialogTitle>
          {clockInType === 'in' ? 'Backdate Clock In' : 'Backdate Clock Out'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, width: '400px' }}>
            <DateTimePicker
              label="Date and Time"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
            />
            
            <TextField
              label="Notes"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Please provide a reason for the backdated entry"
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={isBackdated} 
                  onChange={(e) => setIsBackdated(e.target.checked)} 
                  disabled
                />
              }
              label="Mark as backdated entry"
            />
            
            <Alert severity="info">
              Backdated entries must be approved by your supervisor and will be marked as such in the system.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackDateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={submitBackdatedEntry} 
            variant="contained" 
            color="primary"
            disabled={!selectedDate || !notes}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 