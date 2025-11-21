import { Timer } from './Timer.js';

document.addEventListener("DOMContentLoaded", function () {
  const timersContainer = document.querySelector('.timer-container');
  const addTimerButton = document.getElementById('addTimer');
  addTimerButton.value = 1;

  addTimerButton.addEventListener('click', function () {
    new Timer(timersContainer);
  });
});