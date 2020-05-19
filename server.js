const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Connect to Database
connectDB();

//initialize request middleware
app.use(express.json());

app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/schedule", require("./routes/api/schedule"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
