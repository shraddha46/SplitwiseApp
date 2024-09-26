var express = require('express');
var cors = require('cors');

var mongoose = require("mongoose");
const { swaggerUi, specs } = require('./swagger');
var authRouter = require('./Routes/auth.routes');
var userRouter = require('./Routes/user.routes');
var expenseRouter = require('./Routes/expense.routes');

var app = express();
var port = 3001
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://shraddha:shr123@cluster0.a996qh6.mongodb.net/splitwise?retryWrites=true&w=majority", {});
mongoose.connection.on('error', function (error) {
    console.log("an error occured while making db connection", error);
    process.exit(1);
}).once('open', function () {
    console.log("mongoose connection succesfully");
});

//API Documents path
app.use('/splitwise-api-docs', swaggerUi.serve, swaggerUi.setup(specs));

//API routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/expense', expenseRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(err.status || 404).json({
        message: "No such route exists"
    })
});

// error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500).json({
        message: "Error Message"
    })
});

app.listen(port, function (error) {
    if (error)
        console.log("An error occured while during executaion", error);
    console.log("Application successfully started on http://localhost:" + port);
});