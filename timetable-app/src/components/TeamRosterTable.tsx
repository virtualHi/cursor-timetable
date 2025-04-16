import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Avatar,
  styled
} from '@mui/material';
import { format, addDays, parseISO, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Today as TodayIcon } from '@mui/icons-material';
import { users, rosterEntries } from '../data/mockData';
import { UserRole, RosterEntry, ApprovalStatus } from '../models/types';

// Styled components
const TimeSlotHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  fontWeight: 'bold',
  textAlign: 'center',
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const TimeSlotCell = styled(Box)(({ theme }) => ({
  height: '100%',
  borderRight: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  minWidth: '100px',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const UserRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  height: '120px',
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '200px',
  padding: theme.spacing(1),
  borderRight: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const UserDetails = styled(Box)({
  marginLeft: '12px',
  overflow: 'hidden',
});

const RosterEvent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status' && prop !== 'startPercent' && prop !== 'widthPercent'
})<{ status: ApprovalStatus; startPercent: number; widthPercent: number }>(({ theme, status, startPercent, widthPercent }) => {
  const getColor = () => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return '#E3F2FD'; // Light blue background
      case ApprovalStatus.PENDING:
        return '#FFF8E1'; // Light yellow background
      case ApprovalStatus.REJECTED:
        return '#FFEBEE'; // Light red background
      default:
        return '#E8F5E9'; // Light green background
    }
  };

  const getBorderColor = () => {
    switch (status) {
      case ApprovalStatus.APPROVED:
        return '#2196F3'; // Blue border
      case ApprovalStatus.PENDING:
        return '#FFC107'; // Yellow border
      case ApprovalStatus.REJECTED:
        return '#F44336'; // Red border
      default:
        return '#4CAF50'; // Green border
    }
  };

  return {
    position: 'absolute',
    height: '80px',
    top: 'calc(50% - 40px)',
    left: `${startPercent}%`,
    width: `${widthPercent}%`,
    backgroundColor: getColor(),
    border: `2px solid ${getBorderColor()}`,
    borderLeft: `6px solid ${getBorderColor()}`,
    borderRadius: '4px',
    padding: theme.spacing(1),
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    zIndex: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    '&:hover': {
      zIndex: 2,
      boxShadow: theme.shadows[8],
      transform: 'translateY(-2px)',
      transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    },
  };
});

// Time slots from 9:00 to 18:00
const timeSlots = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return `${hour}:00`;
});

// Calculate position and width of events
const calculateEventPosition = (entry: RosterEntry, selectedDate: Date) => {
  // Check if the entry is on the selected date
  if (!isSameDay(entry.start, selectedDate)) return null;

  const startHour = entry.start.getHours();
  const startMinute = entry.start.getMinutes();
  const endHour = entry.end.getHours();
  const endMinute = entry.end.getMinutes();

  // Calculate percentage position on the time grid
  // Each column represents an hour, from the start of that hour to the start of the next hour
  // The grid starts at 9:00 and ends at 19:00 (covering 10 one-hour slots)
  const dayStartHour = 9; // 9:00 AM
  const dayEndHour = 19; // 7:00 PM (end of the last displayed hour)
  const totalMinutes = (dayEndHour - dayStartHour) * 60;

  const startMinuteOffset = (startHour - dayStartHour) * 60 + startMinute;
  const endMinuteOffset = (endHour - dayStartHour) * 60 + endMinute;
  
  const startPercent = Math.max(0, (startMinuteOffset / totalMinutes) * 100);
  const widthPercent = Math.min(100 - startPercent, ((endMinuteOffset - startMinuteOffset) / totalMinutes) * 100);

  return { startPercent, widthPercent };
};

