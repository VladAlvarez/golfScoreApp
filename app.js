// function Sum(ar) {
//     let sum = 0;
//     for (let i = 0; i < ar. length; i++) {
//         sum += ar[i]; }
//         return sum
// }

document.addEventListener("DOMContentLoaded", function() {
    buildPage();
});


const yardage = document.getElementById('yardage');

// Assign API URL to variable:
const thanksgivingPointURL = 'https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course11819.json';

// Function to return array of filtered character data objects from API:
async function getYards() {
    // Fetch API data:
    const response = await fetch(thanksgivingPointURL);

    // Convert API data to JSON:
    const allYardArr = await response.json();

    let allYardage = [];

    // Iterate over each hole
    allYardArr.holes.forEach(hole => {
        const teeBoxes = hole.teeBoxes;

        // Iterate over each tee box for the hole
        teeBoxes.forEach(teeBox => {
            // Push the yardage for each tee box to the array
            allYardage.push(teeBox.yards);
        });
    });

    return allYardage;
}


async function buildPage() {
    const newYardArr = await getYards();

    // Clear previous HTML
    yardage.innerHTML = '';

    // Populate yards HTML:
    for (let i = 0; i < newYardArr.length; i++) {
        // Create a new row for each number
        const row = document.createElement('tr');
        const th = document.createElement('th');
        const td = document.createElement('td');

        // Set the text content of the cell to the yardage value
        th.textContent = 'hello';
        td.textContent = newYardArr[i];

        // Append the th and td elements to the row
        row.appendChild(th);
        row.appendChild(td);

        // Append the row to the yardage element
        yardage.appendChild(row);
    }
}



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