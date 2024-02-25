// Get the required elements that involve logics
const gameDiv = document.getElementById("game");
const homeDiv = document.getElementById("home");
const scoreDisplayDiv = document.getElementById("score-display");
const finalScore = document.getElementById("final-score");
const startBtn = document.getElementById("start");
const resumeBtn = document.getElementById("resume");
const pauseBtn = document.getElementById("pause");
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");

// Get the level buttons
const levelBtns = [];
for (let i = 1; i < 4; i++) {
    levelBtns.push(document.getElementById(`level-${i}`));
}

// Get the drop zones
const dropZones = [];
for (let i = 1; i < 4; i++) {
    dropZones.push(document.getElementById(`drop-zone-${i}`));
}

// Get the number buttons
const numberBtns = [];
const numberBtnHandlers = [];
for (let i = 0; i < 10; i++) {
    numberBtns.push(document.getElementById(`number-${i}`));
    numberBtnHandlers.push(() => clickNumber(i));
    numberBtns[i].addEventListener("click", numberBtnHandlers[i]);
}



// Setup timer and level
let timer;
let seconds = 10;
const remainTime = document.getElementById("time");
remainTime.textContent = seconds;

let level = 1;  // default


// Start the game
startBtn.onclick = (event) => {
    // Reset timer
    seconds = 10;
    // Able resume button
    resumeBtn.style.display = "inline";
    // Start count down
    if (!timer) {
        timer = setInterval(() => {
            seconds--;
            updateTimerDisplay();
            if (seconds === 0) {
                pauseGame();
                // Disable resume button
                resumeBtn.style.display = "none";
            }
        }, 1000);
    }
    homeDiv.style.display = "none";
    gameDiv.style.display = "inline";
}

function updateTimerDisplay() {
    remainTime.textContent = seconds;
}


// Handling pause button
function pauseGame() {
    clearInterval(timer);
    timer = null;
    gameDiv.style.display = "none";
    homeDiv.style.display = "inline";
}


pauseBtn.onclick = (event) => {
    console.log("clicked");
    clearInterval(timer);
    timer = null;
    gameDiv.style.display = "none";
    homeDiv.style.display = "inline";
};

// Handling resume button
resumeBtn.onclick = (event) => {
    if (!timer) {
        timer = setInterval(() => {
            seconds--;
            updateTimerDisplay();
            if (seconds === 0) {
                pauseGame();
                // Disable resume button
                resumeBtn.style.display = "none";
            }
        }, 1000);
    }
    homeDiv.style.display = "none";
    gameDiv.style.display = "inline";
}


// Handle number clicking events
function clickNumber(num) {
    console.log(`Clicked ${num}`);
    if (level === 1) {
        if (dropZones[0].textContent == "") { 
            dropZones[0].textContent = num;
            // Disable button
            numberBtns[num].classList.add("dragged");
            numberBtns[num]['draggable'] = false;
            numberBtns[num].removeEventListener("click", numberBtnHandlers[num]);
            // Dropzone effect
            dropZones[0].classList.add("filled");
        }
        else if (dropZones[1].textContent == "") {
            dropZones[1].textContent = num; 
            // Disable all button
            for (let i = 0; i < 10; i++) {
                numberBtns[i].classList.add("dragged");
                numberBtns[i]['draggable'] = false;
                numberBtns[i].removeEventListener("click", numberBtnHandlers[i]);
            }
            // Dropzone effect
            dropZones[1].classList.add("filled");
        }

    }
}


// Handling clear button
clearBtn.onclick = (event) => {
    // Clear drop zones text and effect
    dropZones.forEach(zone => {
        zone.textContent = "";
        zone.classList.remove("filled");
    })
    // Recover all number buttons
    for (let i = 0; i < 10; i++) {
        numberBtns[i].classList.remove("dragged");
        numberBtns[i]['draggable'] = true;
        numberBtns[i].addEventListener("click", numberBtnHandlers[i]);
    }
}