import { User, UserRole, RosterEntry, Team, WorkLocation, ApprovalStatus, ClockRecord } from '../models/types';
import { addDays, addHours, startOfWeek, format, subDays } from 'date-fns';

// Generate a random ID
const generateId = (): string => Math.random().toString(36).substring(2, 9);

// Current week's Monday as the start date for our roster
const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

// Mock users data
export const users: User[] = [
  {
    id: 'u1',
    name: 'John Smith',
    role: UserRole.SERVICE_SUPERVISOR,
  },
  {
    id: 'u2',
    name: 'Emma Johnson',
    role: UserRole.TEAM_LEADER,
    teamId: 't1'
  },
  {
    id: 'u3',
    name: 'Michael Brown',
    role: UserRole.TEAM_LEADER,
    teamId: 't2'
  },
  {
    id: 'u4',
    name: 'Sarah Davis',
    role: UserRole.STAFF,
    teamId: 't1'
  },
  {
    id: 'u5',
    name: 'James Wilson',
    role: UserRole.STAFF,
    teamId: 't1'
  },
  {
    id: 'u6',
    name: 'Linda Taylor',
    role: UserRole.STAFF,
    teamId: 't2'
  },
  {
    id: 'u7',
    name: 'Robert Martinez',
    role: UserRole.STAFF,
    teamId: 't2'
  }
];

// Mock teams data
export const teams: Team[] = [
  {
    id: 't1',
    name: 'Development Team',
    leaderId: 'u2'
  },
  {
    id: 't2',
    name: 'Support Team',
    leaderId: 'u3'
  }
];

// Helper function to create a roster entry
const createRosterEntry = (
  userId: string,
  title: string,
  dayOffset: number,
  startHour: number,
  endHour: number,
  location: WorkLocation,
  tasks: string,
  status: ApprovalStatus
): RosterEntry => {
  const start = addHours(addDays(currentWeekStart, dayOffset), startHour);
  const end = addHours(addDays(currentWeekStart, dayOffset), endHour);
  
  return {
    id: generateId(),
    userId,
    title,
    start,
    end,
    location,
    tasks,
    status,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  };
};

