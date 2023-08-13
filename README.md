# Urban Waste Collection 2.0
Fullstack project for managing a Garbage Collection System. Details below

## Features
* Seperateed Admin/Empoyee/No-login API interface
* Employees/Vehicles/Collection Location management (mostly CRUD)
* Personal Calendar
* Assigning task to employee (who drive which truck to which location and collect from who, come back before when)
* Guide to collection location using by order and by real time progress (Leaflet Map API)
* Group and p2p messaging

## Technologies Used
- Frontend:
  * Framework: ReactJs
  * State Management Technology: useContext hook + useReducer
  * Login Token method: localStorage
  * CSS Framework: Material UI
  * Map API: Leaflet
- Backend: 
  * Platform: NodeJs
  * Framework: Express
  * Password encryption technology: bcrypt
  * ORM: mongoose
  * Realtime Communication: Socket.io
- Database: MongoDB

## Directory Structure
```
├── server/ # Backend source code
├── /# Frontend source code
└── README.md # Main documentation (this file)
```
## Installation

Provide instructions on how to set up and configure the development environment for your project. You might include steps like:

1. Clone this repository by running the following command in your terminal: git clone https://github.com/tuankiet091002/UWC_self.git
2. Navigate to the project directory: cd UWC_self
3. Install the necessary dependencies in frontend (current) and backend (cd server) directories: npm install
4. Start the application: npm start
