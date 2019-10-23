/**
 * Michael Graham
 * 10/19/19
 * Section AL - Tal Wolman
 * HW2
 *
 * This is the JavaScript that provides interactivity to set.html. So far, it only allows the
 * user to toggle between menu view and game view
 */

"use strict";
(function() {
  window.addEventListener("load", init);

  let timerId;
  let remainingSeconds;
  let totalCards;

  const STYLE_ARRAY = ["solid", "outline", "striped"];
  const SHAPE_ARRAY = ["diamond", "oval", "squiggle"];
  const COLOR_ARRAY = ["red", "green", "purple"];
  const COUNT_ARRAY = [1, 2, 3];

  /**
   * Listens for the user to click a button, then calls toggleView function
   */
  function init() {
    id("start-btn").addEventListener("click", function() {
      toggleView();
      startTimer();
      fillBoard();
    });
    id("back-btn").addEventListener("click", toggleView);
    id("refresh-btn").addEventListener("click", fillBoard);
  }

  function fillBoard() {
    id("board").innerHTML = "";
    for(let i = 0; i < 12; i++) {
      generateUniqueCard(false);
    }
  }

  /**
   * Toggles the ui between the main menue and the game
   */
  function toggleView() {
    id("menu-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
  }

  /**
  * Returns an array of randomly generated attributes. If in easy mode, "Style" attribute will
  * always be "Solid"
  * @param {boolean} isEasy - Whether the gamemode is set to "Easy"
  * @return {array} attributes - Array of attributes
  */
  function generateRandomAttributes(isEasy) {
    let attributes = [
      STYLE_ARRAY[Math.floor(Math.random() * 3)],
      SHAPE_ARRAY[Math.floor(Math.random() * 3)],
      COLOR_ARRAY[Math.floor(Math.random() * 3)],
      COUNT_ARRAY[Math.floor(Math.random() * 3)]
    ];
    if(isEasy) {
      attributes[0] = "solid";
    }
    return attributes;
  }

  function generateUniqueCard(isEasy) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.addEventListener("click", cardSelected);
    let attributes = findUniqueAttributes(isEasy);
    card.id = generateId(attributes);

    for(let i = 1; i <= attributes[3]; i++) {
      let image = document.createElement("img");
      image.src = "img/" + generateSrc(attributes) + ".png";
      image.alt = generateId(attributes);
      card.appendChild(image);
    }
    id("board").appendChild(card);
  }

  function generateSrc(attributes) {
    return attributes[0] + "-" + attributes[1] + "-" + attributes[2];
  }

  function generateId(attributes) {
    return generateSrc(attributes) + "-" + attributes[3];
  }

  function findUniqueAttributes(isEasy) {
    let attributes = generateRandomAttributes(isEasy);
    let newCardId = generateId(attributes);
    let cards = qsa(".card");
    let idArray = [];
    for(let i = 0; i < cards.length; i++) {
        idArray.push(cards[i].getAttribute("id"));
    }
    if(idArray.includes(newCardId)) {
      attributes = findUniqueAttributes(isEasy);
    }
    return attributes;
  }

  function startTimer() {
    setInterval(advanceTimer, 1000);
  }

  function advanceTimer() {
    remainingSeconds--;
  }

  function cardSelected() {
    this.classList.toggle("selected");
    let test = qsa(".selected");
    if(test.length === 3) {
      if(isASet(test)) {
        for(let i = 0; i < test.length; i++) {
          let a = document.createTextNode("SET!");
          let p = document.createElement("p");
          p.appendChild(a);
          test[i].appendChild(p);
          test[i].classList.toggle("selected");
          test[i].classList.toggle("hide-imgs");
        }
      } else {
          for(let i = 0; i < test.length; i++) {
            let a = document.createTextNode("Not a Set :(");
            let p = document.createElement("p");
            p.appendChild(a);
            test[i].appendChild(p);
            test[i].classList.toggle("selected");
            test[i].classList.toggle("hide-imgs");
          }
        }
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
