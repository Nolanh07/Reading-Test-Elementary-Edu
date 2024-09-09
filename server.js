// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/classroom', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Create a schema for Student
const studentSchema = new mongoose.Schema({
    name: String,
    studentId: String,
});

// Create a Student model
const Student = mongoose.model('Student', studentSchema);

// API to add a student
app.post('/add-student', async (req, res) => {
    const { name, studentId } = req.body;

    const newStudent = new Student({
        name,
        studentId,
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully!' });
});

// API to get all students
app.get('/students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
