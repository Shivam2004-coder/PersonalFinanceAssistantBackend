const express = require('express');
const connectDB = require("./Config/database");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const allowedOrigins = [
  'https://techtribe-f.onrender.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// app.options('*', cors());
// Enable preflight CORS for all routes
// app.options('/*', cors());


app.use(express.json({ limit: "100mb" })); // or higher
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const transactionRouter = require("./routes/transaction");
const graphRouter = require("./routes/graph");

app.use("/" , authRouter );
app.use("/" , profileRouter);
app.use("/" , transactionRouter);
app.use("/" , graphRouter);

// app.get("/" , (req,res) => {
//     res.send("Hello World");
// });

const path = require("path");

// Serve static files from the frontend (React build)
app.use(express.static(path.join(__dirname, "dist")));

// For any other route not handled by your API, return the frontend app
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

connectDB()
    .then(() => {
        console.log("Database connection established ......");
        const PORT = process.env.PORT || 3000;
        app.listen( PORT , () => {
            console.log("It is listening on port 3000");
        });
    })
    .catch((err) => {
        console.log("Database cannot be established!");
    });

