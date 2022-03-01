const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;
require("dotenv").config();
app.use(cors({
    origin: "*"
}));
mongoose.connect(process.env.DATABASE_CONN, () => console.log('DB connected'));
app.use(express.json());
app.use('/user', require('./routes/userRoutes.js'));
app.use('/blog', require('./routes/blogRoutes.js'));
app.use('/blog/comment', require('./routes/commentRoutes.js'));
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`));