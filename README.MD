# Web Client for Kanban Board Task Management System

## About this project
Developed with React and bundle with webpack. It is the frontend for KanbanWebServer project.
System is designed with the Model View Controller (MVC) architecture.

## Persona
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
