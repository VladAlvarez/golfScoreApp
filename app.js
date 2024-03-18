let currentCourseId = null;
let courseList = [];
let courseDetails = {};
let teeBoxIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the application
  initApp();
});

function initApp() {
  // Fetch and populate the course selection dropdown on app load
  getAvailableGolfCourses().then((courses) => {
    courseList = courses;
    populateCourseSelect(courses);
  });
  // Set up event listeners
  document
    .getElementById("course-select")
    .addEventListener("change", handleCourseSelection);
  document
    .getElementById("tee-box-select")
    .addEventListener("change", handleTeeSelection);
}

function getAvailableGolfCourses() {
  return fetch(
    "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json"
  ).then((response) => response.json());
}

async function getGolfCourseDetails(golfCourseId) {
  let details = courseDetails[golfCourseId];
  if (!details) {
    details = await fetch(
      `https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course${golfCourseId}.json`
    ).then((response) => response.json());
    courseDetails[golfCourseId] = details;
  }
  return details;
}

function populateCourseSelect(courses) {
  const courseSelect = document.getElementById("course-select");
  const cid = localStorage.getItem("courseId");

  courses.forEach((course) => {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;
    courseSelect.appendChild(option);
  });
  courseSelect.value = cid || courses[0].id; // Set the selected course to the first course
  populateCourseDetails(cid || courses[0].id); // Populate the course details for the first course
}

function handleCourseSelection(ev) {
  const courseId = ev.target.value;
  localStorage.setItem("courseId", courseId);
  populateCourseDetails(courseId);
}

async function populateCourseDetails(courseId) {
  currentCourseId = courseId;
  let details = courseDetails[courseId];
  if (!details) {
    details = await getGolfCourseDetails(courseId);
  }
  populateTeeBoxSelect(details.holes[0].teeBoxes);
}

function populateTeeBoxSelect(teeBoxes) {
  const teeBoxSelect = document.getElementById("tee-box-select");
  teeBoxSelect.innerHTML = ""; // Clear existing options
  const tid = localStorage.getItem("teeBoxId") || 0;

  teeBoxes.forEach((teeBox, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${teeBox.teeType.toUpperCase()}, ${
      teeBox.totalYards
    } yards`;
    teeBoxSelect.appendChild(option);
  });
  teeBoxSelect.value = tid; // Set the selected tee box to the first tee box
  teeBoxIndex = tid; // Reset the tee box index

  populateScorecard();
}

function handleTeeSelection(ev) {
  teeBoxIndex = ev.target.value;
  localStorage.setItem("teeBoxId", teeBoxIndex);
  // Assuming course ID is still accessible or stored globally
  populateScorecard();
}

async function populateScorecard() {
    const details = await getGolfCourseDetails(currentCourseId);
    const tbody = document.querySelector("#scorecard-container table tbody");
    tbody.innerHTML = ""; // Clear existing rows
  
    let totalYards = 0;
    let totalHcp = 0;
    let totalPar = 0;
    const playerScores = []; // Array to store player score input elements
  
    details.holes.forEach((hole, index) => {
      const row = tbody.insertRow();
      const teeBox = hole.teeBoxes[teeBoxIndex];
      row.insertCell().textContent = index + 1; // Hole number
      row.insertCell().textContent = teeBox.yards; // Yardage
      row.insertCell().textContent = teeBox.hcp; // Handicap
      row.insertCell().textContent = teeBox.par; // Par
  
      totalYards += teeBox.yards;
      totalHcp += teeBox.hcp;
      totalPar += teeBox.par;
  
      // Create input element for player score
      const inputCell = row.insertCell();
      const input = document.createElement('input');
      input.type = 'text';
      inputCell.appendChild(input);
  
      // Store input element reference in playerScores array
      playerScores.push(input);
  
      // Add event listener to input element to recalculate total player score on input change
      input.addEventListener('input', updateTotalPlayerScore);
    });
  
    // Function to update total player score
    function updateTotalPlayerScore() {
      let totalPlayerScore = 0;
      playerScores.forEach(input => {
        const score = parseInt(input.value) || 0; // Convert input value to integer, default to 0 if empty
        totalPlayerScore += score;
      });
      document.querySelector("#total-score-cell").textContent = totalPlayerScore; // Update total player score
    }
  
    // Add a row for totals
    const totalRow = tbody.insertRow();
    totalRow.insertCell().textContent = 'Total';
    totalRow.insertCell().textContent = totalYards;
    totalRow.insertCell().textContent = totalHcp;
    totalRow.insertCell().textContent = totalPar;
    const totalPlayerScoreCell = totalRow.insertCell(); // Store reference to cell for total player score
    totalPlayerScoreCell.id = "total-score-cell"; // Assign an id for easy access
  
    // Calculate initial total player score
    updateTotalPlayerScore();
  
    // Append total row to tbody
    tbody.appendChild(totalRow);
  }
  
// - Implementing toast notifications for user feedback























// function Sum(ar) {
//     let sum = 0;
//     for (let i = 0; i < ar. length; i++) {
//         sum += ar[i]; }
//         return sum
// }

// document.addEventListener("DOMContentLoaded", function() {
//     buildPage();
// });


// const yardage = document.getElementById('yardage');

// // Assign API URL to variable:
// const thanksgivingPointURL = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course11819.json';

// // Function to return array of filtered character data objects from API:
// async function getYards() {
//     // Fetch API data:
//     const response = await fetch(thanksgivingPointURL);

//     // Convert API data to JSON:
//     const allYardArr = await response.json();

//     let allYardage = [];

//     // Iterate over each hole
//     allYardArr.holes.forEach(hole => {
//         const teeBoxes = hole.teeBoxes;

//         // Iterate over each tee box for the hole
//         teeBoxes.forEach(teeBox => {
//             // Push the yardage for each tee box to the array
//             allYardage.push(teeBox.yards);
//         });
//     });

//     return allYardage;
// }


// async function buildPage() {
//     const newYardArr = await getYards();

//     // Clear previous HTML
//     yardage.innerHTML = '';

//     // Populate yards HTML:
//     for (let i = 0; i < newYardArr.length; i++) {
//         // Create a new row for each number
//         const row = document.createElement('tr');
//         const th = document.createElement('th');
//         const td = document.createElement('td');

//         // Set the text content of the cell to the yardage value
//         th.textContent = 'hello';
//         td.textContent = newYardArr[i];

//         // Append the th and td elements to the row
//         row.appendChild(th);
//         row.appendChild(td);

//         // Append the row to the yardage element
//         yardage.appendChild(row);
//     }
// }



















// "<div class='char-card' data-name='" + newCharsArr[i].name.toLowerCase().replace(/\s/g, '-') + "' data-house='"
// + newCharsArr[i].house.toLowerCase().replace(/\s/g, '-') + "'>" 
//     + "<div class='char-img-container'>"
//     + "<button class='favs-btn' title='Add to Favorites'><i class='far fa-heart'></i></button>"
//     + "<img src='" + newCharsArr[i].image + "'>"
//     + "</div>"
//     + "<header class='char-header'>" + newCharsArr[i].name + "</header>"
//     + "<p><span>Ancestry: </span>" + newCharsArr[i].ancestry + "</p>"
//     + "<p id='house-homepage'><span>House: </span>" + newCharsArr[i].house + "</p>"
//     + "<p><span>Actor/Actress: </span>" + newCharsArr[i].actor + "</p>"
// + "</div>"