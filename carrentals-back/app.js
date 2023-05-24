const express = require("express")
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const { MONGO_URI } = require("./config.json")
const usersRouter = require("./routers/usersRouter.js");
const companiesRoute = require('./routers/companiesRouter');
const { downloadFile } = require("./middlewares/imageDownloadMIddleware");
const emailVerificationToken = require("./middlewares/emailVerificationToken");

/**
 * variables
 */
const app = express();
const writeStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

/**
 * 
 * 
 * Mongoose initialization
 */

mongoose.set('strictQuery', true);
(async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("successfully connected to the database");
    } catch {
        console.log("error connecting to the database");
    }
})();


/**
 * 
 * setup
 */

app.disable("x-powered-by");



/**
 * 
 * Middleware
 */

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/images", express.static(path.join(__dirname, "public", "assets", "images")));
app.use(morgan("dev", { stream: writeStream }));


/**
 *
 * File download
 */

app.use("/api/images/:key", downloadFile);

/**
 * 
 * Email verification
 */

app.use("/api/verify/:token", emailVerificationToken);

//routes
app.use('/api/companies', companiesRoute);
app.use('/api/users', usersRouter);
app.all("*", (req, res, next) => {
    next(new Error("Route Not Found"));
});

//error handler
app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message });
});

// bootup
app.listen(3000, () => {
    console.log("Listening on port 3000");
});