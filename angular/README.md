# Employee Directory Angular Frontend

# Git Instructions

Clone the repository:
```powershell
git clone https://github.com/VRajaneesh/Employee.git
cd Employee/angular
```

To update your local copy with the latest changes:
```powershell
git pull origin main
```

This is the frontend for the Employee Directory app, built with Angular and Angular Material. It connects to a Flask backend API.

## Quick Start

1. **Open the `angular` folder in your terminal.**
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the Angular app:**
   ```sh
   npm start
   ```
   - The app will run at [http://localhost:4200](http://localhost:4200).

## How to Run Tests

- **Unit tests:**  
  ```sh
  npx ng test --watch=false
  ```
- **Test report (if configured):**  
  Open `test-results/report.html` in your browser.

## Test Reports (HTML)

To generate a detailed HTML test report for your Angular unit tests:

1. Make sure you have the Karma HTML reporter installed:
   ```sh
   npm install karma-html-reporter --save-dev
   ```
2. Update your `karma.conf.js` to include the HTML reporter:
   ```js
   reporters: ['progress', 'html'],
   htmlReporter: {
     outputFile: 'test-results/report.html',
     pageTitle: 'Unit Test Report',
     subPageTitle: 'Angular Project Test Results'
   },
   ```
3. Run your tests:
   ```sh
   npx ng test --karma-config karma.conf.js --watch=false
   ```
4. Open `test-results/report.html` in your browser to view the results.

This report will show all test cases, their status, and details for easy review.

### Folder Guide

- `src/app/components/` – All UI components (employee list, forms, dialogs, login, register, password reset)
- `src/app/services/` – API services (employee, auth), handles HTTP requests
- `src/app/guards/` – Route guards for authentication and access control
- `src/app/models/` – TypeScript interfaces and models for employees, users, etc.
- `src/app/shared/` – Shared modules, pipes, directives, and reusable code
- `src/app/app.module.ts` – Main Angular module (root of the app)
- `src/app/app-routing.module.ts` – Routing setup for all pages
- `src/environments/` – Environment configuration files (API URLs, etc.)
- `assets/` – Static assets (images, icons, styles)
- `karma.conf.js` – Test runner configuration
- `angular.json` – Angular CLI project configuration
- `package.json` – Project dependencies and scripts

## What This App Does


The Employee Directory Angular app provides a complete user interface for managing employees and user accounts:

- **Employee Management:**
   - List all employees with pagination and search
   - Add new employees with validation
   - Edit employee details
   - Delete employees with confirmation dialogs
   - View employee details in a dialog or separate page
   - Filter and sort employees by name, department, etc.

- **User Authentication:**
   - Register new users
   - Login with JWT authentication
   - Logout functionality
   - Route guards to protect pages for authenticated users

- **Password Management:**
   - Forgot password workflow (request reset link)
   - Reset password using token

- **UI/UX:**
   - Responsive Angular Material design for desktop and mobile
   - Form validation and clear error messages
   - Loading indicators and feedback for API actions
   - Accessible forms and navigation

- **Integration:**
   - Connects to Flask backend API for all data and authentication
   - Uses environment configuration for API URLs

- **Testing:**
   - Unit tests for components and services
   - HTML test reports (Karma)


## Troubleshooting: Test Report Not Generated

If you run `npx ng test --watch=false` and do not see an HTML report:

**Note:** Make sure you are in the `angular` folder before running the following commands.
**Command:**  
 ```sh
  cd angular
```

1. **Install the Karma HTML reporter:**
   ```sh
   npm install karma-html-reporter --save-dev
   ```
2. **Update your `karma.conf.js`:**
   Add the following lines:
   ```js
   reporters: ['progress', 'html'],
   htmlReporter: {
     outputFile: 'test-results/report.html',
     pageTitle: 'Unit Test Report',
     subPageTitle: 'Angular Project Test Results'
   },
   ```
   Make sure these are inside the module.exports configuration.
3. **Run the tests again:**
   ```sh
   npx ng test --karma-config karma.conf.js --watch=false
   ```
4. **Open the report:**
   - Go to `test-results/report.html` in your browser to view the results.

If you still do not see the report, check that the `test-results` folder exists and that your `karma.conf.js` is saved correctly.

## Docker Deployment

Use docker-compose to run both backend and frontend together:
   ```powershell
   docker-compose up --build
   ```

- Frontend will be available at http://localhost:4200
- See `docker-compose.yml` for details.

---

