const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // MiddleWare JSON
const knex = require('knex')({
    client: 'pg',
    connection: {
        host : 'rain.db.elephantsql.com',
        user : 'wifcqmin',
        password : 'Ljjl4wsVTA1kXRJMiMJ-eCk4tYRby6JA',
        database : 'wifcqmin'
    }
});

// Get a list of tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await knex.select('*').from('tasks');
        res.status(200).json({tasks});
    } catch (error) {
        res.status(500).json({error : 'Internal Server Error'});
    }
})

// Get a Task Based on the Id
app.get('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);
    try {
        const task = await knex('tasks').where({id: taskId}).first();
        if (!task)
        {
            res.status(404).json({error : 'Task not found'});
        }
        else{
            res.status(200).json({task});
        }
    } catch (error) {
        res.status(500).json({error : 'Internal Server Error'});
    }
})

//Get a Task Based on the Title
app.get('/tasks/GetTask/:title', async (req, res) => {
    const {title} = req.params;
    try {
        const task = await knex('tasks').where({title: title}).first();
        if (!task)
        {
            res.status(404).json({error : 'Task not found'});
        }
        else{
            res.status(200).json({task});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({Error : 'Internal Server Error'});
    }
})

// Get a new task and add it to the tasks database
app.post('/tasks', async (req,res) => {
    const {title, description, status} = req.body;

    try {
        const newTask = await knex('tasks')
            .returning('*')
            .insert({
                title: title,
                description: description,
                status: status,
                created_at: new Date(),
                updated_at: new Date(),
        })
        res.status(200).json({Task : newTask});
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Update a Task based on the Id
app.put('/tasks/:id',async (req,res) => {
    const taskId = parseInt(req.params.id);
    const {title,description,status} = req.body;

    try {
        const existingTask = await knex('tasks').where({id: taskId}).first();
        if (!existingTask)
        {
            res.status(404).json({Error: 'Task not found'});
        }
        else{
            const updatedTask = await knex('tasks')
                .returning('*')
                .where({id: taskId})
                .update({
                    title,
                    description,
                    status,
                    updated_at : new Date()
                })
            res.status(200).json({Task: updatedTask});
        }
    } catch (error) {
        res.status(500).json({Error:'Internal Server Error'});
    }
})

//Update a task based on the Title
app.put('/tasks/update/:title', async (req, res) => {
    const {title} = req.params;
    const {description,status} = req.body;

    try {
        const existingTask = await knex('tasks').where({title: title}).first();
        if (!existingTask)
        {
            res.status(404).json({Error:'Task not found'});
        }
        else {
            const updatedTask = await knex('tasks')
                .returning('*')
                .where ({title : title})
                .update({
                    description,
                    status,
                    updated_at : new Date()
                })
            res.status(200).json({Task : updatedTask});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({Error : 'Internal Server Error'});
    }
})

// Delete a task based on the ID
app.delete('/tasks/:id',async (req,res) => {
    const taskId = parseInt(req.params.id);
    try {
        const existingTask = await knex('tasks').where({id : taskId}).first();
        if (!existingTask){
            res.status(404).json({Error : 'Task not found'});
        }
        else{
            await knex('tasks').where({id : taskId}).del();
            res.status(200).json({Message : 'Task Deleted Successfully'});
        }
    } catch (error) {
        res.status(500).json({Error: 'Internal Server Error'});
    }
})

//Delete a task based on its Title
app.delete('/tasks/DelTask/:title', async (req,res) => {
    const {title} = req.params;

    try {
        const existingTask = await knex('tasks').where({title : title}).first();
        if (!existingTask){
            res.status(404).json({Error : 'Task not found'});
        }
        else{
            await knex('tasks').where({title :title}).del();
            res.status(200).json({Message : 'Task Deleted Successfully'});
        }
    } catch (error) {
        res.status(500).json({Error : 'Internal Server Error'});
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Server is Running at ${PORT}`);
})