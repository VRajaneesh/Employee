## Segregated Tasks & 4-Day Plan

### Day 1: Core Employee Management
**Tasks:**
- Implement Employee List Page using Angular Material Table
- Add sorting and searching functionality
- Connect table to Flask backend via EmployeeService
- Design responsive table layout and search bar

### Day 2: Employee CRUD Operations
**Tasks:**
- Create Add Employee form (Angular Material, validation)
- Implement Edit Employee functionality (pre-filled form, update API)
- Add Delete Employee feature (icon button, confirmation dialog, API call)
- Ensure error handling and validation for all CRUD actions

### Day 3: Integration
**Tasks:**
- Integrate all frontend features with backend API
- Handle loading states and errors gracefully

### Day 4: UI/UX & Finalization
**Tasks:**
- Apply Angular Material styling and SCSS for responsiveness
- Test UI on desktop and mobile
- Add user feedback (snackbar/toast, loading indicators)
- Final bug fixes, polish, and team review

---

**Goal:** All tasks completed and reviewed by end of Day 4.

## Planned Features for Employee Directory Frontend

1. Employee List Page
	- Display all employees in a table.
	- Search by name or department.
	- Sort by name, department.
	- Show key details: name, email, department, phone.

2. Add Employee
	- Form to add a new employee.
	- Input validation for all fields.
	- Show error if email already exists.

3. Edit Employee
	- Edit form with pre-filled employee data.
	- Validate changes and prevent duplicate emails.

4. Delete Employee
	- Delete button with confirmation dialog.


6. Styling & Responsiveness
	- Use Bootstrap or custom CSS for a clean look.
	- Ensure the UI works well on desktop and mobile.

7. Frontend-Backend Integration
	- Connect UI to Flask backend API using AJAX/fetch.
	- Handle loading states and errors gracefully.

8. User Experience
	- Clear feedback for all actions (success/error messages).
	- Loading indicators for data fetches.

## Authentication & User Registration
- Add backend API endpoints for /register, /login, /logout
- Create Angular components: Login, Register
- Create AuthService for authentication API calls
- Add routing for /login and /register
- Store authentication token (JWT or session) on login
- Add route guards to protect employee features (optional)
- Show error and loading states in forms
