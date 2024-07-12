const express = require("express");
const tasksRoutes = require('./routes/tasks');
const eerrorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/tasks", tasksRoutes);
app.use(eerrorHandler);

app.listen(PORT, () => {
    console.log('Server runnig at http://localhost:' + PORT + '/');
});

