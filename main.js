let words = [];
let currentWordIndex = 0;
let currentWord = '';
let results = {};

// User sign-in handling
function showStudentLogin() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('student-login-section').classList.remove('hidden');
}

function showTeacherOptions() {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('teacher-options-section').classList.remove('hidden');
}

function showTeacherSignUp() {
    document.getElementById('teacher-options-section').classList.add('hidden');
    document.getElementById('teacher-signup-section').classList.remove('hidden');
}

function showTeacherLogin() {
    document.getElementById('teacher-options-section').classList.add('hidden');
    document.getElementById('teacher-login-section').classList.remove('hidden');
}

function goBack() {
    document.getElementById('student-login-section').classList.add('hidden');
    document.getElementById('teacher-options-section').classList.add('hidden');
    document.getElementById('teacher-signup-section').classList.add('hidden');
    document.getElementById('teacher-login-section').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
}

// function submitStudentLogin() {
//     alert('Student Login successful!');
//     document.getElementById('student-login-section').classList.add('hidden');
//     document.getElementById('app').classList.remove('hidden');
// }
function submitStudentLogin() {
    // Bypass login and show the app immediately
    document.getElementById('student-login-section').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden'); // Show the main app
}


function submitTeacherSignUp() {
    const username = document.getElementById('teacher-signup-username').value;
    const password = document.getElementById('teacher-signup-password').value;
    const schoolName = document.getElementById('teacher-signup-school').value;
    const schoolDistrict = document.getElementById('teacher-signup-district').value;

    fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            role: 'teacher',
            schoolName,
            schoolDistrict
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.result) {
            alert('Teacher Sign Up successful!');
            goBack(); // Return to the home screen after successful sign-up
        } else {
            alert('Sign Up failed: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// function submitTeacherLogin() {
//     const username = document.getElementById('teacher-login-username').value;
//     const password = document.getElementById('teacher-login-password').value;

//     fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             username,
//             password
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.token) {
//             localStorage.setItem('teacherId', data.result._id); // Store teacher ID
//             localStorage.setItem('token', data.token); // Store JWT token

//             alert('Teacher Login successful!');
//             document.getElementById('teacher-login-section').classList.add('hidden');
//             document.getElementById('teacher-dashboard').classList.remove('hidden'); // Show teacher dashboard
//         } else {
//             alert('Login failed: ' + data.message);
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }

function submitTeacherLogin() {
    // Bypass login and show the teacher dashboard immediately
    document.getElementById('teacher-login-section').classList.add('hidden');
    document.getElementById('teacher-dashboard').classList.remove('hidden'); // Show teacher dashboard
}

// Function to show teacher dashboard after login
function showTeacherDashboard() {
    document.getElementById('teacher-login-section').classList.add('hidden');
    document.getElementById('teacher-dashboard').classList.remove('hidden');
}

// Function to show the classroom management interface
function showClassroom() {
    document.getElementById('teacher-dashboard').classList.add('hidden');
    document.getElementById('classroom-management').classList.remove('hidden');
    loadStudentList(); // Load the list of students for the classroom
}

// Function to show the testing interface
function showTesting() {
    document.getElementById('teacher-dashboard').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden'); // Assuming "app" is the testing interface
}

// Function to show the add student form
function showAddStudentForm() {
    document.getElementById('classroom-management').classList.add('hidden');
    document.getElementById('add-student-form').classList.remove('hidden');
}

// Function to go back to the dashboard from classroom management
function goBackToDashboard() {
    document.getElementById('classroom-management').classList.add('hidden');
    document.getElementById('teacher-dashboard').classList.remove('hidden');
}

// Function to go back to classroom management from add student form
function goBackToClassroom() {
    document.getElementById('add-student-form').classList.add('hidden');
    document.getElementById('classroom-management').classList.remove('hidden');
}

// Function to submit the new student data
function submitAddStudent() {
    const studentName = document.getElementById('student-name').value;
    const studentId = document.getElementById('student-id').value;

    fetch('http://localhost:5000/students/add-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT token
        },
        body: JSON.stringify({
            name: studentName,
            studentId: studentId,
            classId: localStorage.getItem('classId') // Assuming you store the current class ID
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Student added successfully!');
            loadStudentList(); // Reload the student list
            goBackToClassroom(); // Go back to the classroom management view
        } else {
            alert('Failed to add student: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to load the student list
function loadStudentList() {
    fetch('http://localhost:5000/students/get-students?classId=' + localStorage.getItem('classId'), {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the JWT token
        }
    })
    .then(response => response.json())
    .then(data => {
        const studentListDiv = document.getElementById('student-list');
        studentListDiv.innerHTML = ''; // Clear the current list

        // Populate the student list
        data.students.forEach(student => {
            const studentDiv = document.createElement('div');
            studentDiv.textContent = `${student.name} (ID: ${student.studentId})`;
            studentListDiv.appendChild(studentDiv);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Testing implementation
function startTest() {
    const wordInput = document.getElementById('word-input').value;
    words = wordInput.split(',').map(word => word.trim());

    if (words.length === 0) {
        alert('Please enter at least one word.');
        return;
    }

    document.getElementById('input-section').classList.add('hidden');
    document.getElementById('test-section').classList.remove('hidden');

    currentWordIndex = 0;
    currentWord = words[currentWordIndex];
    displayCurrentWord();
}

function displayCurrentWord() {
    const currentWordDiv = document.getElementById('current-word');
    currentWordDiv.innerHTML = ''; // Clear previous word

    // Create a clickable letter span for each letter in the word
    for (let i = 0; i < currentWord.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = currentWord[i];
        letterSpan.classList.add('clickable-letter');
        letterSpan.onclick = () => markIncorrect(letterSpan, i);
        currentWordDiv.appendChild(letterSpan);
    }
}

function markIncorrect(letterSpan, index) {
    if (!results[currentWord]) {
        results[currentWord] = Array(currentWord.length).fill(false);
    }

    // Toggle the incorrect status of the letter
    if (results[currentWord][index]) {
        results[currentWord][index] = false;
        letterSpan.classList.remove('incorrect');
    } else {
        results[currentWord][index] = true;
        letterSpan.classList.add('incorrect');
    }
}

function nextWord() {
    if (currentWordIndex < words.length - 1) {
        currentWordIndex++;
        currentWord = words[currentWordIndex];
        displayCurrentWord();
    } else {
        endTest();
    }
}

function endTest() {
    document.getElementById('test-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');

    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Summary of Results:</h3>';

    for (let word in results) {
        let formattedWord = '';

        for (let i = 0; i < word.length; i++) {
            if (results[word][i]) {
                formattedWord += `<span class="incorrect">${word[i]}</span>`;
            } else {
                formattedWord += `<span class="correct">${word[i]}</span>`;
            }
        }

        resultsDiv.innerHTML += `<p>${formattedWord}</p>`;
    }
}
