const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = 7904;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});