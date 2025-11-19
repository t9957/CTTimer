document.addEventListener("DOMContentLoaded", function () {
  let addTimerButtonCount = 1;
  const timersContainer = document.querySelector('.timer-container');
  const addTimerButton = document.getElementById('addTimer');

  // タイマーの追加
  addTimerButton.addEventListener('click', function () {
    createTimer();
  });

  // タイマーの作成
  function createTimer() {
    const timerWrapper = document.createElement('div');
    timerWrapper.className = 'timer';

    const timerName = document.createElement('input');
    timerName.type = 'text';
    timerName.placeholder = 'タイマー名';
    timerName.className = 'timer-name';
    timerName.id = 'timer-name';
    const timerInitialized = document.createElement('input');
    timerInitialized.type = 'text';
    timerInitialized.placeholder = '初期化値';
    timerInitialized.className = 'timer-initialized';
    timerInitialized.id = 'timer-initialized';
    const timerDisplay = document.createElement('input');
    timerDisplay.type = 'text';
    timerDisplay.placeholder = 'mm:ss';
    timerDisplay.className = 'timer-display'
    timerDisplay.id = 'timer-display'
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';

    const playButton = document.createElement('button');
    playButton.className = 'play-button playback';
    playButton.textContent = 'play';
    playButton.addEventListener('click', function () {
      playButton.style.display = "none";
      pauseButton.style.display = "";
      let timerDurationVal = parseInt(timerDisplay.value.split(':')
        .reduce((acc, time) => (60 * acc) + +time, 0), 10);
      console.log('resetButton.value == ' + resetButton.value);
      if (resetButton.value == 0) {
        resetButton.value = timerDurationVal;
      }
      startTimer(timerWrapper);
    });
    const pauseButton = document.createElement('button');
    pauseButton.className = 'pause-button playback';
    pauseButton.textContent = 'pause';
    pauseButton.value = 0;
    const resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.textContent = 'reset';
    resetButton.value = 0;

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '×';
    closeButton.addEventListener('click', function () {
      timersContainer.removeChild(timerWrapper);
    });

    timerWrapper.appendChild(timerName);
    timerWrapper.appendChild(timerInitialized);
    timerWrapper.appendChild(timerDisplay);
    timerWrapper.appendChild(progressBar);
    timerWrapper.appendChild(playButton);
    timerWrapper.appendChild(pauseButton);
    timerWrapper.appendChild(resetButton);
    timerWrapper.appendChild(closeButton);
    timersContainer.appendChild(timerWrapper);
    pauseButton.style.display = "none";
    playButton.style.display = "";
  }

  function startTimer(timerWrapper) {
    const timerName = timerWrapper.getElementsByClassName('timer-name')[0];
    const timerDisplay = timerWrapper.getElementsByClassName('timer-display')[0];
    const progressBar = timerWrapper.getElementsByClassName('progress-bar')[0];
    const playButton = timerWrapper.getElementsByClassName('play-button')[0];
    const pauseButton = timerWrapper.getElementsByClassName('pause-button')[0];
    const resetButton = timerWrapper.getElementsByClassName('reset-button')[0];
    const closeButton = timerWrapper.getElementsByClassName('close-button')[0];

    let timerNameVal = timerName.value;
    if (!timerNameVal) {
      timerNameVal = 'timer' + addTimerButtonCount;
      addTimerButtonCount++;
      timerName.value = timerNameVal
    }
    let timerDurationVal = parseInt(timerDisplay.value.split(':')
      .reduce((acc, time) => (60 * acc) + +time, 0), 10);

    console.log(timerNameVal + ' - ' + timerDurationVal);

    let time = timerDurationVal; // カウントダウンする時間（秒）
    timerDurationVal = resetButton.value;
    const timerInterval = setInterval(function () {
      time--;
      if (time >= 0) {
        timerDisplay.value = formatTime(time);
        progressBar.style.width = 100 - ((timerDurationVal - time) / timerDurationVal) * 100 + '%';
        if (time < 22) {
          progressBar.style.backgroundColor = 'transparent';
        } else if (time < 45) {
          progressBar.style.backgroundColor = 'rgb(185, 114, 114)';
        } else if (time < 90) {
          progressBar.style.backgroundColor = 'rgb(218, 218, 138)';
        } else if (time < 1800) {
          progressBar.style.backgroundColor = 'rgb(102, 209, 143)';
        } else {
          progressBar.style.backgroundColor = 'none';
        }
        if (time == 0) {
          time = timerDurationVal;
        }
      } else {
        clearInterval(timerInterval);
      }
    }, 1000);
    playButton.value = timerInterval;

    if (pauseButton.value == 0) {
      pauseButton.addEventListener('click', function () {
        pauseButton.style.display = "none";
        playButton.style.display = "";
        pauseButton.value = 1;
        clearInterval(playButton.value);
      });
      resetButton.addEventListener('click', function () {
        playButton.style.display = "none";
        pauseButton.style.display = "";
        pauseButton.value = 1;
        clearInterval(playButton.value);
        timerDisplay.value = resetButton.value;
        let timerDurationVal = parseInt(timerDisplay.value.split(':')
          .reduce((acc, time) => (60 * acc) + +time, 0), 10);
        console.log('resetButton.value == ' + resetButton.value);
        if (resetButton.value == 0) {
          resetButton.value = timerDurationVal;
        }
        startTimer(timerWrapper);
      });
      closeButton.addEventListener('click', function () {
        clearInterval(playButton.value);
        console.log('clearInterval');
      });
    }
  }

  // 時間のフォーマット
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
});