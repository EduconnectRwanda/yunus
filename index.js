const express = require('express');
const bodyParser = require('body-parser');
const AfricasTalking = require('africastalking');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.API_KEY,
  username: process.env.USERNAME
});

// Store user sessions (in production, use a database)
const userSessions = new Map();

// Home route
app.get('/', (req, res) => {
  res.send('USSD Application Running!');
});

// USSD callback route
app.post('/ussd', (req, res) => {
  console.log('Received USSD request:', req.body);

  const {
    sessionId,
    serviceCode,
    phoneNumber,
    text
  } = req.body;

  console.log(`Session ID: ${sessionId}`);
  console.log(`Service Code: ${serviceCode}`);
  console.log(`Phone Number: ${phoneNumber}`);
  console.log(`Text: ${text}`);

  let response = '';

  // Main Menu
  if (text === '') {
    response = 'CON Welcome to the Farmer Ecosystem\n';
    response += '1. Register\n';
    response += '2. List Crops\n';
    response += '3. Market Prices\n';
    response += '4. Weather Updates\n';
    response += '5. Exit';
  }
  // Registration Flow
  else if (text.startsWith('1*')) {
    const parts = text.split('*');
    if (parts.length === 2) {
      userSessions.set(sessionId, { name: parts[1] });
      response = 'CON Enter your location:';
    } else if (parts.length === 3) {
      const userData = userSessions.get(sessionId);
      userData.location = parts[2];
      userSessions.set(sessionId, userData);
      response = 'CON Enter the type of crops you farm:';
    } else if (parts.length === 4) {
      const userData = userSessions.get(sessionId);
      userData.crops = parts[3];
      response = 'END Registration successful!\n';
      response += `Name: ${userData.name}\n`;
      response += `Location: ${userData.location}\n`;
      response += `Crops: ${userData.crops}`;
      userSessions.delete(sessionId); // Clean up session
    }
  }
  // List Crops
  else if (text === '2') {
    response = 'CON Available Crops:\n';
    response += '1. Maize\n';
    response += '2. Beans\n';
    response += '3. Rice\n';
    response += '4. Potatoes\n';
    response += '5. Back';
  }
  // Market Prices
  else if (text === '3') {
    response = 'CON Current Market Prices:\n';
    response += '1. Maize - $5/kg\n';
    response += '2. Beans - $3/kg\n';
    response += '3. Rice - $4/kg\n';
    response += '4. Back';
  }
  // Weather Updates
  else if (text === '4') {
    response = 'END Weather Forecast:\n';
    response += 'Today: Sunny, 25°C\n';
    response += 'Tomorrow: Partly Cloudy, 23°C';
  }
  // Exit
  else if (text === '5') {
    response = 'END Thank you for using Farmer Ecosystem!';
  }
  // Invalid Option
  else {
    response = 'END Invalid option. Please try again.';
  }

  // Send response
  res.set('Content-Type', 'text/plain');
  res.send(response);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});