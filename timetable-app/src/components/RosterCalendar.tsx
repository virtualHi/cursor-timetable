import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Box, Typography, Paper, Tooltip, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getRosterEventsForCalendar } from '../data/mockData';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

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

// Tooltip content for events
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

const RosterCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>('week');
  
  // Get events from mock data
  const events = getRosterEventsForCalendar();

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

  return (
    <Paper elevation={3} sx={{ p: 2, height: 'calc(100vh - 120px)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Team Roster</Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
      
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 50px)' }}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
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
    </Paper>
  );
};

export default RosterCalendar; 