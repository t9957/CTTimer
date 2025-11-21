import { Timer } from './Timer.js';

document.addEventListener("DOMContentLoaded", function () {
  const timersContainer = document.querySelector('.timer-container');
  const addTimerButton = document.getElementById('addTimer');
  addTimerButton.value = 1;
  const timer = new Timer(timersContainer);
  /* Dev */
  document.querySelector('.timer-display').value = 15;
  timer.play();
  /* end */
  addTimerButton.addEventListener('click', function () {
    new Timer(timersContainer);
  });
});