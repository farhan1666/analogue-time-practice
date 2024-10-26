// script.js
let currentTime;
let score = 0;
let totalTime = 0;
let questionCount = 0;
let startTime;

window.onload = function() {
    startNewQuestion();
    // Add event listener for the minute notches checkbox
    document.getElementById('minuteNotchesCheckbox').addEventListener('change', function() {
        drawClock(currentTime.hour, currentTime.minute);
    });
}

document.getElementById('submitButton').addEventListener('click', checkAnswer);

// Allow submitting the answer by pressing Enter
document.getElementById('timeInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});

// Automatically format input as the user types
document.getElementById('timeInput').addEventListener('input', formatInput);

function formatInput() {
    let input = this.value.replace(/\D/g, ''); // Remove all non-digit characters
    if (input.length > 4) {
        input = input.slice(0, 4); // Limit input to 4 digits
    }
    if (input.length > 2) {
        input = input.slice(0, input.length - 2) + ':' + input.slice(input.length - 2);
    }
    this.value = input;
}

function generateRandomTime() {
    // Generate a random hour between 1 and 12
    let hour = Math.floor(Math.random() * 12) + 1;
    // Generate a random minute between 0 and 59
    let minute = Math.floor(Math.random() * 60);
    return { hour: hour, minute: minute };
}

function drawClock(hour, minute) {
    let canvas = document.getElementById('clockCanvas');
    let ctx = canvas.getContext('2d');
    let radius = canvas.height / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save(); // Save the context state
    ctx.translate(radius, radius);
    radius = radius * 0.90
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    if (document.getElementById('minuteNotchesCheckbox').checked) {
        drawMinuteNotches(ctx, radius);
    }
    drawTime(ctx, radius, hour, minute);
    ctx.restore(); // Restore the context state
}

function drawFace(ctx, radius) {
    let grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.save(); // Save the context state
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.restore(); // Restore the context state
    }
}

function drawMinuteNotches(ctx, radius) {
    let ang;
    for (let i = 0; i < 60; i++) {
        ang = i * Math.PI / 30;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -radius * 0.95);
        if (i % 5 === 0) {
            // Draw longer notch for every 5 minutes (already indicated by numbers)
            ctx.lineTo(0, -radius * 0.9);
        } else {
            // Draw shorter notch for every minute
            ctx.lineTo(0, -radius * 0.92);
        }
        ctx.strokeStyle = '#333';
        ctx.lineWidth = radius * 0.01;
        ctx.stroke();
        ctx.restore();
    }
}

function drawTime(ctx, radius, hour, minute) {
    let hourPos = (hour % 12) * Math.PI / 6 +
        (minute * Math.PI / (6 * 60));
    let minutePos = (minute * Math.PI / 30);
    // Hour hand
    drawHand(ctx, hourPos, radius * 0.5, radius * 0.07);
    // Minute hand
    drawHand(ctx, minutePos, radius * 0.8, radius * 0.07);
}

function drawHand(ctx, pos, length, width) {
    ctx.save(); // Save the context state
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.rotate(pos);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.restore(); // Restore the context state
}

function checkAnswer() {
    let userInput = document.getElementById('timeInput').value.trim();
    let correctHour = currentTime.hour;
    let correctMinute = currentTime.minute;

    // Format minutes to be two digits
    let minuteStr = correctMinute < 10 ? '0' + correctMinute : correctMinute.toString();
    let correctTimeStr = correctHour + ':' + minuteStr;

    // Process user input
    userInput = userInput.replace(/\D/g, ''); // Remove all non-digit characters

    if (userInput.length < 3 || userInput.length > 4) {
        document.getElementById('feedback').innerText = 'Please enter a valid time.';
        return;
    }

    // Insert colon in the correct position
    userInput = userInput.length === 3 ?
        userInput[0] + ':' + userInput.slice(1) :
        userInput.slice(0, 2) + ':' + userInput.slice(2);

    // Stop timer and calculate time taken
    let endTime = new Date();
    let timeTaken = (endTime - startTime) / 1000; // in seconds
    totalTime += timeTaken;
    questionCount++;
    let averageTime = (totalTime / questionCount).toFixed(2);

    if (userInput === correctTimeStr) {
        score++;
        document.getElementById('feedback').innerText = `Correct! Time taken: ${timeTaken.toFixed(2)} seconds`;
    } else {
        document.getElementById('feedback').innerText = `Incorrect. The correct time was ${correctTimeStr}. Time taken: ${timeTaken.toFixed(2)} seconds`;
    }
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('averageTime').innerText = 'Average Time: ' + averageTime + ' seconds';
    document.getElementById('timeInput').value = '';
    startNewQuestion();
}

function startNewQuestion() {
    currentTime = generateRandomTime();
    drawClock(currentTime.hour, currentTime.minute);
    startTime = new Date(); // Start timer
}
