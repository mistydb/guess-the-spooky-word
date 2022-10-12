// select the unordered list where guessed letters appear
const guesses = document.querySelector(".guessed-letters");
// "Guess!" button
const guessButton = document.querySelector(".guess");
// text input box
const textInput = document.querySelector(".letter");
// where word in progress will appear
const wordInProgress = document.querySelector(".word-in-progress");
// where remaing guesses display
const guessesRemaining = document.querySelector(".remaining");
// span for actual number of remaining guesses
const numGuesses = document.querySelector("span");
// message responses after a guessed letter
const message = document.querySelector(".message");
// play again button
const playAgain = document.querySelector(".play-again");
// test word until later when a list of words is fetched
let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const res = await fetch( "https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt")
    const words = await res.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    hideWord(word);
};
getWord();

const hideWord = function (word) {
    const arrayWord = word.split("");
    const hiddenWord = arrayWord.map(function (item) {
        return `●`;
    })
    wordInProgress.innerText = hiddenWord.join("");
};


guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    message.innerText = "";
    const letterGuess = textInput.value;
    // console.log(letterGuess);
    const validity = checkValidity(letterGuess);
    if (validity) {
        makeGuess(letterGuess);
    }
    textInput.value = "";
});

const checkValidity = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter.";
    } else if (input.length > 1) {
        message.innerText = "Please enter only one letter.";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a letter from A to Z."
    } else {
        return input;
    }
};

const makeGuess = function (letter) {
    letter = letter.toUpperCase();
    if (guessedLetters.includes(letter)) {
        message.innerText = "You've already guessed that letter."
    } else {
        guessedLetters.push(letter);
        displayLetters();
        checkGuessNumber(letter);
        displayWordInProgress(guessedLetters);
    }
    // console.log(guessedLetters);
};

const displayLetters = function() {
    guesses.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guesses.append(li);
    }
};

const displayWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const displayWIP = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            displayWIP.push(letter.toUpperCase());
        } else {
            displayWIP.push("●");
        }
    } 
    wordInProgress.innerText = displayWIP.join("");
    checkIfWon();
};

const checkGuessNumber = function (letter) {
    const wordUpper = word.toUpperCase();
    if (wordUpper.includes(letter)) {
        message.innerText = `You guessed a letter!`;
    } else {
        message.innerText = `Oops! The secret word does not contain that letter.`;
        remainingGuesses = remainingGuesses - 1;
    }
    if (remainingGuesses === 0) {
        message.innerText = `Sad trombone! Game over. The secret word was ${word.toUpperCase()}.`
        startOver();
    } else if (remainingGuesses === 1) {
        numGuesses.innerText = `only one guess`;
    } else {
        numGuesses.innerText = `${remainingGuesses} guesses`;
    }
}

const checkIfWon = function () {
    if (wordInProgress.innerText === word.toUpperCase()) {
        message.classList.add("win");
        message.innerHTML = '<p class="highlight">You guessed correct the word! Congrats!</p>';
        startOver();
    }
};

const startOver = function () {
    guessButton.classList.add("hide");
    guessesRemaining.classList.add("hide");
    guesses.classList.add("hide");
    playAgain.classList.remove("hide");
}

playAgain.addEventListener("click", function (e){
    e.preventDefault();
    message.classList.remove("win");
    message.innerText = "";
    guesses.innerText = "";
    remainingGuesses = 8;
    guessedLetters = [];
    numGuesses.innerText = `${remainingGuesses} guesses`;
    guessButton.classList.remove("hide");
    guessesRemaining.classList.remove("hide");
    guesses.classList.remove("hide");
    playAgain.classList.add("hide");
    getWord();
});