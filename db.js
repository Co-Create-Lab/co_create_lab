const mongoose = require("mongoose");
require("dotenv/config");
require("dotenv").config();

mongoose.connect(process.env.CONNECTION_STRING);
