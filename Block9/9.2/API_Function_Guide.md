# API Function Development Guide

This guide explains how to create new functions for your JWT-authenticated task management API based on existing patterns.

## Base Configuration

```javascript
const API_BASE = "http://localhost"; // Backend on port 80
let token = ""; // Store JWT token
```

## Authentication Pattern

All API calls require JWT authentication via the `Authorization` header:
```javascript
headers: { "Authorization": "Bearer " + token }
```

## API Endpoints Overview

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/auth/jwt/sign` | Login/Get token | No |
| GET | `/auth/jwt/tasks` | Get all tasks | Yes |
| POST | `/auth/jwt/tasks` | Create new task | Yes |
| PUT | `/auth/jwt/tasks` | Update existing task | Yes |
| DELETE | `/auth/jwt/task/{id}` | Delete specific task | Yes |

## Function Patterns

### 1. Login Function Pattern

```javascript
// Event listener for login button
loginBtn.addEventListener("click", async () => {
    loginStatus.textContent = ""; // Clear previous errors
    try {
        const res = await fetch(API_BASE + "/auth/jwt/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });
        if (res.ok) {
            const data = await res.json();
            token = data.token; // Store JWT token
            // UI state changes
            document.querySelector(".login-box").style.display = "none";
            taskBox.style.display = "block";
            loadTasks(); // Load data after login
        } else {
            loginStatus.textContent = "Login failed!";
        }
    } catch (err) {
        loginStatus.textContent = "Error: " + err;
    }
});
```

**Key Points:**
- No authentication required
- Returns JWT token in response
- Updates UI state after successful login
- Calls data loading function

### 2. GET (Read) Function Pattern

```javascript
async function loadTasks() {
    taskStatus.textContent = ""; // Clear error messages
    try {
        const res = await fetch(API_BASE + "/auth/jwt/tasks", {
            headers: { "Authorization": "Bearer " + token }
        });
        if (!res.ok) {
            taskStatus.textContent = "Error loading tasks!";
            return;
        }
        const tasks = await res.json();
        // Process and display data
        taskList.innerHTML = "";
        tasks.forEach(task => {
            // Create UI elements for each item
        });
    } catch (err) {
        taskStatus.textContent = "Error: " + err;
    }
}
```

**Key Points:**
- Requires JWT authentication
- No request body needed
- Processes array of items
- Creates dynamic UI elements

### 3. POST (Create) Function Pattern

```javascript
addTaskBtn.addEventListener("click", async () => {
    const title = newTaskInput.value;
    if (!title) return; // Input validation
    
    try {
        const res = await fetch(API_BASE + "/auth/jwt/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ title, completed: false })
        });
        if (res.ok) {
            newTaskInput.value = ""; // Clear input
            loadTasks(); // Refresh data
        } else {
            taskStatus.textContent = "Error adding task!";
        }
    } catch (err) {
        taskStatus.textContent = "Error: " + err;
    }
});
```

**Key Points:**
- Requires JWT authentication
- Requires `Content-Type: application/json`
- Includes request body with data
- Clears form inputs on success
- Refreshes data after creation

### 4. PUT (Update) Function Pattern

```javascript
async function editTask(id) {
    const newTitle = prompt("Enter new task title:");
    if (!newTitle || newTitle.trim() === "") return; // Input validation
    
    try {
        const res = await fetch(`${API_BASE}/auth/jwt/tasks`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ 
                id: id,
                title: newTitle.trim(),
                completed: false
            })
        });
        
        if (res.ok) {
            loadTasks(); // Refresh data
        } else {
            const errorText = await res.text();
            taskStatus.textContent = "Error updating task: " + errorText;
        }
    } catch (err) {
        taskStatus.textContent = "Error: " + err;
    }
}
```

**Key Points:**
- Requires JWT authentication
- Requires `Content-Type: application/json`
- Includes full object with ID in request body
- Uses plural endpoint (`/tasks`)
- Refreshes data after update

### 5. DELETE Function Pattern

```javascript
async function deleteTask(id) {
    try {
        const res = await fetch(`${API_BASE}/auth/jwt/task/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        if (res.ok) loadTasks(); // Refresh data
        else taskStatus.textContent = "Error deleting task!";
    } catch (err) {
        taskStatus.textContent = "Error: " + err;
    }
}
```

**Key Points:**
- Requires JWT authentication
- Uses singular endpoint with ID (`/task/{id}`)
- No request body needed
- Refreshes data after deletion

## Common Patterns & Best Practices

### Error Handling
```javascript
try {
    // API call
    if (res.ok) {
        // Success handling
    } else {
        // HTTP error handling
        statusElement.textContent = "Error message";
    }
} catch (err) {
    // Network/JS error handling
    statusElement.textContent = "Error: " + err;
}
```

### Input Validation
```javascript
const input = document.getElementById("inputField").value;
if (!input || input.trim() === "") return; // Exit early if invalid
```

### UI State Management
```javascript
// Clear error messages
statusElement.textContent = "";

// Clear form inputs
inputElement.value = "";

// Refresh data
loadDataFunction();
```

### Authentication Headers
```javascript
// For requests with body (POST, PUT)
headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
}

// For requests without body (GET, DELETE)
headers: { "Authorization": "Bearer " + token }
```

## Creating New Functions

### Step 1: Determine the Operation
- **Read data**: Use GET method, no body
- **Create data**: Use POST method, include body
- **Update data**: Use PUT method, include full object with ID
- **Delete data**: Use DELETE method, include ID in URL

### Step 2: Choose the Endpoint
- **Collection operations**: Use plural endpoints (`/tasks`)
- **Individual operations**: Use singular endpoints (`/task/{id}`)

### Step 3: Add Required Headers
- **All operations**: Include `Authorization: Bearer {token}`
- **With body**: Include `Content-Type: application/json`

### Step 4: Handle Response
- **Success**: Update UI, refresh data, clear inputs
- **Error**: Display error message to user
- **Network error**: Show generic error message

### Step 5: Add Input Validation
- Check for empty/null values
- Trim whitespace
- Validate data format if needed

## Example: Creating a Complete Task Function

```javascript
// Mark task as completed
async function completeTask(id) {
    try {
        const res = await fetch(`${API_BASE}/auth/jwt/tasks`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ 
                id: id,
                title: "Existing Title", // You'd need to get this
                completed: true
            })
        });
        
        if (res.ok) {
            loadTasks(); // Refresh the list
        } else {
            taskStatus.textContent = "Error completing task!";
        }
    } catch (err) {
        taskStatus.textContent = "Error: " + err;
    }
}
```

This guide provides the foundation for creating any new API function following the established patterns in your application.
