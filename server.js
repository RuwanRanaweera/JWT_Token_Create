require("dotenv").config();
const dbConnect = require("./dbConnect");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const authorize = require("./middleware/auth");
const movieRoutes = require("./routes/movies");
const studentRoutes = require("./routes/student");

dbConnect();

app.use(express.json());
app.use(cors());

app.use("/movie", movieRoutes);
app.use("/student",authorize,studentRoutes);

const port = process.env.PORT || 8080;
app.listen(port,() =>console.log(`Listening on port ${port}`));