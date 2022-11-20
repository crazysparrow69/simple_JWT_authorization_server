const express = require('express');
const app = express();
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');

// Global variables
const PORT = process.env.PORT || 3500;

// Middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Routes
app.use('/registration', require('./routes/registrationRoute'));
app.use('/auth', require('./routes/authRoute'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/nuke', require('./routes/nuclearRoute'));

app.all('*', (req, res) => {
  res.status(404);

  if (req.accepts('json')) {
      res.json({ "error": "404 Not Found" });
  } else {
      res.type('txt').send("404 Not Found");
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));