const TeamRosterTable: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'day' | 'week'>('day');

  // Handle date navigation
  const handleNavigate = (action: 'prev' | 'next' | 'today') => {
    if (action === 'prev') {
      setSelectedDate(prevDate => addDays(prevDate, -1));
    } else if (action === 'next') {
      setSelectedDate(prevDate => addDays(prevDate, 1));
    } else {
      setSelectedDate(new Date());
    }
  };

  // Filter users to only show staff and team leaders
  const teamMembers = users.filter(user => 
    user.role === UserRole.STAFF || user.role === UserRole.TEAM_LEADER
  );

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 190px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header with navigation controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Team Calendar Dashboard</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => handleNavigate('prev')}>
            <ChevronLeft />
          </IconButton>
          
          <Button 
            variant="text" 
            onClick={() => handleNavigate('today')}
            startIcon={<TodayIcon />}
          >
            Today
          </Button>
          
          <Typography variant="subtitle1">
            {format(selectedDate, "MMMM d, yyyy")}
          </Typography>
          
          <IconButton onClick={() => handleNavigate('next')}>
            <ChevronRight />
          </IconButton>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>View</InputLabel>
            <Select
              value={view}
              onChange={(e) => setView(e.target.value as 'day' | 'week')}
              label="View"
            >
              <MenuItem value="day">Day</MenuItem>
              <MenuItem value="week">Week</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Calendar grid */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        {/* Time slots header */}
        <Box sx={{ display: 'flex', position: 'sticky', top: 0, zIndex: 2 }}>
          {/* Empty corner cell */}
          <Box sx={{ 
            width: '200px', 
            borderRight: '1px solid', 
            borderBottom: '1px solid', 
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '50px',
          }}>
            <Typography variant="subtitle2" color="text.secondary">Team Member</Typography>
          </Box>
          
          {/* Time slot headers */}
          {timeSlots.map((time, index) => {
            const hour = index + 9;
            const nextHour = hour + 1;
            const timeRangeDisplay = `${hour}:00 - ${nextHour}:00`;
            
            return (
              <TimeSlotHeader key={time} sx={{ flex: 1, minWidth: 100 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">{time}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    to {nextHour}:00
                  </Typography>
                </Box>
              </TimeSlotHeader>
            );
          })}
        </Box>

        {/* User rows with events */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {teamMembers.map(user => {
            // Get all roster entries for this user on selected date
            const userEntries = rosterEntries.filter(entry => 
              entry.userId === user.id && isSameDay(entry.start, selectedDate)
            );

            return (
              <UserRow key={user.id} sx={{ display: 'flex' }}>
                {/* User info */}
                <UserInfo>
                  <Avatar sx={{ 
                    bgcolor: user.role === UserRole.TEAM_LEADER ? 'primary.main' : 'secondary.main',
                    width: 40,
                    height: 40
                  }}>
                    {user.name.charAt(0)}
                  </Avatar>
                  <UserDetails>
                    <Typography variant="subtitle2" noWrap>{user.name}</Typography>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {user.role === UserRole.TEAM_LEADER ? 'Team Leader' : 'Staff'}
                    </Typography>
                  </UserDetails>
                </UserInfo>
                
                {/* Time slots with events */}
                <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative' }}>
                  {timeSlots.map((time, index) => (
                    <TimeSlotCell key={time} sx={{ flex: 1, minWidth: 100 }} />
                  ))}
                  
                  {/* Overlay events on the time slots */}
                  {userEntries.map(entry => {
                    const position = calculateEventPosition(entry, selectedDate);
                    if (!position) return null;
                    
                    return (
                      <RosterEvent 
                        key={entry.id}
                        status={entry.status}
                        startPercent={position.startPercent}
                        widthPercent={position.widthPercent}
                      >
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                              lineHeight: 1.3,
                              mb: 0.75,
                              color: 'text.primary',
                            }}
                          >
                            {entry.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.85rem',
                              lineHeight: 1.2
                            }}
                          >
                            {format(entry.start, 'HH:mm')} - {format(entry.end, 'HH:mm')}
                          </Typography>
                        </Box>
                      </RosterEvent>
                    );
                  })}
                </Box>
              </UserRow>
            );
          })}
        </Box>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: '#E3F2FD', 
            border: '2px solid #2196F3', 
            borderRadius: '2px',
            mr: 1 
          }} />
          <Typography variant="caption">Meeting</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: '#FFF8E1', 
            border: '2px solid #FFC107', 
            borderRadius: '2px',
            mr: 1 
          }} />
          <Typography variant="caption">Focus Time</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 16, 
            height: 16, 
            bgcolor: '#E8F5E9', 
            border: '2px solid #4CAF50', 
            borderRadius: '2px',
            mr: 1 
          }} />
          <Typography variant="caption">Out of Office</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TeamRosterTable; 