// users.js — user registration and storage

const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function registerUser(email, password, fullName, dateOfBirth) {
  const users = loadUsers();

  // Save the new user record
  const newUser = {
    id: users.length + 1,
    email: email,
    password: password,
    fullName: fullName,
    dateOfBirth: dateOfBirth,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

function authenticateUser(email, password) {
  const users = loadUsers();
  return users.find((u) => u.email === email && u.password === password);
}

module.exports = { registerUser, authenticateUser, loadUsers };