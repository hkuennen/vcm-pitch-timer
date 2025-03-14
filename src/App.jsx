import pluralize from "pluralize";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import styles from "./App.module.scss";
import beepSound from "./assets/beep.mp3";
import gongSound from "./assets/gong.mp3";
import logo from "./assets/logo.svg";

function App() {
  const [deadline, setDeadline] = createSignal(new Date());
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
      setDeadline(addMinutes(minutesInt()));
    }
    setTimeout(() => initializeClock(), 200);
  };

  const pauseTimer = () => {
    setTimeout(() => {
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
    }, 10);
  };

  const initializeClock = () => {
    const updateClock = () => {
      if (!isPaused()) {
        let timeRemaining = getTimeRemaining(deadline());

        setMinutes(("0" + timeRemaining.minutes).slice(-2));
        setSeconds(("0" + timeRemaining.seconds).slice(-2));
        setTotal(timeRemaining.total);

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

  const addMinutes = (numOfMinutes, date = new Date()) => {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  };

  const getTimeRemaining = (endtime) => {
    let total = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((total / 1000) % 60);
    let minutes = Math.floor((total / 1000 / 60) % 60);
    return {
      total: total,
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
                    pauseTimer();
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
