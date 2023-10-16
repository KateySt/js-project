const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const URI = process.env.ATLAS_URI;

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log(`Server is running ${PORT}`)
});

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connection establish"))
    .catch((err) => console.log("MongoDB connection failed:" + err.message))

