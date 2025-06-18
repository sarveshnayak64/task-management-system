# Task Management System

## ○ Tech stack used
- Node Js, React, Tailwind CSS and MySQL

## ○ Project setup guidelines
The project file has frontend, backend and db.sql file
Import the db.sql in mySQl

### Navigate to backend folder
- Change the .env file with the mySQL database details
- Install all the dependencies using "npm install"
- Run 'npm run start' to start the project at port 3001

### Navigate to frontend folder
- Update the API_BASE_URL in frontend/src/api.js to the backend url(keep unchanged for local)
- Install all the dependencied using "npm install"
- Run 'npm run start' to start the frontend at port 3000

## ○ A quick paragraph with how you approached the project, what you liked, what you didn’t like, and where you faced issues.

To structure the project I went with building the database first and narrowed down the project into 4 tables mainly users, projects, tasks and comments with their respective columns with proper data types and relations. This gave me a clear vison to go proceed with the backend where i created models, routes and controllers for the same 4 tables and binded it with sql creating few API's. For authentication i used JWT and stored all the sql connection details in environment file. Frontend was the most time consuming with using the main 3 hooks useState(state management), useEffect(check for changes) and useContext(wrapped around the entire app for authentication) along-side created a custom hook useAuth to know the state of the authentication. The only 2 full paint components are Auth(Login and register) and ProjectDetails(which CRUD on Projects , Tasks and Comments(with replies)). Stored jwt and user details in localStorage, created shared modal component for error display and other CRUD operations , an apiRequest helper function to optimise the API calls. Finally designed and styled the frontend with tailwindcss for an attractive interaction.

The project was simple yet lengthy one, making time the only issue i faced. Understanding the time limit I created shared components and eleminated frontend routing instead nested the components.


## ○ Estimated time to complete your test.
under 24 hours since i acknowledged the task