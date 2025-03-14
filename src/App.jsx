import pluralize from "pluralize";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import styles from "./App.module.scss";
import beepSound from "./assets/beep.mp3";
import gongSound from "./assets/gong.mp3";
import logo from "./assets/logo.svg";

function App() {
  const [isPaused, setIsPaused] = createSignal(true);
  const [minutes, setMinutes] = createSignal("05");
  const [seconds, setSeconds] = createSignal("00");
  const [total, setTotal] = createSignal(300000);
  const [minutesInt, setMinutesInt] = createSignal(5);
  const [isPristine, setIsPristine] = createSignal(true);
  const [finished, setFinished] = createSignal(false);

  const beep = new Audio(beepSound);
  const gong = new Audio(gongSound);

  const loadSounds = () => {
    beep.load();
    gong.load();
  };

  const startTimer = () => {
    if (isPristine()) {
      loadSounds();
    }
    initializeClock();
  };

  const initializeClock = () => {
    let timeinterval;

    const updateClock = () => {
      if (!isPaused()) {
        const timeRemaining = getTimeRemaining();

        setMinutes(("0" + timeRemaining.minutes).slice(-2));
        setSeconds(("0" + timeRemaining.seconds).slice(-2));
        setTotal(timeRemaining.total);

        if (timeRemaining.total === 0) {
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
    timeinterval = setInterval(updateClock, 100);
    onCleanup(() => clearInterval(timeinterval));
  };

  const getTimeRemaining = () => {
    const t = total() - 100;
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      total: t,
      minutes: minutes,
      seconds: seconds
    };
  };

  const prepForRestart = () => {
    setIsPaused(true);
    setIsPristine(false);
    setFinished(false);
  };

  createEffect(() => {
    const thresholds = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000, 0];

    if (thresholds.includes(total())) {
      beep.play();
      beep.currentTime = 0;
    }
  });

  createEffect(() => {
    switch (minutesInt()) {
      case 5:
        setMinutes("05");
        setSeconds("00");
        setTotal(300000);
        break;
      case 3:
        setMinutes("03");
        setSeconds("00");
        setTotal(180000);
        break;
      case 1:
        setMinutes("01");
        setSeconds("00");
        setTotal(60000);
        break;
    }
  });

  return (
    <div class={styles.App}>
      <h1 class={`${styles.h1} ${styles.bold}`}>Pitch Please!</h1>
      <div class={styles.border}>
        <h2 class={styles.h2}>{pluralize("minute", minutesInt(), true)}</h2>
        <img src={logo} alt="logo" />
        <p />
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
          <div class={styles.start_stop_container}>
            <Show
              when={isPaused() || finished()}
              fallback={
                <button
                  class={`${styles.button} ${styles.start_stop}`}
                  disabled={finished()}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPaused(true);
                  }}
                >
                  Pause
                </button>
              }
            >
              <button
                class={`${styles.button} ${styles.start_stop} ${styles.bold}`}
                disabled={finished()}
                onClick={(e) => {
                  e.preventDefault();
                  setIsPaused(false);
                  startTimer();
                  setIsPristine(false);
                }}
              >
                Start
              </button>
            </Show>
          </div>
          <div class={`${styles.minutes_btn_container} ${styles.bold}`}>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setMinutesInt(5);
                prepForRestart();
              }}
            >
              5 minutes
            </button>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setMinutesInt(3);
                prepForRestart();
              }}
            >
              3 minutes
            </button>
            <button
              class={styles.button}
              onClick={(e) => {
                e.preventDefault();
                setMinutesInt(1);
                prepForRestart();
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
