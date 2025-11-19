export class Timer {
  timersContainer;
  intervalId;
  initialSeconds;
  time;
  timerWrapper;

  constructor(container) {
    this.timersContainer = container;
    this.intervalId = null;
    this.initialSeconds = 0;
    this.time = 0;

    this.buildDOM();
    this.attachEvents();
  }

  buildDOM() {
    const timerWrapper = document.createElement('div');
    timerWrapper.className = 'timer';
    this.timerWrapper = timerWrapper;

    const timerName = document.createElement('input');
    timerName.type = 'text';
    timerName.placeholder = 'タイマー名';
    timerName.className = 'timer-name';
    timerWrapper.appendChild(timerName);

    const timerInitialized = document.createElement('input');
    timerInitialized.type = 'text';
    timerInitialized.placeholder = '初期化値';
    timerInitialized.className = 'timer-initialized';
    timerWrapper.appendChild(timerInitialized);

    const timerDisplay = document.createElement('input');
    timerDisplay.type = 'text';
    timerDisplay.placeholder = 'mm:ss';
    timerDisplay.className = 'timer-display'
    timerWrapper.appendChild(timerDisplay);

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    timerWrapper.appendChild(progressBar);

    const playButton = document.createElement('button');
    playButton.className = 'play-button playback';
    playButton.textContent = 'play';
    playButton.value = 0;
    timerWrapper.appendChild(playButton);

    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'reset';
    resetButton.value = 0;
    timerWrapper.appendChild(resetButton);

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '×';
    timerWrapper.appendChild(closeButton);

    this.timersContainer.appendChild(timerWrapper);
  }

  attachEvents() {
    const timerWrapper = this.timerWrapper;
    const playbackButton = timerWrapper.getElementsByClassName('playback')[0];
    playbackButton.addEventListener('click', () => {
      switch (Number(playbackButton.value)) {
        case 0:
          this.start();
          playbackButton.value = 2;
          break;
        case 1:
          this.restart();
          playbackButton.value = 2;
          break;
        case 2:
          this.pause();
          playbackButton.value = 1;
          break;
        default:
          console.log('playbackButton.value: ' + playbackButton.value
            + ' This is outside the expected range.');
          playbackButton.value = 0;
      }
    });
    const resetButton = timerWrapper.getElementsByClassName('reset-button')[0];
    resetButton.addEventListener('click', () => {
      this.reset();
    });
    const closeButton = timerWrapper.getElementsByClassName('close-button')[0];
    closeButton.addEventListener('click', () => {
      this.remove();
    });
  }

  start() {
    const timerWrapper = this.timerWrapper;
    const timerName = timerWrapper.getElementsByClassName('timer-name')[0];
    const timerDisplay = timerWrapper.getElementsByClassName('timer-display')[0];
    const progressBar = timerWrapper.getElementsByClassName('progress-bar')[0];
    const resetButton = timerWrapper.getElementsByClassName('reset-button')[0];

    let timerNameVal = timerName.value;
    if (!timerNameVal) {
      const addTimer = document.getElementById('addTimer');
      timerNameVal = 'timer' + addTimer.value;
      addTimer.value++;
      timerName.value = timerNameVal;
    }
    let test = this.reset();
    console.log(test);
    const timerDurationVal = resetButton.value;
    console.log(timerDurationVal);
    let time = timerDurationVal;
    const timerInterval = setInterval(() => {
      time--;
      if (time >= 0) {
        timerDisplay.value = Timer.#formatTime(time);
        progressBar.style.width = 100 - ((timerDurationVal - time) / timerDurationVal) * 100 + '%';
        if (time < 22) {
          progressBar.style.backgroundColor = '#777777';
        } else if (time < 45) {
          progressBar.style.backgroundColor = 'rgb(185, 114, 114)';
        } else if (time < 90) {
          progressBar.style.backgroundColor = 'rgb(218, 218, 138)';
        } else if (time < 1800) {
          progressBar.style.backgroundColor = 'rgb(102, 209, 143)';
        } else {
          progressBar.style.backgroundColor = 'rgb(138, 179, 218)';
        }
        if (time == 0) {
          time = timerDurationVal;
        }
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
    timerWrapper.value = timerInterval;
  }

  restart() { }

  pause() {
    clearInterval(this.timerWrapper.value);
  }

  reset() {
    const timerWrapper = this.timerWrapper;
    const timerInitialized = timerWrapper.getElementsByClassName('timer-initialized')[0];
    const timerDisplay = timerWrapper.getElementsByClassName('timer-display')[0];
    const playbackButton = timerWrapper.getElementsByClassName('playback')[0];
    const resetButton = timerWrapper.getElementsByClassName('reset-button')[0];

    let state = timerInitialized.value != "";
    let inputTime;
    if (state) {
      inputTime = timerInitialized.value.split(':').reverse();
      state = 1;
    } else {
      inputTime = timerDisplay.value.split(':').reverse();
    }
    inputTime = inputTime.map((i) => Number(i));
    let timerDurationVal = 0;
    timerDurationVal += inputTime[0] > 0 ? inputTime[0] : 0;
    timerDurationVal += inputTime[1] > 0 ? inputTime[1] * 60 : 0;
    timerDurationVal += inputTime[2] > 0 ? inputTime[2] * 3600 : 0;
    timerDurationVal += inputTime[3] > 0 ? inputTime[3] * 3600 * 24 : 0;
    timerDurationVal += inputTime[4] > 0 ? inputTime[4] * 3600 * 24 * 31 : 0;
    timerDurationVal += inputTime[5] > 0 ? inputTime[5] * 3600 * 24 * 365 : 0;
    if (!state) {
      timerInitialized.value = Timer.#formatTime(timerDurationVal);
    }
    timerDisplay.value = Timer.#formatTime(timerDurationVal);
    resetButton.value = timerDurationVal;

    switch (Number(playbackButton.value)) {
      case 0:
        break;
      case 1:
        this.pause();
        break;
      case 2:
        this.restart();
        break;
      default:
        console.log('playbackButton.value: ' + playbackButton.value
          + ' This is outside the expected range.');
        playbackButton.value = 0;
    }
    return timerDurationVal;
  }

  remove() {
    clearInterval(this.timerWrapper.value);
    this.timersContainer.removeChild(this.timerWrapper);
    console.log('clearInterval');
  }

  static #formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
