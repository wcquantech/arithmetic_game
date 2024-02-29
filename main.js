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

// Get the scoreboard elements
const liveScoreDisplay = document.getElementById("live-score");
const prevScoreDisplay = document.getElementById("previous-score");

// Get the equations elements
const operator1 = document.getElementById("operator-1");
const operator2 = document.getElementById("operator-2");
const answerDisplay = document.getElementById("answer");

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

// Handle keyboard typing events
document.addEventListener('keydown', function(event) {
    if (event.key >= 0 && event.key <= 9) {
        // Number keys
        // Convert the key to a number
        const num = parseInt(event.key);

        // Check if the number is already in any of the drop zones
        const isNumberInDropZone = dropZones.some(zone => zone.textContent === event.key);

        // If the number is not in any drop zone, trigger the clickNumber function
        if (!isNumberInDropZone) {
            clickNumber(num);
        }
    } else if (event.key === "Enter") {
        // Enter key
        submit();
    } else if (event.key === "Escape") {
        // Escape key
        clear();
    } else if (event.key === "Backspace") {
        if (level !== 3) {
            if (dropZones[0].textContent !== "" && dropZones[1].textContent === "") {
                let num = +dropZones[0].textContent;
                // Recover the corresponding number button
                numberBtns[num].classList.remove("dragged");
                numberBtns[num]['draggable'] = true;
                numberBtns[num].addEventListener("click", numberBtnClickHandlers[num]);
                numberBtns[num].addEventListener("dragstart", numberBtnDragHandlers[num]);
                // Recover the first dropzone
                dropZones[0].textContent = "";
                dropZones[0].classList.remove("filled");
                dropZones[0].addEventListener("dragenter", dragEnter);
                dropZones[0].addEventListener("dragover", dragOver);
                dropZones[0].addEventListener("dragleave", dragLeave);
                dropZones[0].addEventListener("drop", drop);
            } else if (dropZones[0].textContent !== "" && dropZones[1].textContent !== "") {
                let num = +dropZones[0].textContent;
                // Recover all number buttons but num
                for (let i = 0; i < 10; i++) {
                    if (i !== num) {
                        numberBtns[i].classList.remove("dragged");
                        numberBtns[i]['draggable'] = true;
                        numberBtns[i].addEventListener("click", numberBtnClickHandlers[i]);
                        numberBtns[i].addEventListener("dragstart", numberBtnDragHandlers[i]);
                    }
                }
                // Recover the second dropzone
                dropZones[1].textContent = "";
                dropZones[1].classList.remove("filled");
                dropZones[1].addEventListener("dragenter", dragEnter);
                dropZones[1].addEventListener("dragover", dragOver);
                dropZones[1].addEventListener("dragleave", dragLeave);
                dropZones[1].addEventListener("drop", drop);
            } else if (dropZones[0].textContent === "" && dropZones[1].textContent !== "") {
                // Recover the corresponding number button
                let num = +dropZones[1].textContent;
                numberBtns[num].classList.remove("dragged");
                numberBtns[num]['draggable'] = true;
                numberBtns[num].addEventListener("click", numberBtnClickHandlers[num]);
                numberBtns[num].addEventListener("dragstart", numberBtnDragHandlers[num]);
                // Recover the second dropzone
                dropZones[1].textContent = "";
                dropZones[1].classList.remove("filled");
                dropZones[1].addEventListener("dragenter", dragEnter);
                dropZones[1].addEventListener("dragover", dragOver);
                dropZones[1].addEventListener("dragleave", dragLeave);
                dropZones[1].addEventListener("drop", drop);
            }
        } else {

        }
    }
});

// Setup timer
let timer;
let seconds = 10;
const remainTime = document.getElementById("time");
remainTime.textContent = seconds;

// Setup level
let level = +localStorage.getItem("prev_level") || 1;
levelBtns[level-1].classList.add("active-level");

// Setup the previous high score, based on level
prevScoreDisplay.textContent = +localStorage.getItem(`prev_score_${level}`) || 0;

