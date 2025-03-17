# Team Duty Roster App

A web application for managing team duty rosters and clock-in/clock-out records for small teams of up to 30 people.

## Project Overview

This application allows teams to manage their work schedules efficiently with different permission levels based on roles. The system supports three roles: staff, team leader, and service supervisor, each with appropriate permissions for roster management.

### Key Features

- **Roster Management**: Users can create, edit, and submit their duty rosters including working time, location, and tasks
- **Approval Workflow**: Staff submit rosters to team leaders, team leaders to service supervisors, with appropriate approval chains
- **Dashboard View**: Gantt-style calendar view showing everyone's schedule for easy visualization
- **Clock In/Out System**: Track work hours with clock-in and clock-out functionality
- **Retroactive Logging**: Ability to log missed clock-in/out records with appropriate flagging
- **Role-Based Permissions**: Different capabilities based on user roles

## Current Progress

The project is currently in active development with the following components implemented:

- ✅ Core UI framework using React, TypeScript, and Material UI
- ✅ Navigation system with role-appropriate views
- ✅ Gantt-style calendar view for team roster visualization
- ✅ Personal roster management with calendar view interface
- ✅ Clock in/out user interface with history tracking
- ✅ Backdated entry forms for missed clock events
- ✅ Mock data for testing and demonstration

### Next Steps

- Backend API integration
- User authentication system
- Real-time notifications
- Calendar export functionality
- Mobile responsive design improvements

## Setup and Running Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v8 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cursor-timetable.git
   cd cursor-timetable
   ```

2. Install dependencies for the main app:
   ```
   cd timetable-app
   npm install --legacy-peer-deps
   ```

### Running the Development Server

1. From the timetable-app directory, start the development server:
   ```
   npm start
   ```

2. Access the application:
   - Local development: http://localhost:3000
   - Network access: http://YOUR_IP_ADDRESS:3000 (where YOUR_IP_ADDRESS is your machine's IP address)

### Environment Configuration

The application has been configured to be accessible from other devices on the same network by binding to all network interfaces (0.0.0.0) rather than just localhost. This is particularly useful when:

- Testing on different devices
- Running in a team environment
- Deploying on a development server

## Project Structure

- `timetable-app/` - Main React application
  - `src/components/` - UI components
  - `src/models/` - TypeScript interfaces and types
  - `src/data/` - Mock data for development

## Notes for Deployment

For production deployment, consider:
1. Setting up proper authentication
2. Configuring secure HTTPS
3. Implementing a proper backend with database storage
4. Setting up environment-specific configuration files