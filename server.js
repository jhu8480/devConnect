const express = require('express');
const connectDB = require('./config/db');
const apiRoutes = require('./routes');

const app = express();

//connect database
connectDB();

// Init middleware
app.use(express.json({extended: false}));

app.get('/', (req, res) => {
  res.json('API running');
});

//define routes
app.use('/api', apiRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});