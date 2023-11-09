# Web Client for Kanban Board Task Management System

## About this project
This project is the frontend for [kanbanwebservices](https://github.com/geekinDpink/KanbanWebServer) and is part of the Kanban Board/Task Management system which adopts a N-tier architeture with the following logical layers:
- Presentation layer: Kanban Frontend (Display interface to user)
- Application/Business Logic Layer: Kanban WebServer (Implement Core functionality)
- Database Layer: Interact with database and handle data

## Brief Overview of Tech Stack
Developed with React and bundle with webpack. System is designed with the Model View Controller (MVC) architecture in mind, where there is unidirectional flow of data. This frontend is serving as the view layer, though retrospectively speaking React component do also act like Controllers.
The styling library used is React Bootstrap.To handle user authorisation/access to specific features/page, reducer and context is used to have a centralized state to track type of user and user groups.

## Type of Users
1. Admin - Able to create and assign user group to user and access user management dashboard (Home Page). 
2. User - Able to view kanban board (Home Page)

## User Group
Admin is able to create new user group e.g. DevOps. However, there are default user groups
1. Project Manager (PM)
2. Project Lead (PL)
3. Developer (Dev)

## Kanban Board Functionality
Task Management System that allows the creation and management of tasks by promoting and demoting the task state.
Task states range from Open -> Doing -> Done -> Closed

### Workflow
- PM: Creation of App (New board)
- PM: Assign user group to its respective state (for promotion and demotion of task state)
- PL: Create Task
- Task State Owner: Promote and Demote (certain) task states
- All: Add notes
