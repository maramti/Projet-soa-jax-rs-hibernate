// Base URL for API calls
const API_BASE_URL = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/') + '/api/persons';

let allUsers = [];
// Load users when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    
    // Add form submission handler
    document.getElementById('addUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addUser();
    });
    
    // Edit form submission handler
    document.getElementById('editUserForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateUser();
    });
    
    document.getElementById('searchInput').addEventListener('input', function(e) {
        filterUsers(e.target.value);
    });
    
    // Clear search button visibility
    document.getElementById('searchInput').addEventListener('input', function(e) {
        const clearBtn = document.getElementById('clearSearch');
        if (e.target.value.trim() !== '') {
            clearBtn.style.display = 'inline-block';
        } else {
            clearBtn.style.display = 'none';
        }
    });

});

// Load all users
function loadUsers() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const table = document.getElementById('usersTable');
    const tableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    loadingIndicator.style.display = 'block';
    table.style.display = 'none';
    emptyState.style.display = 'none';
    
    return fetch(API_BASE_URL + '/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load users');
            }
            return response.json();
        })
        .then(users => {
            loadingIndicator.style.display = 'none';
            
        allUsers = users || [];
            
            // Check if there's an active search
            const searchQuery = document.getElementById('searchInput').value;
            if (searchQuery && searchQuery.trim() !== '') {
                filterUsers(searchQuery);
            } else {
                if (allUsers.length > 0) {
                    table.style.display = 'table';
                    emptyState.style.display = 'none';
                    populateTable(allUsers);
                } else {
                    table.style.display = 'none';
                    emptyState.style.display = 'block';
                    emptyState.innerHTML = '<p>No users found. Add a user to get started!</p>';
                }
            }
        })
        .catch(error => {
            loadingIndicator.style.display = 'none';
            showMessage('Error loading users: ' + error.message, 'error');
            console.error('Error:', error);
        });
}

// Populate table with users
function populateTable(users) {
    const tableBody = document.getElementById('usersTableBody');
    tableBody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.age}</td>
            <td>
                <button class="btn btn-edit" onclick="editUser(${user.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Add new user
function addUser() {
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    
    if (!name || !age || age < 1) {
        showMessage('Please enter valid name and age', 'error');
        return;
    }
    
    const user = {
        name: name,
        age: age
    };
    
    fetch(API_BASE_URL + '/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to add user');
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('User added successfully!', 'success');
        document.getElementById('addUserForm').reset();
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display ='none';
        loadUsers();
    })
    .catch(error => {
        showMessage('Error adding user: ' + error.message, 'error');
        console.error('Error:', error);
    });
}

// Get user by ID and populate edit form
function editUser(id) {
    fetch(API_BASE_URL + '/' + id)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load user');
            }
            return response.json();
        })
        .then(user => {
            document.getElementById('editId').value = user.id;
            document.getElementById('editName').value = user.name;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editFormSection').style.display = 'block';
            document.getElementById('editFormSection').scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            showMessage('Error loading user: ' + error.message, 'error');
            console.error('Error:', error);
        });
}

// Update user
function updateUser() {
    const id = parseInt(document.getElementById('editId').value);
    const name = document.getElementById('editName').value.trim();
    const age = parseInt(document.getElementById('editAge').value);
    
    if (!name || !age || age < 1) {
        showMessage('Please enter valid name and age', 'error');
        return;
    }
    
    const user = {
        name: name,
        age: age
    };
    
    fetch(API_BASE_URL + '/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to update user');
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('User updated successfully!', 'success');
        cancelEdit();
        loadUsers();
    })
    .catch(error => {
        showMessage('Error updating user: ' + error.message, 'error');
        console.error('Error:', error);
    });
}

// Delete user
function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }
    
    fetch(API_BASE_URL + '/' + id, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Failed to delete user');
            });
        }
        return response.json();
    })
    .then(data => {
        showMessage('User deleted successfully!', 'success');
        loadUsers();
    })
    .catch(error => {
        showMessage('Error deleting user: ' + error.message, 'error');
        console.error('Error:', error);
    });
}

// Cancel edit
function cancelEdit() {
    document.getElementById('editFormSection').style.display = 'none';
    document.getElementById('editUserForm').reset();
}

function filterUsers(searchQuery) {
    const table = document.getElementById('usersTable');
    const tableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!searchQuery || searchQuery.trim() === '') {
        // If search is empty, show all users
        populateTable(allUsers);
        if (allUsers.length === 0) {
            table.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            table.style.display = 'table';
            emptyState.style.display = 'none';
        }
        return;
    }
    
    // Filter users by name or ID (case-insensitive)
    const query = searchQuery.toLowerCase().trim();
    const filteredUsers = allUsers.filter(user => {
        const nameMatch = user.name.toLowerCase().includes(query);
        const idMatch = user.id.toString().includes(query);
        return nameMatch || idMatch;
    });
    
    if (filteredUsers.length > 0) {
        table.style.display = 'table';
        emptyState.style.display = 'none';
        populateTable(filteredUsers);
    } else {
        table.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = '<p>No users found matching "' + searchQuery + '"</p>';
    }
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filterUsers(''); // Reset to show all users
}

// Show message
function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    messageArea.textContent = message;
    messageArea.className = 'message-area ' + type;
    messageArea.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        messageArea.style.display = 'none';
    }, 5000);
}

