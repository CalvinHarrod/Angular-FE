require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

// Add this line at the top of your file
const express = require('express');

const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');
const axios = require('axios');

const bodyParser = require('body-parser');

const http = require('http');

// Declare the backend server URL
const BASE_URL = 'http://192.168.42.11:8080';

// Declare the server URL and port
//const SERVER_URL = 'http://10.161.169.11:8888';
const SERVER_URL = 'http://0.0.0.0:8888';

// Declare the server URL and port
//const REDIRECT_SERVER_URL = 'http://10.161.169.11:9700';
const REDIRECT_SERVER_URL = 'http://10.161.168.12:9700';
//const REDIRECT_SERVER_URL = 'https://eform.tvb.com.hk:9700';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

const listenPort = 8888;

// Create a new lowdb instance
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const fs = require('fs');
const fsp = require('fs').promises;

//this part for redirect purpose
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});

// Check if the file exists and is not empty
if (!fs.existsSync('token-db.json') || fs.readFileSync('token-db.json', 'utf8').trim() === '') {
  // If file does not exist or is empty, initialize it with a default value
  fs.writeFileSync('token-db.json', JSON.stringify({ tokens: [] }, null, 2), 'utf8');
}

const adapter = new FileSync('token-db.json');
let db;

try {
  // Try to load the database
  db = low(adapter);
} catch (error) {
  // If an error occurred (e.g., the JSON file is invalid), initialize it with default values
  fs.writeFileSync('token-db.json', JSON.stringify({ tokens: [] }, null, 2), 'utf8');
  db = low(adapter);
}



// Define the isTokenExpired function
function isTokenExpired(token) {
  // Retrieve the token data from the database
  const tokenData = db.get('tokens').find({ token }).value();

  if (!tokenData) {
    return true;
  }

  // Check if the token has expired
  return Date.now() > new Date(tokenData.expiry).getTime();
}

//let tokenExpiration = 5 * 60 * 1000; // 5 minutes in milliseconds
let tokenExpiration = 60 * 60 * 1000; // 5 minutes in milliseconds

// Convert to number if necessary
if (typeof tokenExpiration === 'string') {
  tokenExpiration = Number(tokenExpiration);
}

// Check if tokenExpiration is a number
if (isNaN(tokenExpiration)) {
  console.error('Invalid token expiration');
  return;
}


const { format } = require('date-fns');

async function logToFile(message) {
  const timestamp = format(new Date(), 'yyyyMMdd HH:mm:ss');
  const logMessage = `${timestamp} ${message}\n`;
  await fsp.writeFile('token-server.log', logMessage, { encoding: 'utf8', flag: 'a' });
}


app.head('/', (req, res) => {
  // Check the health of the server
  // This is a simple example, you should replace it with your actual health check
  const serverIsHealthy = true;

  if (serverIsHealthy) {
    res.status(200).end();
  } else {
    res.status(500).end();
  }
});

app.use((req, res, next) => {
  logToFile(`Received a request to ${req.path} with body: ${JSON.stringify(req.body)}`);
  next();
});

db.defaults({ tokens: [] })
  .write();

app.post('/init', async (req, res) => {
  const token = await generateAndStoreToken(req.body.mobile);
  await logToFile(`Generated token: ${token}`);
  res.json({ token });
});

app.delete('/delete/:mobile', (req, res) => {
  const mobile = req.params.mobile;
  console.log(`Received delete request for mobile: ${mobile}`);

  // Check if a token for the mobile number exists
  const existingToken = db.get('tokens').find({ mobile }).value();

  if (existingToken) {
    // If a token exists, remove it
    db.get('tokens').remove({ mobile }).write();
    console.log(`Token for mobile: ${mobile} deleted successfully`);
    res.json({ message: 'Token deleted successfully' });
  } else {
    console.log(`Token for mobile: ${mobile} not found`);
    res.status(404).json({ message: 'Token not found' });
  }
});

