// User roles in the system
export enum UserRole {
  STAFF = 'staff',
  TEAM_LEADER = 'team_leader',
  SERVICE_SUPERVISOR = 'service_supervisor'
}

// Approval status for roster entries
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Locations where work can be performed
export enum WorkLocation {
  OFFICE = 'office',
  SITE_A = 'site_a',
  SITE_B = 'site_b',
  REMOTE = 'remote'
}

// Interface for user data
export interface User {
  id: string;
  name: string;
  role: UserRole;
  teamId?: string; // Optional team ID for staff members
}

// Interface for roster entry
export interface RosterEntry {
  id: string;
  userId: string;
  title: string;
  start: Date;
  end: Date;
  location: WorkLocation;
  tasks: string;
  status: ApprovalStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for clock records
export interface ClockRecord {
  id: string;
  userId: string;
  clockInTime: Date;
  clockOutTime?: Date; // Optional as it might not exist yet
  isDateBack: boolean; // Flag for retroactively logged records
  rosterId?: string; // Associated roster entry if any
}

// Interface for team data
export interface Team {
  id: string;
  name: string;
  leaderId: string;
} 