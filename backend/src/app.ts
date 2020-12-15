import express from 'express';

// Express app
const app = express();

// Listen for requests
app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}...`));

app.get('/html', (req, res) => {
  res.send('<p>HTML Page</p>');
});

app.get('/json', (req, res) => {
  res.send({ message: 'Hello!' });
});