app.post('/auth', async (req, res) => {
  const { token, mobile } = req.body;

  if (!token || !mobile) {
    await logToFile('No token or mobile number provided.');
    return res.status(400).json({ message: 'No token or mobile number provided.' });
  }

  await logToFile(`Received token: ${token} and mobile number: ${mobile}`);

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      await logToFile('Failed to authenticate token.');
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    // Retrieve the token data from the database
    const tokenData = db.get('tokens').find({ token }).value();

    if (tokenData) {
      // Check if the mobile number matches
      if (tokenData.mobile !== mobile) {
        await logToFile('Mobile number does not match token.');
        return res.status(403).json({ message: 'Mobile number does not match token.' });
      }

       // If the password flag is false, return an error
      // if (tokenData.password === false) {
      //   await logToFile('The Password Flag is False.');
      //   return res.status(403).json({ message: 'Password incorrect.' });
      // }

      // Convert the timestamp to a date
      const expiryDate = new Date(tokenData.expiry);

      // Check if the token has expired
      if (Date.now() > expiryDate.getTime()) {
        await logToFile('Token has expired.');
        return res.status(401).json({ message: 'Token has expired.' });
      }



      // Format the date
      const formattedExpiryDate = format(expiryDate, 'yyyyMMdd HH:mm');
      await logToFile(`Token is valid. The next expiry date is ${formattedExpiryDate}`);
      res.status(200).json({ message: 'Token is valid.' });
    } else {
      await logToFile('Token not found.');
      return res.status(403).json({ message: 'Token not found.' });
    }
  });
});

app.post('/updatePwd', async (req, res) => {
    const { token, mobile, id } = req.body;
  
    // Find the token in the database
    const tokenData = db.get('tokens').find({ token, mobile, id }).value();
  
    await logToFile(`Token data fetched: ${JSON.stringify(tokenData)}`);
  
    // Check for Mobile's ID = Token's ID
    if (!tokenData || tokenData.mobile.id !== tokenData.token.id) {
      await logToFile('Invalid request - Mobile ID does not match Token ID');
      return res.status(400).json({ error: 'Invalid request - data not match' });
    }
  
    // Check if the token has expired
    const expiryDate = new Date(tokenData.expiry);
    if (expiryDate < new Date()) {
      await logToFile('Token has expired - update password zone');
      return res.status(401).json({ error: 'Token has expired - update password zone' });
    }
  
    // Update the password flag to true
    db.get('tokens').find({ mobile, token, id }).assign({ password: true }).write();
  
    await logToFile('Password updated to true');
  
    return res.json({ success: true });
  });

////////////////////////////////////////////////////////////////////


// app.get('/reDirect/:mobile', async (req, res, next) => {
//   const mobile = req.params.mobile;
//   const token = req.query.token;

//   console.log(`Mobile: ${mobile}, Token: ${token}`);

//   // Authenticate the token
//   const tokenData = db.get('tokens').find({ token }).value();
//   const tokenIsValid = tokenData && !isTokenExpired(token);

//   await logToFile(`Token is valid: ${tokenIsValid}`);

//   if (tokenIsValid) {
//     // Define the target URL
//     // const targetUrl = `http://localhost:12232/eform-application/form_main?mobile=${mobile}`;
//     let targetUrl;
//     targetUrl = 'http://localhost:12232/' + mobile;

//     // Proxy the request
//     proxy.web(req, res, { target: targetUrl }, (err) => {
//       if (err) {
//         console.error('Error occurred while proxying request:', err);
//       }
//     });
//   }
// });

// app.get('/reDirect/:mobile', async (req, res, next) => {
//   const mobile = req.params.mobile;

//   console.log(`Mobile: ${mobile}`);

//   // Define the target URL
//   let targetUrl;
//   targetUrl = 'http://localhost:12232/' + mobile;

//   // Proxy the request
//   proxy.web(req, res, { target: targetUrl }, (err) => {
//     if (err) {
//       console.error('Error occurred while proxying request:', err);
//     }
//   });
// });


