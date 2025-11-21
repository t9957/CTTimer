export class Timer {
  parent;

  #wrapper;
  #initialSec;
  #remaining;
  #intervalRef;

  constructor(container) {
    this.parent = container;
    this.#wrapper = document.createElement('div');
    this.#buildDOM();
    this.#attachEvents();
    return this;
  }

  play() {
    switch (Number(this.#wrapper.playBtn.value)) {
      case 0:
        this.#start();
        break;
      case 1:
        this.#restart();
        break;
      case 2:
        break;
      default:
        Timer.#logOutsideRange("playBtn.value: " + this.#wrapper.playBtn.value);
        playBtn.value = 0;
    }
  }

  pause() {
    this.#destroyInterval();
    this.#wrapper.playBtn.textContent = 'play';
    this.#wrapper.playBtn.value = 1;
    return this;
  }

  reset() {
    this.#destroyInterval();
    const init = this.#wrapper.timerInitialized;
    const disp = this.#wrapper.timerDisplay;

    const state = init.value != "";
    const sbn = Timer.#inputInterpretation(state ? init.value : disp.value);
    this.#initialSec = sbn;
    if (!state) {
      init.value = Timer.#formatTime(this.#initialSec);
    }
    disp.value = Timer.#formatTime(this.#initialSec);
    this.#remaining = this.#initialSec;
    this.#updateExterior();

    switch (Number(this.#wrapper.playBtn.value)) {
      case 0:
        break;
      case 1:
        this.pause();
        break;
      case 2:
        this.#restart();
        break;
      default:
        Timer.#logOutsideRange("playBtn.value: " + this.#wrapper.playBtn.value);
        this.#wrapper.playBtn.value = 0;
    }
    return this;
  }

  remove() {
    this.#destroyInterval().parent.removeChild(this.#wrapper);
  }

  #buildDOM() {
    const w = this.#wrapper;
    w.className = 'timer';

    const inputs = document.createElement('div');
    inputs.className = 'timer-inputs'
    w.appendChild(inputs);

    w.timerName = document.createElement('input');
    w.timerName.type = 'text';
    w.timerName.placeholder = 'name';
    w.timerName.className = 'timer-name';
    w.timerName.id = 'timer-name' + addTimer.value;
    inputs.appendChild(w.timerName);

    w.timerInitialized = document.createElement('input');
    w.timerInitialized.type = 'text';
    w.timerInitialized.placeholder = 'initial val';
    w.timerInitialized.className = 'timer-initialized even-numbered-horizontal';
    w.timerInitialized.id = 'timer-initialized' + addTimer.value;
    inputs.appendChild(w.timerInitialized);

    w.timerDisplay = document.createElement('input');
    w.timerDisplay.type = 'text';
    w.timerDisplay.placeholder = 'mm:ss';
    w.timerDisplay.className = 'timer-display';
    w.timerDisplay.id = 'timer-display' + addTimer.value;
    inputs.appendChild(w.timerDisplay);

    w.progressBar = document.createElement('div');
    w.progressBar.className = 'progress-bar';
    w.appendChild(w.progressBar);

    w.playBtn = document.createElement('button');
    w.playBtn.className = 'play-button playback';
    w.playBtn.textContent = 'play';
    w.playBtn.value = 0;
    w.appendChild(w.playBtn);

    w.resetBtn = document.createElement('button');
    w.resetBtn.className = 'reset-button even-numbered-horizontal';
    w.resetBtn.textContent = 'reset';
    w.appendChild(w.resetBtn);

    w.closeBtn = document.createElement('button');
    w.closeBtn.className = 'close-button';
    w.closeBtn.textContent = '×';
    w.appendChild(w.closeBtn);

    this.parent.appendChild(w);

    return this;
  }

  #attachEvents() {
    const playBtn = this.#wrapper.playBtn;
    playBtn.addEventListener('click', () => {
      switch (Number(playBtn.value)) {
        case 0:
          this.#start();
          break;
        case 1:
          this.#restart();
          break;
        case 2:
          this.pause();
          break;
        default:
          Timer.#logOutsideRange("playBtn.value: " + this.#wrapper.playBtn.value);
          playBtn.value = 0;
      }
    });
    this.#wrapper.resetBtn.addEventListener('click', () => {
      this.reset();
    });
    this.#wrapper.closeBtn.addEventListener('click', () => {
      this.remove();
    });

    return this;
  }

  #start() {
    let timerNameVal = this.#wrapper.timerName.value;
    if (!timerNameVal) {
      const addTimer = document.getElementById('addTimer');
      timerNameVal = 'timer' + addTimer.value;
      addTimer.value++;
      this.#wrapper.timerName.value = timerNameVal;
    }
    this.reset().#newInterval();
    this.#wrapper.playBtn.textContent = 'pause';
    this.#wrapper.playBtn.value = 2;
    return this;
  }

  #restart() {
    const init = this.#wrapper.timerInitialized;
    const disp = this.#wrapper.timerDisplay;
    this.#initialSec = Timer.#inputInterpretation(init.value);
    this.#remaining = Timer.#inputInterpretation(disp.value);
    this.#updateExterior();
    this.#newInterval();
    this.#wrapper.playBtn.textContent = 'pause';
    this.#wrapper.playBtn.value = 2;
    return this;
  }

  #newInterval() {
    this.#intervalRef = setInterval(() => {
      this.#remaining--;
      if (this.#remaining >= 0) {
        this.#updateExterior();
        if (this.#remaining == 0) {
          this.#remaining = this.#initialSec;
        }
      } else {
        Timer.#logOutsideRange("this.#remaining: " + this.#remaining);
        this.#destroyInterval();
      }
    }, 1000);
    return this;
  }

  #destroyInterval() {
    clearInterval(this.#intervalRef);
    return this;
  }

  #updateExterior() {
    const bar = this.#wrapper.progressBar;
    this.#wrapper.timerDisplay.value = Timer.#formatTime(this.#remaining);
    let status = (this.#remaining / this.#initialSec);
    status = status > 1 ? 1 : status;
    bar.style.width = status * 100 + '%';
    if (this.#remaining < 22) {
      bar.style.backgroundColor = '#777777';
    } else if (this.#remaining < 45) {
      bar.style.backgroundColor = 'rgb(185, 114, 114)';
    } else if (this.#remaining < 90) {
      bar.style.backgroundColor = 'rgb(218, 218, 138)';
    } else if (this.#remaining < 1800) {
      bar.style.backgroundColor = 'rgb(102, 209, 143)';
    } else {
      bar.style.backgroundColor = 'rgb(138, 179, 218)';
    }
    return this;
  }

  static #inputInterpretation(str) {
    const inputTime = str.split(':').reverse().map((i) => Number(i));
    let shouldBeNow = 0;
    shouldBeNow += inputTime[0] > 0 ? inputTime[0] : 0;
    shouldBeNow += inputTime[1] > 0 ? inputTime[1] * 60 : 0;
    shouldBeNow += inputTime[2] > 0 ? inputTime[2] * 3600 : 0;
    shouldBeNow += inputTime[3] > 0 ? inputTime[3] * 3600 * 24 : 0;
    shouldBeNow += inputTime[4] > 0 ? inputTime[4] * 3600 * 24 * 31 : 0;
    shouldBeNow += inputTime[5] > 0 ? inputTime[5] * 3600 * 24 * 365 : 0;
    return shouldBeNow;
  }

  static #formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  static #logOutsideRange(str) {
    console.log(str + '\n This is outside the expected range.');
  }
}
