
# College Research Project Management System

A full-stack web application designed to streamline college research project management by connecting students, faculty members, administrators, and industry partners through a centralized platform.

The system helps organize research opportunities, student applications, project approvals, and progress tracking throughout the research lifecycle.

## Features

- **Role-Based Access:** Separate workflows for Students, Faculty, Administrators, and Company/Industry Partners.
- **Research Project Management:** Manage research projects and opportunities.
- **Student Applications:** Support applications for available research projects.
- **Faculty Review:** Facilitate application review and project supervision.
- **Project Progress Tracking:** Organize project updates and progress information.
- **Reporting and Analytics:** Support reporting features for research project management.
- **Database Management:** Store and manage structured application data using MySQL.

> Feature availability may vary depending on the current implementation.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Development Tools | Git, GitHub, VS Code, Postman |
| Database Environment | XAMPP / MySQL |

## Project Structure

```text
college-research-project-management-system/
├── backend/
│   └── Backend source code and API logic
├── database/
│   └── Database schema and related SQL files
├── frontend/
│   └── React frontend application
├── .gitignore
├── README.md
└── requirements.txt
```

## System Architecture

The application follows a client-server architecture.

1. The React frontend provides the user interface.
2. The backend handles application logic and API requests.
3. The MySQL database stores and manages research project information.
4. The frontend communicates with the backend through API requests.

### High-Level Workflow

```text
Students / Faculty / Admin / Companies
                  |
                  v
           React Frontend
                  |
                  v
          Backend API Layer
                  |
                  v
             MySQL Database
                  |
                  v
       Project Data and Reports
```

## Getting Started

### Prerequisites

Install the following tools:

- Node.js and npm
- MySQL Server or XAMPP
- Git
- A code editor such as VS Code

### 1. Clone the Repository

```bash
git clone (https://github.com/Brahati/college-research-project-management-system.git)
cd college-research-project-management-system
```

### 2. Set Up the Database

1. Start your MySQL server.
2. Open phpMyAdmin or another MySQL client.
3. Create the database required by the application.
4. Import the SQL files available in the `database/` directory.
5. Verify the database name and configuration expected by the backend.

### 3. Configure and Start the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Configure the required environment variables in a local `.env` file. For example:

```dotenv
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=college_rpm_system
```

Use the actual variable names and database name expected by your source code. Never commit real credentials.

Start the backend using the script defined in `backend/package.json`. For example:

```bash
npm start
```

### 4. Configure and Start the Frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

Start the frontend using the script defined in `frontend/package.json`. For a Vite application, this is typically:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

> **Note:** Verify the actual commands, configuration variables, database setup, and application entry points before following these instructions. The repository structure may require additional setup steps.

## Database

The `database/` directory contains the database-related files for the application.

The database supports the storage and management of information such as:

- User accounts and roles
- Research project details
- Student applications
- Project assignments and progress
- Reporting-related data

Refer to the actual database schema for table definitions and relationships.

## Security Considerations

- Keep database credentials and application secrets outside the source code.
- Exclude `.env` files, sensitive data, and local database files where appropriate.
- Validate incoming requests on the backend.
- Enforce role-based authorization for protected operations.
- Use secure password hashing and appropriate session or token management.

## Future Improvements

- Expand automated testing for API endpoints and database operations.
- Improve validation and error handling.
- Enhance research project reporting and analytics.
- Strengthen access control and application security.
- Add deployment documentation and continuous integration.
