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
  window.addEventListener("load", clickListen);

  /**
  * Listens for the user to click a button, then calls toggleView function
  */
  function clickListen() {
    id("start-btn").addEventListener("click", toggleView);
    id("back-btn").addEventListener("click", toggleView);
  }

  /**
   * Toggles the ui between the main menue and the game
   */
  function toggleView() {
    id("menu-view").classList.toggle("hidden");
    id("game-view").classList.toggle("hidden");
  }

  /**
   * Helper funtion to access an element's id more easily
   * @param {string} idName id of the element being accessed
   * @return {string} returns the name element with the passed in id
   */
  function id(idName) {
    return document.getElementById(idName);
  }
})();
