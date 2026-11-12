
// GETTING HTML ELEMENTS

const studentForm = document.getElementById("studentForm");

const studentSection = document.getElementById("studentSection");
const marksSection = document.getElementById("marksSection");
const resultSection = document.getElementById("resultSection");

const subjectContainer = document.getElementById("subjectContainer");

const studentError = document.getElementById("studentError");
const marksError = document.getElementById("marksError");


// STEP 1: STUDENT DETAILS VALIDATION

studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Getting student information

    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("rollNo").value.trim();
    const dob = document.getElementById("dob").value;

    // Checking empty fields

    if (name === "" || roll === "" || dob === "") {
        studentError.textContent = "Please fill all student details.";
        return;
    }

    // Checking name

    if (!/^[a-zA-Z ]+$/.test(name)) {
        studentError.textContent = "Please enter a valid name.";
        return;
    }

    // Checking roll number

    if (!/^[a-zA-Z0-9-]+$/.test(roll)) {
        studentError.textContent = "Please enter a valid roll number.";
        return;
    }

    // Checking date of birth

    const birthDate = new Date(dob + "T00:00:00");
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (isNaN(birthDate.getTime()) || birthDate >= today) {
        studentError.textContent = "Please enter a valid date of birth.";
        return;
    }

    // Student details are valid

    studentError.textContent = "";

    studentSection.classList.add("hidden");
    marksSection.classList.remove("hidden");

});


// STEP 2: ADD NEW SUBJECT

document.getElementById("addSubject").addEventListener("click", function() {

    const newRow = document.createElement("div");

    newRow.className = "subject-row";

    newRow.innerHTML = `
        <input type="text" class="subjectName"
               placeholder="Subject Name">

        <input type="number" class="obtained"
               placeholder="Marks Obtained" min="0">

        <input type="number" class="maximum"
               placeholder="Total Marks" min="1">

        <button type="button" class="remove-btn"
                onclick="removeSubject(this)">X</button>
    `;

    subjectContainer.appendChild(newRow);

});


// REMOVE SUBJECT

function removeSubject(button) {

    const rows = document.querySelectorAll(".subject-row");

    if (rows.length === 1) {
        marksError.textContent = "At least one subject is required.";
        return;
    }

    button.parentElement.remove();

    marksError.textContent = "";

}


// STEP 3: GRADE CALCULATION

function calculateGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }
    else if (percentage >= 80) {
        return "A";
    }
    else if (percentage >= 70) {
        return "B";
    }
    else if (percentage >= 60) {
        return "C";
    }
    else if (percentage >= 50) {
        return "D";
    }
    else if (percentage >= 33) {
        return "E";
    }
    else {
        return "F";
    }

}


// STEP 4: GENERATE MARKSHEET

document.getElementById("generateBtn").addEventListener("click", function() {

    marksError.textContent = "";

    const rows = document.querySelectorAll(".subject-row");

    let totalObtained = 0;
    let totalMaximum = 0;

    let allPassed = true;

    let tableContent = "";

    // Checking every subject

    for (let row of rows) {

        const subject = row.querySelector(".subjectName").value.trim();

        const obtainedValue = row.querySelector(".obtained").value;
        const maximumValue = row.querySelector(".maximum").value;

        // Checking empty values

        if (subject === "" || obtainedValue === "" || maximumValue === "") {
            marksError.textContent = "Please fill all subject details.";
            return;
        }

        const obtained = Number(obtainedValue);
        const maximum = Number(maximumValue);

        // Checking valid marks

        if (
            !Number.isFinite(obtained) ||
            !Number.isFinite(maximum) ||
            maximum <= 0 ||
            obtained < 0 ||
            obtained > maximum
        ) {
            marksError.textContent =
                "Enter valid marks. Obtained marks cannot exceed total marks.";
            return;
        }

        // Calculating subject percentage

        const subjectPercentage = (obtained / maximum) * 100;

        const subjectGrade = calculateGrade(subjectPercentage);

        // Checking subject result

        let subjectStatus;

        if (subjectPercentage >= 33) {
            subjectStatus = "Pass";
        }
        else {
            subjectStatus = "Fail";
            allPassed = false;
        }

        // Adding marks to totals

        totalObtained += obtained;
        totalMaximum += maximum;

        // Creating table row

        tableContent += `
            <tr>
                <td>${escapeHTML(subject)}</td>
                <td>${maximum}</td>
                <td>${obtained}</td>
                <td>${subjectPercentage.toFixed(2)}%</td>
                <td>${subjectGrade}</td>
                <td>${subjectStatus}</td>
            </tr>
        `;

    }


    // CALCULATING OVERALL RESULT

    const overallPercentage = (totalObtained / totalMaximum) * 100;

    const overallGrade = calculateGrade(overallPercentage);

    let finalResult;

    if (allPassed) {
        finalResult = "PASS";
    }
    else {
        finalResult = "FAIL";
    }


    // DISPLAYING STUDENT DETAILS

    document.getElementById("resultName").textContent =
        document.getElementById("studentName").value.trim();

    document.getElementById("resultRoll").textContent =
        document.getElementById("rollNo").value.trim();

    const dob = document.getElementById("dob").value;

    document.getElementById("resultDob").textContent =
        new Date(dob + "T00:00:00").toLocaleDateString("en-IN");


    // DISPLAYING SUBJECT TABLE

    document.getElementById("resultTable").innerHTML = tableContent;


    // DISPLAYING FINAL TOTALS

    document.getElementById("totalMaximum").textContent = totalMaximum;

    document.getElementById("totalObtained").textContent = totalObtained;

    document.getElementById("percentage").textContent =
        overallPercentage.toFixed(2) + "%";

    document.getElementById("overallGrade").textContent = overallGrade;

    document.getElementById("finalResult").textContent = finalResult;


    // SHOWING FINAL MARKSHEET

    marksSection.classList.add("hidden");

    resultSection.classList.remove("hidden");

});


// SAFELY DISPLAY SUBJECT NAMES

function escapeHTML(value) {

    return value.replace(/[&<>"']/g, function(character) {

        const characters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return characters[character];

    });

}


// STEP 5: EDIT MARKS

document.getElementById("editBtn").addEventListener("click", function() {

    resultSection.classList.add("hidden");

    marksSection.classList.remove("hidden");

});


// STEP 6: START AGAIN

document.getElementById("restartBtn").addEventListener("click", function() {

    studentForm.reset();

    subjectContainer.innerHTML = `
        <div class="subject-row">

            <input type="text" class="subjectName"
                   placeholder="Subject Name">

            <input type="number" class="obtained"
                   placeholder="Marks Obtained" min="0">

            <input type="number" class="maximum"
                   placeholder="Total Marks" min="1">

            <button type="button" class="remove-btn"
                    onclick="removeSubject(this)">X</button>

        </div>
    `;

    studentError.textContent = "";
    marksError.textContent = "";

    resultSection.classList.add("hidden");
    marksSection.classList.add("hidden");
    studentSection.classList.remove("hidden");

});
