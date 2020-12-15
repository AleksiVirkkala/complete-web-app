import express from 'express';

// Express app
const app = express();

// Listen for requests
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}...`));

app.get('/', (req, res) => {
  res.send('<p>Home Page</p>');
});