app.get('/reDirect/:mobile', async (req, res, next) => {
  const mobile = req.params.mobile;
  const token = req.query.token;

  // Authenticate the token
  const tokenData = db.get('tokens').find({ token }).value();
  const tokenIsValid = tokenData && !isTokenExpired(token);

  await logToFile(`Token is valid: ${tokenIsValid}`);

  if (tokenIsValid) {
    // Define the target URL
    const targetUrl = 'https://eform.tvb.com.hk:8228/eform-application/form_main?mobile=' + mobile;

    // Log the full URL
    console.log('Redirecting to:', targetUrl);

    // Redirect to the URL
    res.redirect(targetUrl);
  } else {
    res.status(401).json({ message: 'Token is expired' });
  }
});



////////////////////////////////////////////////////////////////////

app.get('/checkEmail/:email', async (req, res) => {
  const email = req.params.email;

  if (!email) {
    await logToFile('No email provided.');
    return res.status(400).json({ message: 'No email provided.' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/eform-application/ajax/checkInternalUser?email=${email}`);
    await logToFile(`Response from checkInternalUser API: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    await logToFile(`Error occurred while checking email: ${error.message}`);
    res.status(500).json({ message: 'Error occurred while checking email.' });
  }
});

// Check Mobile
app.get('/redForm-check/eform-application/ajax/checkMobile', async (req, res) => {
  const inputMobile = req.query.mobile;

  if (!inputMobile) {
    await logToFile('No input mobile provided.');
    return res.status(400).json({ message: 'No input mobile provided.' });
  }

  try {
    const response = await axios.get(`${BASE_URL}/eform-application/ajax/checkMobile?mobile=${inputMobile}`);
    await logToFile(`Response from check mobile API: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    await logToFile(`Error occurred while checking mobile: ${error.message}`);
    res.status(500).json({ message: 'Error occurred while checking mobile.' });
  }
});

// Send SMS
app.get('/sent-sms/eform-application/ajax/sendSMS', async (req, res) => {
  const smsMobile = req.query.mobile;
  const smsFixMsg = String('&smsMessage=');
  const smsContent = String('The OTP password is ');
  const smsPwd = req.query.password;

  if (!smsMobile) {
    await logToFile('No sms mobile provided.');
    return res.status(400).json({ message: 'No sms mobile provided.' });
  }

  try {

    const url = `${BASE_URL}/eform-application/ajax/sendSMS?mobile=${smsMobile}` + smsFixMsg + smsContent + smsPwd;
    console.log(`Request URL: ${url}`);
    const response = await axios.get(url);

    // const response = await axios.get(
    //   `${BASE_URL}/eform-application/ajax/sendSMS?mobile=${smsMobile}` +
    //   smsFixMsg + smsContent + smsPwd
    //   );
    await logToFile(`Response from sent sms API: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    await logToFile(`Error occurred while sent sms: ${error.message}`);
    res.status(500).json({ message: 'Error occurred while sent sms.' });
  }
});

async function generateAndStoreToken(mobile, password) {
  // Generate a new token
  const newToken = jwt.sign({ mobile }, secretKey, { expiresIn: tokenExpiration });

  // Calculate the token expiry timestamp
  const tokenExpiryTimestamp = Date.now() + tokenExpiration;

  // Convert the timestamp to a date
  const expiryDate = new Date(tokenExpiryTimestamp);

  // Format the date
  const formattedExpiryDate = format(expiryDate, 'yyyy-MM-dd HH:mm');

  // Check if a token for the mobile number already exists
  const existingToken = db.get('tokens').find({ mobile }).value();

  if (existingToken) {
    // If a token exists, remove it
    db.get('tokens').remove({ mobile }).write();
  }

  // Calculate the current timestamp and format it
  const currentDate = new Date();
  const formattedCreateDate = format(currentDate, 'yyyy-MM-dd HH:mm');

  // Store the new token, mobile number, password, Create Date, and token expiry timestamp in the database
  db.get('tokens').push({ token: newToken, mobile, password: password ? Boolean(password) : false, CreateDate: formattedCreateDate, expiry: formattedExpiryDate })

    .write();

  await logToFile(`New token generated for mobile ${mobile} with expiry timestamp ${formattedExpiryDate}`);

  return newToken;
}

// Start the server and assign the result to the server variable
// let server = app.listen(listenPort, '0.0.0.0', () => logToFile(`Server running on IPv4 port ${listenPort}`));
app.listen(listenPort, () => logToFile(`Server running on port ${listenPort}`));
