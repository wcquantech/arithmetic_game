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
const operator1Display = document.getElementById("operator-1");
const operator2Display = document.getElementById("operator-2");
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
        let removed = false;
        let idx;
        let num;
        if (level !== 3) {
            idx = 1;
        } else {
            idx = 2;
        }

        // Find the first filled dropzone, from right to left
        while (!removed && idx >= 0) {
            if (dropZones[idx].textContent) {
                // recover the dropzone
                num = +dropZones[idx].textContent;
                dropZones[idx].textContent = "";
                dropZones[idx].classList.remove("filled");
                dropZones[idx].addEventListener("dragenter", dragEnter);
                dropZones[idx].addEventListener("dragover", dragOver);
                dropZones[idx].addEventListener("dragleave", dragLeave);
                dropZones[idx].addEventListener("drop", drop);
                removed = true;
            }
            idx -= 1;
        }

        // If all dropzones are empty, return
        if (!removed && idx < 0) return;

        // If there is at least one dropzone filled, recover all but the numbers in the dropzones
        // otherwise, recover only the number removed
        let nums = dropZones.map(zone => zone.textContent? +zone.textContent : null);
        if (dropZones.some(zone => +zone.textContent)) {
            // Recover all but the numbers in the dropzones
            for (let i = 0; i < 10; i++) {
                if (!nums.includes(i)) {
                    numberBtns[i].classList.remove("dragged");
                    numberBtns[i]['draggable'] = true;
                    numberBtns[i].addEventListener("click", numberBtnClickHandlers[i]);
                    numberBtns[i].addEventListener("dragstart", numberBtnDragHandlers[i]);
                }
            }
        } else {
            // Recover only the number removed
            numberBtns[num].classList.remove("dragged");
            numberBtns[num]['draggable'] = true;
            numberBtns[num].addEventListener("click", numberBtnClickHandlers[num]);
            numberBtns[num].addEventListener("dragstart", numberBtnDragHandlers[num]);
        }
    }
});

// Setup timer
let timer;
let seconds = 10;
const remainTime = document.getElementById("time");
remainTime.textContent = seconds;

