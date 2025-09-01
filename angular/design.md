# Employee Directory Application Design

## 1. Architecture Overview

```mermaid
graph TD
    A[Angular Frontend (Material UI)] -- REST API --> B[Flask Backend]
    B -- SQLAlchemy ORM --> C[(SQLite Database)]
```

- **Angular Frontend**: Standalone Angular app using Angular Material for UI. Handles all user interactions and displays employee data.
- **Flask Backend**: Pure REST API, no server-side templates. Handles CRUD operations and business logic.
- **SQLite Database**: Stores employee records. Managed via SQLAlchemy ORM.

## 2. Main Features
- Employee List (table view, search, sort)
- Add/Edit Employee (form, validation)
- Delete Employee (confirmation dialog)
- Responsive Material UI
- Error and loading state handling

## 3. User Flow
1. User opens the app and sees the employee list.
2. User can search, sort, and view employees.
3. User clicks "Add" to create a new employee (form dialog).
4. User clicks "Edit" to update employee details.
5. User clicks "Delete" and confirms in dialog.
6. All changes are reflected instantly in the table.

## 4. UI Wireframes (Textual)

### Employee List
| ID | Name        | Email           | Department | Phone      | Actions        |
|----|-------------|-----------------|------------|------------|----------------|
| 1  | John Doe    | john@ex.com     | IT         | 1234567890 | Edit | Delete      |
| 2  | Jane Smith  | jane@ex.com     | HR         | 9876543210 | Edit | Delete      |

- Search bar above table
- Add Employee button (top right)
- Loading spinner when fetching data

### Add/Edit Employee Form
- Name (input)
- Email (input)
- Department (dropdown)
- Phone (input)
- Save / Cancel buttons
- Validation errors shown inline

### Delete Confirmation Dialog
- "Are you sure you want to delete this employee?"
- Confirm / Cancel buttons

## 5. Approval Checklist
- Modern, responsive UI (Angular Material)
- Secure REST API (Flask)
- No server-side templates
- All CRUD operations supported
- Error handling and validation
- Clean separation of frontend and backend

---
*For visual diagrams, see the Mermaid chart above. Wireframes can be converted to Figma or other tools if needed.*
