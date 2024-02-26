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
    dropZones[i-1].addEventListener("dragenter", dragEnter);
    dropZones[i-1].addEventListener("dragover", dragOver);
    dropZones[i-1].addEventListener("dragleave", dragLeave);
    dropZones[i-1].addEventListener("drop", drop);
}

// Get the number buttons
const numberBtns = [];
const numberBtnClickHandlers = [];
const numberBtnDragHandlers = [];
for (let i = 0; i < 10; i++) {
    numberBtns.push(document.getElementById(`number-${i}`));
    numberBtnClickHandlers.push(() => clickNumber(i));
    numberBtns[i].addEventListener("click", numberBtnClickHandlers[i]);
    numberBtnDragHandlers.push((event) => dragNumber(event, i));
    numberBtns[i].addEventListener("dragstart", numberBtnDragHandlers[i]);
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
    if (level !== 3) {
        // If level is 1 and 2, only two dropzones will be shown on the page
        if (dropZones[0].textContent === "" && dropZones[1].textContent === "") { 
            // If all dropzones are empty, fill the first dropzone
            dropZones[0].textContent = num;
            // Disable button
            numberBtns[num].classList.add("dragged");
            numberBtns[num]['draggable'] = false;
            numberBtns[num].removeEventListener("click", numberBtnClickHandlers[num]);
            numberBtns[num].removeEventListener("dragstart", numberBtnDragHandlers[num]);
            // Dropzone effect
            dropZones[0].classList.add("filled");
        } else if (dropZones[0].textContent !== "" && dropZones[1].textContent === "") {
            // If the first dropzone is filled, fill the second dropzone
            dropZones[1].textContent = num; 
            // Disable all button
            for (let i = 0; i < 10; i++) {
                numberBtns[i].classList.add("dragged");
                numberBtns[i]['draggable'] = false;
                numberBtns[i].removeEventListener("click", numberBtnClickHandlers[i]);
                numberBtns[i].removeEventListener("dragstart", numberBtnDragHandlers[i]);
            }
            // Dropzone effect
            dropZones[1].classList.add("filled");
        } else if (dropZones[0].textContent === "" && dropZones[1].textContent !== "") {
            // If the first dropzone is empty and the second dropzone is filled, fill the first dropzone
            dropZones[0].textContent = num;
            // Disable all button
            for (let i = 0; i < 10; i++) {
                numberBtns[i].classList.add("dragged");
                numberBtns[i]['draggable'] = false;
                numberBtns[i].removeEventListener("click", numberBtnClickHandlers[i]);
                numberBtns[i].removeEventListener("dragstart", numberBtnDragHandlers[i]);
            }
            // Dropzone effect
            dropZones[0].classList.add("filled");
        }

    } else {
        // If level is 3, all three dropzones will be shown on the page
    }
}


// Handle number dragging events
function dragNumber(event, num) {
    event.dataTransfer.setData("number", num);
}


/********** Handling drop zones dropping events **********/
function dragEnter(event) {
    event.target.classList.add("drop-hover");
}

function dragOver(event) {
    // Make the area droppable, as default the area is not droppable
    event.preventDefault();
}

function dragLeave(event) {
    event.target.classList.remove("drop-hover");
}

function drop(event) {
    // Prevent open the file link
    event.preventDefault();
    // Dropzone effect
    let num = event.dataTransfer.getData("number");
    event.target.textContent = num;
    event.target.classList.add("filled");
    event.target.classList.remove("drop-hover");
    // Disable dropping effects
    event.target.removeEventListener("dragenter", dragEnter);
    event.target.removeEventListener("dragover", dragOver);
    event.target.removeEventListener("dragleave", dragLeave);
    event.target.removeEventListener("drop", drop);
    // Disable number buttons
    if (level !== 3) {
        if (dropZones.slice(0,2).every(zone => zone.classList.contains("filled"))) {
            // If all drop zones are filled, disable all button
            for (let i = 0; i < 10; i++) {
                numberBtns[i].classList.add("dragged");
                numberBtns[i]['draggable'] = false;
                numberBtns[i].removeEventListener("click", numberBtnClickHandlers[i]);
                numberBtns[i].removeEventListener("dragstart", numberBtnDragHandlers[i]);
            }
        } else {
            // Only disable the dragged number
            let draggedNumberBtn = numberBtns[num];
            draggedNumberBtn.classList.add("dragged");
            draggedNumberBtn['draggable'] = false;
            draggedNumberBtn.removeEventListener("click", numberBtnClickHandlers[num]);
            draggedNumberBtn.removeEventListener("dragstart", numberBtnDragHandlers[num]);
        }
    }
}


// Handling clear button
clearBtn.onclick = (event) => {
    // Clear drop zones text and effect
    dropZones.forEach(zone => {
        zone.textContent = "";
        zone.classList.remove("filled");
        // Recover the dropping effects
        zone.addEventListener("dragenter", dragEnter);
        zone.addEventListener("dragover", dragOver);
        zone.addEventListener("dragleave", dragLeave);
        zone.addEventListener("drop", drop);

    })
    // Recover all number buttons
    for (let i = 0; i < 10; i++) {
        numberBtns[i].classList.remove("dragged");
        numberBtns[i]['draggable'] = true;
        numberBtns[i].addEventListener("click", numberBtnClickHandlers[i]);
        numberBtns[i].addEventListener("dragstart", numberBtnDragHandlers[i]);
    }
}