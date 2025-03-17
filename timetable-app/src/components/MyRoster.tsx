import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Stack,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { Calendar, dateFnsLocalizer, View, SlotInfo } from 'react-big-calendar';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, parse, startOfWeek, getDay, addHours, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { rosterEntries as mockRosterEntries } from '../data/mockData';
import { User, RosterEntry, WorkLocation, ApprovalStatus } from '../models/types';

interface MyRosterProps {
  currentUser: User;
}

// Setup the localizer for date-fns
const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Week starts on Monday
  getDay,
  locales,
});

const MyRoster: React.FC<MyRosterProps> = ({ currentUser }) => {
  // State for calendar view
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  
  // State for roster entries
  const [rosterEntries, setRosterEntries] = useState<RosterEntry[]>(
    mockRosterEntries.filter(entry => entry.userId === currentUser.id)
  );
  
  // State for the roster entry form dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<Partial<RosterEntry>>({
    userId: currentUser.id,
    title: '',
    start: new Date(),
    end: addHours(new Date(), 1),
    location: WorkLocation.OFFICE,
    tasks: '',
    status: ApprovalStatus.PENDING
  });
  
  // Handle opening the dialog for creating a new entry
  const handleAddEntry = () => {
    setEditMode(false);
    setCurrentEntry({
      userId: currentUser.id,
      title: '',
      start: new Date(),
      end: addHours(new Date(), 1),
      location: WorkLocation.OFFICE,
      tasks: '',
      status: ApprovalStatus.PENDING
    });
    setDialogOpen(true);
  };
  
  // Handle slot selection in calendar (for creating new entries)
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setEditMode(false);
    setCurrentEntry({
      userId: currentUser.id,
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
      location: WorkLocation.OFFICE,
      tasks: '',
      status: ApprovalStatus.PENDING
    });
    setDialogOpen(true);
  };
  
  // Handle event selection in calendar (for editing entries)
  const handleSelectEvent = (event: any) => {
    const entry = rosterEntries.find(entry => entry.id === event.id);
    if (entry) {
      setEditMode(true);
      setCurrentEntry({...entry});
      setDialogOpen(true);
    }
  };
  
  // Handle opening the dialog for editing an existing entry
  const handleEditEntry = (entryId: string) => {
    const entry = rosterEntries.find(entry => entry.id === entryId);
    if (entry) {
      setEditMode(true);
      setCurrentEntry({...entry});
      setDialogOpen(true);
    }
  };
  
  // Handle deleting an entry
  const handleDeleteEntry = (entryId: string) => {
    setRosterEntries(rosterEntries.filter(entry => entry.id !== entryId));
  };
  
  // Handle submitting an entry for approval
  const handleSubmitForApproval = (entryId: string) => {
    setRosterEntries(rosterEntries.map(entry => 
      entry.id === entryId 
        ? {...entry, status: ApprovalStatus.PENDING, updatedAt: new Date()} 
        : entry
    ));
  };
  
  // Handle saving a roster entry
  const handleSaveEntry = () => {
    if (!currentEntry.title || !currentEntry.start || !currentEntry.end || !currentEntry.tasks) {
      return; // Don't save if required fields are missing
    }
    
    if (isAfter(currentEntry.start as Date, currentEntry.end as Date)) {
      return; // Don't save if start time is after end time
    }
    
    const now = new Date();
    
    if (editMode && currentEntry.id) {
      // Update existing entry
      setRosterEntries(rosterEntries.map(entry => 
        entry.id === currentEntry.id 
          ? {
              ...entry,
              title: currentEntry.title || entry.title,
              start: currentEntry.start || entry.start,
              end: currentEntry.end || entry.end,
              location: currentEntry.location || entry.location,
              tasks: currentEntry.tasks || entry.tasks,
              status: ApprovalStatus.PENDING, // Set to pending when edited
              updatedAt: now
            } 
          : entry
      ));
    } else {
      // Create new entry
      const newEntry: RosterEntry = {
        id: Math.random().toString(36).substring(2, 9), // Generate a simple ID
        userId: currentUser.id,
        title: currentEntry.title || '',
        start: currentEntry.start || new Date(),
        end: currentEntry.end || addHours(new Date(), 1),
        location: currentEntry.location || WorkLocation.OFFICE,
        tasks: currentEntry.tasks || '',
        status: ApprovalStatus.PENDING,
        createdAt: now,
        updatedAt: now
      };
      
      setRosterEntries([...rosterEntries, newEntry]);
    }
    
    setDialogOpen(false);
  };

  // Navigation handlers
  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(date);
    
    if (action === 'PREV') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (action === 'NEXT') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      return setDate(new Date());
    }
    
    setDate(newDate);
  };
  
  // Convert roster entries to calendar events
  const calendarEvents = rosterEntries.map(entry => {
    let backgroundColor;
    
    // Color-code based on approval status
    switch(entry.status) {
      case ApprovalStatus.APPROVED:
        backgroundColor = '#4caf50'; // Green
        break;
      case ApprovalStatus.PENDING:
        backgroundColor = '#ff9800'; // Orange
        break;
      case ApprovalStatus.REJECTED:
        backgroundColor = '#f44336'; // Red
        break;
      default:
        backgroundColor = '#2196f3'; // Blue
    }
    
    return {
      id: entry.id,
      title: entry.title,
      start: entry.start,
      end: entry.end,
      backgroundColor,
      borderColor: backgroundColor,
      extendedProps: {
        location: entry.location,
        tasks: entry.tasks,
        status: entry.status
      }
    };
  });
  
  // Event style customization
  const eventStyleGetter = (event: any) => {
    return {
      style: {
        backgroundColor: event.backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: 'bold',
      }
    };
  };

  // Custom event component with tooltip
  const EventComponent = ({ event }: any) => (
    <Tooltip
      title={
        <div>
          <Typography variant="subtitle1">{event.title}</Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {event.extendedProps.location}
          </Typography>
          <Typography variant="body2">
            <strong>Tasks:</strong> {event.extendedProps.tasks}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {event.extendedProps.status}
          </Typography>
          <Typography variant="body2" color="lightgrey" sx={{ mt: 1, fontSize: '0.8rem' }}>
            Click to edit
          </Typography>
        </div>
      }
      arrow
    >
      <Typography
        variant="body2"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '100%',
          lineHeight: 'normal',
          padding: '2px 4px',
        }}
      >
        {event.title}
      </Typography>
    </Tooltip>
  );
  
  return (
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 120px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">My Roster</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleAddEntry}
            sx={{ mr: 2 }}
          >
            Add Entry
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => handleNavigate('PREV')}>
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="subtitle1" sx={{ mx: 1 }}>
              {format(date, 'MMMM yyyy')}
            </Typography>
            
            <IconButton onClick={() => handleNavigate('NEXT')}>
              <ChevronRight />
            </IconButton>
            
            <IconButton onClick={() => handleNavigate('TODAY')} sx={{ ml: 1 }}>
              <Typography variant="button">Today</Typography>
            </IconButton>
          </Box>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={view}
              onChange={(e) => setView(e.target.value as View)}
              label="View"
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="work_week">Work Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip 
            size="small" 
            label="Approved" 
            sx={{ bgcolor: '#4caf50', color: 'white' }} 
          />
          <Chip 
            size="small" 
            label="Pending" 
            sx={{ bgcolor: '#ff9800', color: 'white' }} 
          />
          <Chip 
            size="small" 
            label="Rejected" 
            sx={{ bgcolor: '#f44336', color: 'white' }} 
          />
          <Typography variant="caption" sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
            Click on any empty space to add a new entry, or click on an existing entry to edit it.
          </Typography>
        </Stack>
      </Box>
      
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 80px)' }}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        components={{
          event: EventComponent,
        }}
        formats={{
          dayHeaderFormat: (date: Date) => format(date, 'EEE do MMM'),
        }}
        defaultView="week"
        dayLayoutAlgorithm="no-overlap"
      />
      
      {/* Roster Entry Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md">
        <DialogTitle>
          {editMode ? 'Edit Roster Entry' : 'Add New Roster Entry'}
        </DialogTitle>
        <DialogContent sx={{ minWidth: '500px' }}>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Title"
                  value={currentEntry.title || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, title: e.target.value})}
                  placeholder="e.g., Team Meeting, Client Site Visit"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Start Time *"
                  value={currentEntry.start}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentEntry({...currentEntry, start: newValue});
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="End Time *"
                  value={currentEntry.end}
                  onChange={(newValue) => {
                    if (newValue) {
                      setCurrentEntry({...currentEntry, end: newValue});
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={currentEntry.location || WorkLocation.OFFICE}
                    onChange={(e) => setCurrentEntry({...currentEntry, location: e.target.value as WorkLocation})}
                    label="Location"
                  >
                    <MenuItem value={WorkLocation.OFFICE}>Office</MenuItem>
                    <MenuItem value={WorkLocation.SITE_A}>Site A</MenuItem>
                    <MenuItem value={WorkLocation.SITE_B}>Site B</MenuItem>
                    <MenuItem value={WorkLocation.REMOTE}>Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  label="Tasks"
                  value={currentEntry.tasks || ''}
                  onChange={(e) => setCurrentEntry({...currentEntry, tasks: e.target.value})}
                  placeholder="Describe the tasks for this roster entry"
                />
              </Grid>
            </Grid>
            
            {isAfter(currentEntry.start as Date, currentEntry.end as Date) && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Start time cannot be after end time.
              </Alert>
            )}
            
            <Alert severity="info" sx={{ mt: 2 }}>
              {editMode 
                ? 'Editing this entry will change its status to pending and require approval again.'
                : 'New entries will be created with pending status and require approval.'}
            </Alert>
            
            {editMode && currentEntry.status === ApprovalStatus.APPROVED && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This entry has already been approved. Editing it will require re-approval.
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          {editMode && (
            <Button 
              color="error" 
              onClick={() => {
                if (currentEntry.id) handleDeleteEntry(currentEntry.id);
                setDialogOpen(false);
              }}
              disabled={currentEntry.status === ApprovalStatus.APPROVED}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSaveEntry}
            disabled={
              !currentEntry.title || 
              !currentEntry.start || 
              !currentEntry.end || 
              !currentEntry.tasks ||
              isAfter(currentEntry.start as Date, currentEntry.end as Date)
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MyRoster; 