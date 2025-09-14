const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const allowedOrigins = [
  'https://personalfinanceassistant-frontend.onrender.com',
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

app.options('*', cors());
// Enable preflight CORS for all routes
// app.options('/*', cors());


app.use(express.json({ limit: "100mb" })); // or higher
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const transactionRouter = require("./routes/transaction");
const graphRouter = require("./routes/graph");
const geminiRouter = require("./routes/gemini");

app.use("/" , authRouter );
app.use("/" , profileRouter);
app.use("/" , transactionRouter);
app.use("/" , graphRouter);
app.use("/" , geminiRouter);

// app.get("/" , (req,res) => {
//     res.send("Hello World");
// });

const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const http = require("http");

// wrap app in HTTP server
const server = http.createServer(app);

connectDB()
    .then(() => {
        console.log("Database connected");
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.log("Database cannot be established!");
    });

