const express = require("express");
const authRoute = require("./routes/auth");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
const PORT = 8080;

// Connect MngoDB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to db"))
  .catch((err) => {
    console.log("cannot connect to db");
  });
//Middlewares
app.use(express.json());
// Route middleware
app.use("/api/user", authRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
