const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const tasksFilePath = path.join(__dirname, '../../data/tasks.json');

const readTasks = () => {
    const tasksData = fs.readFileSync(tasksFilePath);
    return JSON.parse(tasksData);
};

const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

router.post('/', (req, res)=> {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length +1,
        title: req.body.title,
        description: req.body.description,
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json({message: 'Tarea creada exitosamente', task: newTask});
});

router.get('/', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

router.get('/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find((t) => t.id === parseInt(req.params.id));
    if(!task){
        return res.status(404).json({ message: 'Tarea no encontrada'});
    }
    const updatedTask = {
        ...tasks[taskIndex],
        title: req.body.title,
        descripition: req.body.description,
    };
    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    res.json({ message: 'Tarea actualizada exitosamente', task: updatedTask });
});

router.delete('/:id', (req, res) => {
    const tasks = readTasks();
    const newTasks = tasks.filter((t) => t.id !== parseInt(req.params.id));
    if(tasks.length === newTasks.length){
        return res.status(404).json({ message: 'Tarea no encontrada'});
    }
    writeTasks(newTasks);
    res.json({ message: 'Tarea eliminada exitosamente'});
});

module.exports = router;