// Mock roster entries for the current week
export const rosterEntries: RosterEntry[] = [
  // Supervisor (John Smith) roster
  createRosterEntry('u1', 'Team Meeting', 0, 9, 10, WorkLocation.OFFICE, 'Weekly team meeting', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Project Planning', 0, 10, 17, WorkLocation.OFFICE, 'Planning for the next quarter', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Client Meeting', 1, 10, 12, WorkLocation.SITE_A, 'Meeting with client A', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Documentation', 1, 13, 17, WorkLocation.OFFICE, 'Update project documentation', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Team Review', 2, 9, 17, WorkLocation.OFFICE, 'Review team performance', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Site Inspection', 3, 9, 12, WorkLocation.SITE_B, 'Inspect progress at Site B', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Reporting', 3, 13, 17, WorkLocation.OFFICE, 'Prepare weekly reports', ApprovalStatus.APPROVED),
  createRosterEntry('u1', 'Training', 4, 9, 17, WorkLocation.OFFICE, 'Conduct team training', ApprovalStatus.APPROVED),
  
  // Team Leader 1 (Emma Johnson) roster
  createRosterEntry('u2', 'Team Meeting', 0, 9, 10, WorkLocation.OFFICE, 'Weekly team meeting', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Code Review', 0, 10, 17, WorkLocation.OFFICE, 'Review team code submissions', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Project Work', 1, 9, 17, WorkLocation.OFFICE, 'Work on project A', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Client Call', 2, 10, 11, WorkLocation.OFFICE, 'Update call with client', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Team Mentoring', 2, 11, 17, WorkLocation.OFFICE, 'Mentoring junior devs', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Project Work', 3, 9, 17, WorkLocation.REMOTE, 'Remote work day', ApprovalStatus.APPROVED),
  createRosterEntry('u2', 'Planning', 4, 9, 12, WorkLocation.OFFICE, 'Plan next sprint', ApprovalStatus.PENDING),
  createRosterEntry('u2', 'Documentation', 4, 13, 17, WorkLocation.OFFICE, 'Update technical docs', ApprovalStatus.PENDING),
  
  // Staff 1 (Sarah Davis) roster
  createRosterEntry('u4', 'Team Meeting', 0, 9, 10, WorkLocation.OFFICE, 'Weekly team meeting', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Development', 0, 10, 17, WorkLocation.OFFICE, 'Implement feature X', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Development', 1, 9, 17, WorkLocation.OFFICE, 'Continue work on feature X', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Testing', 2, 9, 17, WorkLocation.OFFICE, 'Test feature X', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Bugfix', 3, 9, 12, WorkLocation.OFFICE, 'Fix reported bugs', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Documentation', 3, 13, 17, WorkLocation.OFFICE, 'Document feature X', ApprovalStatus.APPROVED),
  createRosterEntry('u4', 'Training', 4, 9, 12, WorkLocation.OFFICE, 'Attend training session', ApprovalStatus.PENDING),
  createRosterEntry('u4', 'Development', 4, 13, 17, WorkLocation.OFFICE, 'Start feature Y', ApprovalStatus.PENDING),
  
  // Add more roster entries for other staff as needed
  createRosterEntry('u5', 'Team Meeting', 0, 9, 10, WorkLocation.OFFICE, 'Weekly team meeting', ApprovalStatus.APPROVED),
  createRosterEntry('u5', 'Development', 0, 10, 17, WorkLocation.OFFICE, 'Work on feature Z', ApprovalStatus.APPROVED),
  createRosterEntry('u5', 'Client Meeting', 1, 10, 12, WorkLocation.SITE_A, 'Present feature Z to client', ApprovalStatus.APPROVED),
  createRosterEntry('u5', 'Development', 1, 13, 17, WorkLocation.OFFICE, 'Implement feedback', ApprovalStatus.APPROVED),
  createRosterEntry('u5', 'Team Huddle', 2, 9, 10, WorkLocation.OFFICE, 'Daily team review', ApprovalStatus.APPROVED),
  createRosterEntry('u5', 'Development', 2, 10, 17, WorkLocation.REMOTE, 'Remote work day', ApprovalStatus.APPROVED),
  
  // Team Leader 2 (Michael Brown) roster
  createRosterEntry('u3', 'Support Planning', 0, 9, 17, WorkLocation.OFFICE, 'Plan support schedule', ApprovalStatus.APPROVED),
  createRosterEntry('u3', 'Client Support', 1, 9, 17, WorkLocation.SITE_B, 'On-site client support', ApprovalStatus.APPROVED),
  createRosterEntry('u3', 'Team Meeting', 2, 9, 10, WorkLocation.OFFICE, 'Weekly team meeting', ApprovalStatus.APPROVED),
];

// Mock clock records
export const clockRecords: ClockRecord[] = [
  // John Smith (Service Supervisor) clock records
  {
    id: generateId(),
    userId: 'u1',
    clockInTime: new Date(new Date().setHours(9, 2, 0, 0)),
    clockOutTime: new Date(new Date().setHours(17, 15, 0, 0)),
    isDateBack: false,
  },
  {
    id: generateId(),
    userId: 'u1',
    clockInTime: new Date(subDays(new Date(), 1).setHours(8, 55, 0, 0)),
    clockOutTime: new Date(subDays(new Date(), 1).setHours(17, 30, 0, 0)),
    isDateBack: false,
  },
  {
    id: generateId(),
    userId: 'u1',
    clockInTime: new Date(subDays(new Date(), 2).setHours(9, 0, 0, 0)),
    clockOutTime: new Date(subDays(new Date(), 2).setHours(16, 45, 0, 0)),
    isDateBack: false,
  },
  {
    id: generateId(),
    userId: 'u1',
    clockInTime: new Date(subDays(new Date(), 3).setHours(9, 10, 0, 0)),
    clockOutTime: new Date(subDays(new Date(), 3).setHours(17, 5, 0, 0)),
    isDateBack: true, // Backdated entry example
  },
  {
    id: generateId(),
    userId: 'u1',
    clockInTime: new Date(subDays(new Date(), 4).setHours(8, 50, 0, 0)),
    clockOutTime: new Date(subDays(new Date(), 4).setHours(17, 0, 0, 0)),
    isDateBack: false,
  },
  
  // Emma Johnson (Team Leader) clock records
  {
    id: generateId(),
    userId: 'u2',
    clockInTime: new Date(new Date().setHours(8, 45, 0, 0)),
    clockOutTime: new Date(new Date().setHours(17, 30, 0, 0)),
    isDateBack: false,
  },
  
  // Sarah Davis (Staff) clock records
  {
    id: generateId(),
    userId: 'u4',
    clockInTime: new Date(new Date().setHours(9, 5, 0, 0)),
    isDateBack: false, // No clockOutTime means still clocked in
  },
  {
    id: generateId(),
    userId: 'u4',
    clockInTime: new Date(subDays(new Date(), 1).setHours(9, 0, 0, 0)),
    clockOutTime: new Date(subDays(new Date(), 1).setHours(17, 0, 0, 0)),
    isDateBack: false,
  },
];

// Helper function to convert roster entries to calendar events
export const getRosterEventsForCalendar = () => {
  return rosterEntries.map(entry => {
    const user = users.find(u => u.id === entry.userId);
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
      title: `${user?.name}: ${entry.title}`,
      start: entry.start,
      end: entry.end,
      backgroundColor,
      borderColor: backgroundColor,
      extendedProps: {
        userId: entry.userId,
        location: entry.location,
        tasks: entry.tasks,
        status: entry.status
      }
    };
  });
}; 