// Start the game
startBtn.onclick = (event) => {
    // Reset timer
    seconds = 10;
    // Able resume button
    resumeBtn.style.display = "inline";
    // Reset live score
    liveScoreDisplay.textContent = 0;
    // Reset equation
    generateEquation();
    // Start count down
    if (!timer) {
        timer = setInterval(() => {
            seconds--;
            updateTimerDisplay();
            if (seconds === 0) {
                pauseGame();
                // Disable resume button
                resumeBtn.style.display = "none";
                // Show final score
                scoreDisplayDiv.style.display = "inline";
                finalScore.textContent = liveScoreDisplay.textContent;
                // Save the high score if the user breaks record
                if (+finalScore.textContent > +prevScoreDisplay.textContent) {
                    localStorage.setItem(`prev_score_${level}`, +finalScore.textContent);
                }
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
                // Show final score
                finalScore.textContent = liveScoreDisplay.textContent;
                scoreDisplayDiv.style.display = "block";
                // Save the high score if the user breaks record
                if (+finalScore.textContent > +prevScoreDisplay.textContent) {
                    localStorage.setItem(`prev_score_${level}`, +finalScore.textContent);
                }
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


// Handle clearance
function clear() {
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

// Handling clear button
clearBtn.onclick = (event) => {
    clear();
}

/********** Handling Equations Generation **********/
function generateEquation() {
    const operators = ["+", "-", "x", "÷"];
    let operator;

    if (level === 1) {
        // Only one operator needed
        // no multiplication and division
        operator = operators[Math.floor(Math.random() * 2)];  // The output will only be 0 or 1
        operator1.textContent = operator;

        // Generate equation
        let ans;
        if (operator === "+") {
            // Maximum answer should be 9+8=17
            ans = Math.ceil(Math.random() * 17);
            answerDisplay.textContent = ans.toString();
        } else if (operator === "-") {
            // Maximum answer should be 9-0=9
            ans = Math.ceil(Math.random() * 9);
            answerDisplay.textContent = ans.toString();
        }
        
    } else if (level === 2) {
        // Only one operator needed
    } else if (level === 3) {

    }
}
generateEquation();

// Function to check the answer and return the score
// If the equation includes mutiplication and division, the reward score will be 2
function checkScore(a, b, c) {
    if (level !== 3) {
        const operator = operator1.textContent;
        const ans = parseInt(answerDisplay.textContent);
        if (operator === "+" || operator === "-") {
            return eval(`${a} ${operator} ${b}`) === ans;
        } else {
            return (eval(`${a} ${operator} ${b}`) === ans)*2;
        }
    }
}

let tempScore;

// Handle submission
function submit() {
    if (level !== 3) {
        if (dropZones[0].textContent !== "" && dropZones[1].textContent !== "") {
            tempScore = checkScore(parseInt(dropZones[0].textContent), parseInt(dropZones[1].textContent));
            if (tempScore > 0) {
                // If the equation is correct
                console.log("Correct");
                // Add temporary style for correct answer
                answerDisplay.classList.add("temp-correct");
                setTimeout(() => {
                    answerDisplay.classList.remove("temp-correct");
                }, 1000);
                // Recover all number buttons
                for (let i = 0; i < 10; i++) {
                    numberBtns[i].classList.remove("dragged");
                    numberBtns[i]['draggable'] = true;
                    numberBtns[i].addEventListener("click", numberBtnClickHandlers[i]);
                    numberBtns[i].addEventListener("dragstart", numberBtnDragHandlers[i]);
                }
                // Recover all dropzones
                for (let i = 0; i < 2; i++) {
                    dropZones[i].textContent = "";
                    dropZones[i].classList.remove("filled");
                    dropZones[i].addEventListener("dragenter", dragEnter);
                    dropZones[i].addEventListener("dragover", dragOver);
                    dropZones[i].addEventListener("dragleave", dragLeave);
                    dropZones[i].addEventListener("drop", drop);
                }
                // Add score
                liveScoreDisplay.textContent = +liveScoreDisplay.textContent + tempScore;
                // Generate new equation
                generateEquation();
            } else {
                console.log("Incorrect");
                // Add temporary style for incorrect answer
                answerDisplay.classList.add("temp-wrong");
                setTimeout(() => {
                    answerDisplay.classList.remove("temp-wrong");
                }, 1000);
            }
        }
    }
}

// Handle submit button click event
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    submit();
})