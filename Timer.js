export class Timer {
  parent;
  wrapper;
  initialSeconds;
  #intervalRef;

  constructor(container) {
    this.parent = container;
    this.wrapper = document.createElement('div');
    this.initialSeconds = null;

    this.#intervalRef = null;

    this.buildDOM();
    this.attachEvents();
    return this;
  }

  buildDOM() {

    const w = this.wrapper;
    w.className = 'timer';

    w.timerName = document.createElement('input');
    w.timerName.type = 'text';
    w.timerName.placeholder = 'タイマー名';
    w.timerName.className = 'timer-name';
    w.appendChild(w.timerName);

    w.timerInitialized = document.createElement('input');
    w.timerInitialized.type = 'text';
    w.timerInitialized.placeholder = '初期化値';
    w.timerInitialized.className = 'timer-initialized';
    w.appendChild(w.timerInitialized);

    w.timerDisplay = document.createElement('input');
    w.timerDisplay.type = 'text';
    w.timerDisplay.placeholder = 'mm:ss';
    w.timerDisplay.className = 'timer-display'
    w.appendChild(w.timerDisplay);

    w.progressBar = document.createElement('div');
    w.progressBar.className = 'progress-bar';
    w.appendChild(w.progressBar);

    w.playBtn = document.createElement('button');
    w.playBtn.className = 'play-button playback';
    w.playBtn.textContent = 'play';
    w.playBtn.value = 0;
    w.appendChild(w.playBtn);

    w.resetBtn = document.createElement('button');
    w.resetBtn.className = 'reset-button';
    w.resetBtn.textContent = 'reset';
    w.resetBtn.value = 0;
    w.appendChild(w.resetBtn);

    w.closeBtn = document.createElement('button');
    w.closeBtn.className = 'close-button';
    w.closeBtn.textContent = '×';
    w.appendChild(w.closeBtn);

    this.parent.appendChild(w);

    return this;
  }

  attachEvents() {
    const playBtn = this.wrapper.playBtn;
    playBtn.addEventListener('click', () => {
      switch (Number(playBtn.value)) {
        case 0:
          this.start();
          playBtn.value = 2;
          break;
        case 1:
          this.restart();
          playBtn.value = 2;
          break;
        case 2:
          this.pause();
          playBtn.value = 1;
          break;
        default:
          console.log('playBtn.value: ' + playBtn.value
            + ' This is outside the expected range.');
          playBtn.value = 0;
      }
    });
    this.wrapper.resetBtn.addEventListener('click', () => {
      this.reset();
    });
    this.wrapper.closeBtn.addEventListener('click', () => {
      this.remove();
    });

    return this;
  }

  start() {
    let timerNameVal = this.wrapper.timerName.value;
    if (!timerNameVal) {
      const addTimer = document.getElementById('addTimer');
      timerNameVal = 'timer' + addTimer.value;
      addTimer.value++;
      this.wrapper.timerName.value = timerNameVal;
    }
    this.reset().#newInterval();

    return this;
  }

  restart() { }

  pause() {
    this.#destroyInterval();
    return this;
  }

  reset() {
    const init = this.wrapper.timerInitialized;
    const disp = this.wrapper.timerDisplay;

    let state = init.value != "";
    let inputTime;
    if (state) {
      inputTime = init.value.split(':').reverse();
      state = 1;
    } else {
      inputTime = disp.value.split(':').reverse();
    }
    inputTime = inputTime.map((i) => Number(i));
    let shouldBeNow = 0;
    shouldBeNow += inputTime[0] > 0 ? inputTime[0] : 0;
    shouldBeNow += inputTime[1] > 0 ? inputTime[1] * 60 : 0;
    shouldBeNow += inputTime[2] > 0 ? inputTime[2] * 3600 : 0;
    shouldBeNow += inputTime[3] > 0 ? inputTime[3] * 3600 * 24 : 0;
    shouldBeNow += inputTime[4] > 0 ? inputTime[4] * 3600 * 24 * 31 : 0;
    shouldBeNow += inputTime[5] > 0 ? inputTime[5] * 3600 * 24 * 365 : 0;
    this.initialSeconds = shouldBeNow;
    if (!state) {
      init.value = Timer.#formatTime(this.initialSeconds);
    }
    disp.value = Timer.#formatTime(this.initialSeconds);
    this.wrapper.resetBtn.value = this.initialSeconds;

    switch (Number(this.wrapper.playBtn.value)) {
      case 0:
        break;
      case 1:
        this.pause();
        break;
      case 2:
        this.restart();
        break;
      default:
        console.log('playBtn.value: ' + this.wrapper.playBtn.value
          + ' This is outside the expected range.');
        this.wrapper.playBtn.value = 0;
    }
    return this;
  }

  remove() {
    this.#destroyInterval().parent.removeChild(this.wrapper);
  }

  #newInterval() {
    const bar = this.wrapper.progressBar
    let time = this.initialSeconds;
    this.#intervalRef = setInterval(() => {
      time--;
      if (time >= 0) {
        this.wrapper.value = Timer.#formatTime(time);
        bar.style.width = 100 - ((this.initialSeconds - time) / this.initialSeconds) * 100 + '%';
        if (time < 22) {
          bar.style.backgroundColor = '#777777';
        } else if (time < 45) {
          bar.style.backgroundColor = 'rgb(185, 114, 114)';
        } else if (time < 90) {
          bar.style.backgroundColor = 'rgb(218, 218, 138)';
        } else if (time < 1800) {
          bar.style.backgroundColor = 'rgb(102, 209, 143)';
        } else {
          bar.style.backgroundColor = 'rgb(138, 179, 218)';
        }
        if (time == 0) {
          time = this.initialSeconds;
        }
      } else {
        clearInterval(this.#intervalRef);
      }
    }, 1000);
    return this;
  }

  #destroyInterval() {
    clearInterval(this.#intervalRef);
    return this;
  }


  static #formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
}
