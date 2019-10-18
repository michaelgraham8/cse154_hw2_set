"use strict"

(function() {
  window.addEventListener("load", clickListen);

  function clickListen() {
    id("start-btn").addEventListener("click", toggleView);
    id("back-btn").addEventListener("click", toggleView);
  }
  function toggleView() {
    id("menue-view").classList.add("hidden");
    id("game-view").classList.remove("hidden");
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
