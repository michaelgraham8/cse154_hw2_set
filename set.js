/**
 * Michael Graham
 * 10/23/19
 * Section AL - Tal Wolman
 * HW2
 *
 * This is the JavaScript that provides interactivity to set.html. So far, it only allows the
 * user to toggle between menu view and game view
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  const STYLE_ARRAY = ["solid", "outline", "striped"];
  const SHAPE_ARRAY = ["diamond", "oval", "squiggle"];
  const COLOR_ARRAY = ["red", "green", "purple"];
  const COUNT_ARRAY = [1, 2, 3];
  const ARRAY_LENGTH_VAR = 3;
  const SECOND = 1000;
  const SECONDS_IN_MINUTE = 60;
  const EASY_NUMBER = 9;
  const STANDARD_NUMBER = 12;
  const SECOND_PENALTY = 15;
  const

  let timerId;
  let remainingSeconds;
  let totalCards;
  let setCount;

  /**
   * Listens for the user to click a button, then calls toggleView function
   */
  function init() {
    id("start-btn").addEventListener("click", function() {
      toggleView();
      startGame();
    });

    id("back-btn").addEventListener("click", toggleView);
    id("refresh-btn").addEventListener("click", fillBoard);
  }

  /**
   * Clears the current board and immediately fills it with new cards
   */
  function fillBoard() {
    if (remainingSeconds > 0) {
      id("board").innerHTML = "";
      for (let i = 0; i < totalCards; i++) {
        id("board").appendChild(generateUniqueCard(totalCards === EASY_NUMBER));
      }
    }
  }

  /**
   * Starts a game of Set! by filling the board according to the selected difficulty and starting
   * the timer
   */
  function startGame() {
    setCount = 0;
    getDifficulty();
    startTimer();
    fillBoard();
  }

  /**
   * Determines how many cards should be generated on the board according to the selected
   * difficulty
   */
  function getDifficulty() {
    let diffs = qsa("input");
    let difficulty;
    for (let i = 0; i < diffs.length; i++) {
      if (diffs[i].checked) {
        difficulty = diffs[i].value;
      }
    }

    if (difficulty === "easy") {
      totalCards = EASY_NUMBER;
    } else {
      totalCards = STANDARD_NUMBER;
    }
  }

  /**
   * Toggles the ui between the main menue and the game
   */
  function toggleView() {
    id("menu-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
    setCount = 0;
    id("set-count").textContent = "" + setCount;
  }

  /**
   * Returns an array of randomly generated attributes. If in easy mode, "Style" attribute will
   * always be "Solid"
   * @param {boolean} isEasy - Whether the gamemode is set to "Easy"
   * @return {array} attributes - Array of attributes
   */
  function generateRandomAttributes(isEasy) {
    let attributes = [
      STYLE_ARRAY[Math.floor(Math.random() * ARRAY_LENGTH_VAR)],
      SHAPE_ARRAY[Math.floor(Math.random() * ARRAY_LENGTH_VAR)],
      COLOR_ARRAY[Math.floor(Math.random() * ARRAY_LENGTH_VAR)],
      COUNT_ARRAY[Math.floor(Math.random() * ARRAY_LENGTH_VAR)]
    ];
    if (isEasy) {
      attributes[0] = "solid";
    }
    return attributes;
  }

  /**
   * Generates a card unique to any others on the board
   * @param {boolean} isEasy - Whether the gamemode is set to "Easy"
   * @return {div} card - A newly generated unique card
   */
  function generateUniqueCard(isEasy) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.addEventListener("click", cardSelected);
    let difficulty = (isEasy === (totalCards === EASY_NUMBER));
    let attributes = findUniqueAttributes(difficulty);
    card.id = generateId(attributes);

    for (let i = 1; i <= attributes[ARRAY_LENGTH_VAR]; i++) {
      let image = document.createElement("img");
      image.src = "img/" + generateSrc(attributes) + ".png";
      image.alt = generateId(attributes);
      card.appendChild(image);
    }
    return card;
  }

  /**
   * Generates an src attribute following the image naming convention
   * @param {array} attributes - An array of randomly generated attributes
   * @return {string} Newly generated src attribute
   */
  function generateSrc(attributes) {
    return attributes[0] + "-" + attributes[1] + "-" + attributes[2];
  }

  /**
   * Generates an id following id naming convention
   * @param {array} attributes - An array of randomly generated attributes
   * @return {string} Newly generated id
   */
  function generateId(attributes) {
    return generateSrc(attributes) + "-" + attributes[ARRAY_LENGTH_VAR];
  }

  /**
   * Searches for a combination of attributes that is unique to that of any other card on the
   * board
   * @param {boolean} isEasy - Whether the game is set to easy mode
   * @return {array} attributes - Array that makes up a unique attribute combination
   */
  function findUniqueAttributes(isEasy) {
    let difficulty = (isEasy === (totalCards === EASY_NUMBER));
    let attributes = generateRandomAttributes(difficulty);
    let newCardId = generateId(attributes);
    let cards = qsa(".card");
    let idArray = [];
    for (let i = 0; i < cards.length; i++) {
      idArray.push(cards[i].getAttribute("id"));
    }
    if (idArray.includes(newCardId)) {
      attributes = findUniqueAttributes(difficulty);
    }
    return attributes;
  }

  /**
   * Determines the number of seconds left in the game and initializes the counttdown timer. Starts
   * the countdown
   */
  function startTimer() {
    let times = qs("select");
    remainingSeconds = times.options[times.selectedIndex].value;
    displayTime();
    timerId = setInterval(advanceTimer, SECOND);
  }

  /**
   * Uses the total number of remaining seconds to put the timer in MM:SS format on the board
   */
  function displayTime() {
    let minutes = Math.floor(remainingSeconds / SECONDS_IN_MINUTE);
    let seconds = remainingSeconds - (minutes * SECONDS_IN_MINUTE);
    if (remainingSeconds < 0) {
      id("time").textContent = "00:00";
    } else if (minutes < 10 && seconds < 10) {
      id("time").textContent = "0" + minutes + ":0" + seconds;
    } else if (minutes >= 10 && seconds < 10) {
      id("time").textContent = minutes + ":0" + seconds;
    } else if (minutes < 10 && seconds >= 10) {
      id("time").textContent = "0" + minutes + ":" + seconds;
    } else {
      id("time").textContent = minutes + ":" + seconds;
    }
  }

  /**
   * Dencriments the timer by 1 second
   */
  function advanceTimer() {
    if (remainingSeconds === 0) {
      endGame();
    }
    remainingSeconds--;
    displayTime();
  }

  /**
   * Puts the board in endgame state
   */
  function endGame() {
    clearInterval(timerId);
    let selectedCards = qsa(".selected");
    for (let i = 0; i < selectedCards.length; i++) {
      selectedCards[i].classList.toggle("selected");
    }
  }

  /**
   * Checks how many cards are currently selected. If a set is selected, the Set Count is increased
   * and three new cards are generated. If not, time is reduced by 15 seconds and three new cards
   *  are generated
   */
  function cardSelected() {
    if (remainingSeconds > 0) {
      this.classList.toggle("selected");
      let selectedCards = qsa(".selected");
      if (selectedCards.length === ARRAY_LENGTH_VAR) {
        if (isASet(selectedCards)) {
          setCount++;
          id("set-count").textContent = "" + setCount;
          displayMessage(selectedCards, "SET!");
        } else {
          if (remainingSeconds < SECOND_PENALTY) {
            remainingSeconds = 0;
          } else {
            remainingSeconds -= SECOND_PENALTY;
          }
          displayTime();
          displayMessage(selectedCards, "Not a Set :(");
        }
        setTimeout(function() {
          genNewCards(selectedCards);
        }, SECOND);
      }
    }
  }

  /**
   * Hides the images currently on the card and displays the passed-in message
   * @param {array} selectedCards - An array of div elements representing cards
   * @param {string} message - Message to be displayed on the cards
   */
  function displayMessage(selectedCards, message) {
    for (let i = 0; i < selectedCards.length; i++) {
      let newP = document.createElement("p");
      newP.appendChild(document.createTextNode(message));
      selectedCards[i].appendChild(newP);
      selectedCards[i].classList.toggle("selected");
      selectedCards[i].classList.toggle("hide-imgs");
    }
  }

  /**
   * Replaces cards in the passed-in array with newly generated cards
   * @param {array} selected - An array of cards
   */
  function genNewCards(selected) {
    for (let i = 0; i < selected.length; i++) {
      id("board").replaceChild(generateUniqueCard(totalCards === EASY_NUMBER), selected[i]);
    }
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - List of all selected cards to check if a set.
   * @return {boolean} True if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let allSame = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      let allDiff = attributes[0][i] !== attributes[1][i] &&
                    attributes[1][i] !== attributes[2][i] &&
                    attributes[0][i] !== attributes[2][i];
      if (!(allDiff || allSame)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Helper funtion to access an element's id more easily
   * @param {string} idName id of the element being accessed
   * @return {string} returns the name element with the passed in id
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

})();
