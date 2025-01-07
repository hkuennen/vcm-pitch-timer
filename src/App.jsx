import { createSignal, onCleanup } from "solid-js";
import beepSound from "./assets/beep.mp3";
import gongSound from "./assets/gong.mp3";
import logo from "./assets/logo.svg";
import styles from "./App.module.scss";

function App() {
  const [deadline, setDeadline] = createSignal(new Date());
  const [isPaused, setIsPaused] = createSignal(true);
  const [minutes, setMinutes] = createSignal("05");
  const [seconds, setSeconds] = createSignal("00");
  const [total, setTotal] = createSignal(300000);
  const [minutesInt, setMinutesInt] = createSignal(5);
  const [timePermitted, setTimePermitted] = createSignal("5 minutes");
  const [clickCount, setClickCount] = createSignal(0);
  const [finished, setFinished] = createSignal(false);

  const beep = new Audio(beepSound);
  const gong = new Audio(gongSound);

  const loadSounds = () => {
    beep.load();
    gong.load();
  };

  const getTimeRemaining = (endtime) => {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      total: t,
      minutes: minutes,
      seconds: seconds
    };
  };

  const startTimer = () => {
    if (clickCount() < 1) {
      loadSounds();
      setDeadline(addMinutes(minutesInt()));
    }
    setTimeout(() => initializeClock(), 200);
  };

  const stopTimer = () => {
    setTimeout(() => stopClock(), 10);
  };

  const initializeClock = () => {
    const updateClock = () => {
      if (!isPaused()) {
        let t = getTimeRemaining(deadline());

        setMinutes(("0" + t.minutes).slice(-2));
        setSeconds(("0" + t.seconds).slice(-2));
        setTotal(t.total);

        if (total() < 12000) {
          beep.play();
          beep.currentTime = 0;
        }

        if (total() < 2000) {
          clearInterval(timeinterval);
          setMinutes("00");
          setSeconds("00");
          setFinished(true);
          gong.play();
          gong.currentTime = 0;
        }
      } else {
        clearInterval(timeinterval);
        beep.pause();
        beep.currentTime = 0;
      }
    };
    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
    onCleanup(() => clearInterval(timeinterval));
  };

  const stopClock = () => {
    const updateClock = () => {
      if (isPaused()) {
        setDeadline(new Date(Date.parse(deadline()) + 1000));
      } else {
        clearInterval(timeinterval);
      }
    };
    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
    onCleanup(() => clearInterval(timeinterval));
  };

  const addMinutes = (numOfMinutes, date = new Date()) => {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  };

  let button;
  if (isPaused() || finished()) {
    button = (
      <button
        class={`${styles.button} ${styles.start_stop} ${styles.bold}`}
        disabled={finished()}
        onClick={(e) => {
          e.preventDefault();
          setIsPaused(false);
          setClickCount(clickCount() + 1);
          startTimer();
        }}
      >
        Start
      </button>
    );
  } else {
    button = (
      <button
        class={`${styles.button} ${styles.start_stop}`}
        disabled={finished()}
        onClick={(e) => {
          e.preventDefault();
          setIsPaused(true);
          stopTimer();
        }}
      >
        Pause
      </button>
    );
  }

  return (
    <div class={styles.App}>
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></link>
      <h1 class={`${styles.h1} ${styles.bold}`}>Pitch Please!</h1>
      <div class={styles.border}>
        <h2 class={styles.h2}>{timePermitted()}</h2>
        <img src={logo} alt="logo" />
        <p></p>
        <div id={styles.clock_container}>
          <div>
            <span class={styles.minutes}>{minutes()}</span>
            <div class={styles.smalltext}>min</div>
          </div>
          <div>
            <span class={styles.seconds}>{seconds()}</span>
            <div class={styles.smalltext}>sec</div>
          </div>
        </div>
        <div>
          <div class={styles.start_stop_container}>{button}</div>
          <div class={`${styles.minutes_btn_container} ${styles.bold}`}>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setIsPaused(true);
                setMinutes("05");
                setSeconds("00");
                setTotal(300000);
                setMinutesInt(5);
                setTimePermitted("5 minutes");
                setClickCount(0);
                setFinished(false);
              }}
            >
              5 minutes
            </button>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setIsPaused(true);
                setMinutes("03");
                setSeconds("00");
                setTotal(180000);
                setMinutesInt(3);
                setTimePermitted("3 minutes");
                setClickCount(0);
                setFinished(false);
              }}
            >
              3 minutes
            </button>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setIsPaused(true);
                setMinutes("01");
                setSeconds("00");
                setTotal(60000);
                setMinutesInt(1);
                setTimePermitted("1 minute");
                setClickCount(0);
                setFinished(false);
              }}
            >
              1 minute
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
