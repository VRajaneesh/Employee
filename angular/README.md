# Employee Directory Angular Frontend

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
4. **Make sure the backend is running in the `employee` folder:**
   ```sh
   python -m employee_app.app.app
   ```
   - The backend should run at [http://localhost:5000](http://localhost:5000).

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

## Folder Guide

- `src/app/components/` – All UI components (employee list, form, dialogs, login, register)
- `src/app/services/` – API and authentication services
- `src/app/guards/` – Route guards for authentication
- `src/app/app.module.ts` – Main Angular module
- `src/app/app-routing.module.ts` – Routing setup
- `karma.conf.js` – Test runner configuration

## What This App Does

- List, add, edit, and delete employees
- Search, sort, and filter employees
- Login and register users (JWT authentication)
- Responsive Material UI
- Form validation and error messages
- Confirmation dialogs for delete actions

## Troubleshooting

- If you see errors, check that both frontend and backend are running.
- For test errors, make sure you’re in the `angular` folder and have run `npm install`.
- For backend errors, check the Flask server in the `employee` folder.

## Troubleshooting: Test Report Not Generated

If you run `npx ng test --watch=false` and do not see an HTML report:

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

---

This README is designed for anyone, even if you’re new to the project. Follow the steps above to get started quickly.