// Setup level
if (!localStorage.getItem("prev_level")) {
    localStorage.setItem("prev_level", 1);
}
let level = +localStorage.getItem("prev_level");
if (level === 3) {
    // if level 3, show the second operator and the third dropzone
    operator2Display.style.display = "inline";
    dropZones[2].style.display = "inline";
}
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
    let dropped = false;
    let idx = 0;
    let lastIdx;
    if (level !== 3) {
        lastIdx = 1;
    } else {
        // If level is 3, all three dropzones will be shown on the page
        lastIdx = 2;
    }

    // Find the first empty dropzone
    while (!dropped && idx <= lastIdx) {
        if (!dropZones[idx].textContent) {
            dropZones[idx].textContent = num;
            dropZones[idx].classList.add("filled");
            dropped = true;
        }
        idx += 1;
    }

    // If all dropzones are filled, return
    if (!dropped && idx > lastIdx) return;

    // If there is at least one empty dropzone, only disable the clicked number
    // otherwise, disable all number buttons
    if (dropZones.some(zone => !zone.textContent)) {
        // Only disable single button
        numberBtns[num].classList.add("dragged");
        numberBtns[num]['draggable'] = false;
        numberBtns[num].removeEventListener("click", numberBtnClickHandlers[num]);
        numberBtns[num].removeEventListener("dragstart", numberBtnDragHandlers[num]);
    } else {
        // Disable all button
        for (let i = 0; i < 10; i++) {
            numberBtns[i].classList.add("dragged");
            numberBtns[i]['draggable'] = false;
            numberBtns[i].removeEventListener("click", numberBtnClickHandlers[i]);
            numberBtns[i].removeEventListener("dragstart", numberBtnDragHandlers[i]);
        }
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
    let lastIdx;
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
        lastIdx = 1;
    } else {
        lastIdx = 2;
    }

    if (dropZones.slice(0, lastIdx+1).some(zone => !zone.textContent)) {
        // Only disable single button
        numberBtns[num].classList.add("dragged");
        numberBtns[num]['draggable'] = false;
        numberBtns[num].removeEventListener("click", numberBtnClickHandlers[num]);
        numberBtns[num].removeEventListener("dragstart", numberBtnDragHandlers[num]);
    } else {
        // Disable all button
        for (let i = 0; i < 10; i++) {
            numberBtns[i].classList.add("dragged");
            numberBtns[i]['draggable'] = false;
            numberBtns[i].removeEventListener("click", numberBtnClickHandlers[i]);
            numberBtns[i].removeEventListener("dragstart", numberBtnDragHandlers[i]);
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

// Helper function that returns a random element from an array
function getRandomElement(arr) {
    if (arr && arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return;
}

function generateEquation() {
    const operators = ["+", "-", "x", "÷"];
    let operator1, operator2, ans, a, b, c;

    if (level === 1) {
        // Only one operator needed
        // no multiplication and division
        operator1 = operators[Math.floor(Math.random() * 2)];  // The output will only be 0 or 1
        operator1Display.textContent = operator1;

        // Generate equation
        if (operator1 === "+") {
            // Maximum answer should be 9+8=17
            ans = Math.ceil(Math.random() * 17);
        } else if (operator1 === "-") {
            // Maximum answer should be 9-0=9
            ans = Math.ceil(Math.random() * 9);
        }
        answerDisplay.textContent = ans.toString();
        
    } else if (level === 2) {
        // Only one operator needed
        // including multiplication and division
        operator1 = operators[Math.floor(Math.random() * 4)];  // The output will be 0, 1, 2, or 3
        operator1Display.textContent = operator1;

        // Generate equation
        if (operator1 === "+") {
            // Maximum answer should be 9+8=17
            ans = Math.ceil(Math.random() * 17);
        } else if (operator1 === "-") {
            // Maximum answer should be 9-0=9
            ans = Math.ceil(Math.random() * 9);
        } else if (operator1 === "x") {
            // Create the operands first
            a = Math.floor(Math.random() * 10);  // a will be in range 0-9
            b = Math.floor(Math.random() * 10);  // b will also be in range 0-9
            while (a === b) {
                // If a and b are the same, generate a new b
                b = Math.floor(Math.random() * 10);
            }
            ans = a * b;
        } else if (operator1 === "÷") {
            // Create the operands first
            // Only division with no remainder
            a = Math.floor(Math.random() * 10);  // a will be in range 0-9
            if (a === 0) {
                ans = 0;
            } else if ([2, 3, 4, 5, 7].includes(a)) {
                ans = a;
            } else if (a === 6) {
                ans = getRandomElement([2, 3, 6]);
            } else if (a === 8) {
                ans = getRandomElement([2, 4, 8]);
            } else if (a === 9) {
                ans = getRandomElement([3, 9]);
            } else if (a === 1) {
                ans = 0;
            }
        }
        answerDisplay.textContent = ans.toString();
    } else if (level === 3) {
        // Two operators needed
        // including multiplication and division
        operator1 = operators[Math.floor(Math.random() * 4)];  // The output will be 0, 1, 2, or 3
        // Associative law and Commutative law do not hold when mulitplication and division appear together 
        if (operator1 === "x") {operator2 = getRandomElement(["+", "-", "x"]);}
        else if (operator1 === "÷") {operator2 = getRandomElement(["+", "-"]);}
        else {operator2 = operators[Math.floor(Math.random() * 4)];}

        operator1Display.textContent = operator1;
        operator2Display.textContent = operator2;

        // Generate equation
        if (operator1 === "+" && operator2 === "+") {
            // Maximum answer should be 9+8+7=24, minimum answer should be 0+1+2=3
            ans = Math.ceil(Math.random() * 22) + 2;
        } else if (operator1 === "-" && operator2 === "-") {
            // Ensures a >= b and (a-b) >= c, so that ans must be >=0
            a = Math.ceil(Math.random() * 8) + 1;
            b = Math.ceil(Math.random() * a);
            c = Math.ceil(Math.random() * (a-b));
            ans = a - b - c;
        } else if ((operator1 === "+" && operator2 === "-") || (operator1 === "-" && operator2 === "+")) {
            // Maximum answer should be 9+8-0=17, minimum answer should be 9+0-8=1
            ans = Math.ceil(Math.random() * 17);
        } else if ((operator1 === "+" && operator2 === "x") || (operator1 === "x" && operator2 === "+")) {
            // Generating three unique random numbers for multiplication
            let numbers = [];
            while (numbers.length < 3) {
                let n = Math.floor(Math.random() * 10);
                if (!numbers.includes(n)) {
                    numbers.push(n);
                }
            }
            [a, b, c] = numbers;
            if (operator1 === "+") ans = a+b*c;
            else ans = a*b+c;
        } else if (operator1 === "-" && operator2 === "x") {
            // Answer must be in range 0-9
            ans = Math.floor(Math.random() * 10);
        } else if (operator1 === "x" && operator2 === "-") {
            // Creating the equation in form of a * b - c
            // a * b can't be 0, so that a or b can't be 0
            let numbers = [];
            while (numbers.length < 2) {
                let n = Math.ceil(Math.random() * 9);
                if (!numbers.includes(n)) {
                    numbers.push(n);
                }
            }
            [a, b] = numbers;
            // Selecting a unique value for c that is not equal to a or b and is less than the product of a and b or 10, whichever is greater
            c = getRandomElement([...Array(Math.max(a*b, 10)).keys()].filter(n => (n!==a && n!==b)));
            ans = a*b-c;
        } else if (operator1 === "x" && operator2 === "x") {
            // Generating three unique random numbers for multiplication
            let numbers = [];
            while (numbers.length < 3) {
                let n = Math.floor(Math.random() * 10);
                if (!numbers.includes(n)) {
                    numbers.push(n);
                }
            }
            [a, b, c] = numbers;
            ans = a*b*c;
        } else if ((operator1 === "+" && operator2 === "÷") || (operator1 === "÷" && operator2 === "+")) {
            // Creating the equation in form of (a / b) + c
            // (a/b) can't be 0 or 1
            a = getRandomElement([2, 3, 4, 5, 6, 7, 8, 9]);
            if ([2, 3, 4, 5, 7].includes(a)) {
                b = 1;
            } else if (a === 6) {
                b = getRandomElement([1, 2, 3]);
            } else if (a === 8) {
                b = getRandomElement([1, 2, 4]);
            } else if (a === 9) {
                b = getRandomElement([1, 3]);
            }
            c = getRandomElement([...Array(10).keys()].filter(n => (n!==a && n!==b)));
            ans = a/b+c;
        } else if (operator1 === "-" && operator2 === "÷") {
            // Creating the equation in form of a - (b / c)
            // b can't be 1 or 9
            // if b = 1, b / c will be fraction or inf
            // number 9 should be reserved for a
            b = getRandomElement([0, 2, 3, 4, 5, 6, 7, 8]);
            if ([2, 3, 5, 7].includes(b)) { c = 1; }  // if b = 2/3/5/7, c can only be 1
            else if (b === 0) { c = Math.ceil(Math.random() * 9); }  // if b = 0, c will be in range 1-9
            else {
                do {
                    c = Math.ceil(Math.random() * 4);  // else, c will be in range 1-4
                } while ((b % c !== 0) || (c >= b));
            }
            do {
                // a should fulfilled the equation
                a = getRandomElement([...Array(10).keys()].filter(n => (n!==b && n!==c)));
            } while ((a - (b / c) < 0));

            ans = a-b/c;
        } else if (operator1 === "÷" && operator2 === "-") {
            // Creating the equation in form of (a / b) - c
            // (a/b) can't be 0
            a = getRandomElement([2, 3, 4, 5, 6, 7, 8, 9]);
            if ([2, 3, 4, 5, 7].includes(a)) {
                b = 1;
            } else if (a === 6) {
                b = getRandomElement([1, 2, 3]);
            } else if (a === 8) {
                b = getRandomElement([1, 2, 4]);
            } else if (a === 9) {
                b = getRandomElement([1, 3]);
            }
            do {
                // c can only be less than a, and fulfilled the equation
                c = getRandomElement([...Array(a).keys()].filter(n => (n!==a && n!==b)));
            } while (((a / b) - c) < 0)
            
            ans = a/b-c;
        } 
        answerDisplay.textContent = ans.toString();
    }
}
generateEquation();

// Function to check the answer and return the score
// If the equation includes mutiplication and division, the reward score will be 2
function checkScore(a, b, c) {
    let operator1, operator2;
    const ans = parseInt(answerDisplay.textContent);
    if (level !== 3) {
        operator1 = operator1Display.textContent;
        if (operator1 === "x") return (eval(`${a} * ${b}`) === ans)*2;
        else if (operator1 === "÷") return (eval(`${a} / ${b}`) === ans)*2;
        else return eval(`${a} ${operator1} ${b}`) === ans;
    } else {
        operator1 = operator1Display.textContent;
        operator2 = operator2Display.textContent;
        if (operator1 === "÷") return (eval(`${a} / ${b} ${operator2} ${c}`) === ans)*2;
        else if (operator1 === "x") {
            if (operator2 === "x") return (eval(`${a} * ${b} * ${c}`) === ans)*4;
            else return (eval(`${a} * ${b} ${operator2} ${c}`) === ans)*2;
        } else {
            if (operator2 === "÷") return (eval(`${a} ${operator1} ${b} / ${c}`) === ans)*2;
            else if (operator2 === "x") return (eval(`${a} ${operator1} ${b} * ${c}`) === ans)*2;
            else return (eval(`${a} ${operator1} ${b} ${operator2} ${c}`) === ans);
        }
    }
}

let tempScore;

// Handle submission
function submit() {
    let tempScore;
    if (level !== 3) {
        if (dropZones.slice(0, 2).every(zone => zone.textContent)) {
            tempScore = checkScore(parseInt(dropZones[0].textContent), parseInt(dropZones[1].textContent));
        } else {
            // Vibration effect
            return;
        }
    } else {
        if (dropZones.every(zone => zone.textContent)) {
            tempScore = checkScore(parseInt(dropZones[0].textContent), parseInt(dropZones[1].textContent), parseInt(dropZones[2].textContent));
        } else {
            // Vibration effect
            return;
        }
    }

    // Add the score and effects
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
        for (let i = 0; i < 3; i++) {
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

// Handle submit button click event
submitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    submit();
})