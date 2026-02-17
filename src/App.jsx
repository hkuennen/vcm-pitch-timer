import { DarkMode, LightMode, VolumeOff, VolumeUp } from "@suid/icons-material";
import { createEffect, createSignal, For, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import styles from "./App.module.scss";
import beepSound from "./assets/beep.mp3";
import gongSound from "./assets/gong.mp3";
import logo from "./assets/logo.svg";
import SwitchButton from "./components/SwitchButton";

function App() {
  const radius = 160;
  const circumference = 2 * Math.PI * radius;
  const visibleArc = 0.8 * circumference;

  const [isPaused, setIsPaused] = createSignal(true);
  const [minutes, setMinutes] = createSignal("05");
  const [seconds, setSeconds] = createSignal("00");
  const [total, setTotal] = createSignal(300000);
  const [minutesInt, setMinutesInt] = createSignal(5);
  const [isFinished, setIsFinished] = createSignal(false);
  const [isMuted, setIsMuted] = createSignal(false);
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const [timerArc, setTimerArc] = createSignal(visibleArc);

  const [timers, setTimers] = createStore([
    { minutesInt: 5, minutes: "05", seconds: "00", total: 300000, isSelected: true },
    { minutesInt: 3, minutes: "03", seconds: "00", total: 180000, isSelected: false },
    { minutesInt: 1, minutes: "01", seconds: "00", total: 60000, isSelected: false }
  ]);

  const beep = new Audio(beepSound);
  const gong = new Audio(gongSound);

  let timeinterval;

  const initializeClock = () => {
    const updateClock = () => {
      if (!isPaused()) {
        const { minutes, seconds, total } = getTimeRemaining();
        const progress = total / (1000 * 60 * minutesInt());
        const shrinkArc = visibleArc * progress;

        setMinutes(("0" + minutes).slice(-2));
        setSeconds(("0" + seconds).slice(-2));
        setTotal(total);
        setTimerArc(shrinkArc);

        if (total === 1000) {
          clearInterval(timeinterval);
          setMinutes("00");
          setSeconds("00");
          setTimerArc(0);
          setIsFinished(true);
          if (isMuted()) return;
          gong.play();
          gong.currentTime = 0;
        }
      } else {
        clearInterval(timeinterval);
        if (isMuted()) return;
        beep.pause();
        beep.currentTime = 0;
      }
    };
    timeinterval = setInterval(updateClock, 100);
  };

  onCleanup(() => clearInterval(timeinterval));

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

  const prepForRestart = (timer) => {
    const { minutesInt, minutes, seconds, total } = timer;
    setIsPaused(true);
    setIsFinished(false);
    setMinutesInt(minutesInt);
    setMinutes(minutes);
    setSeconds(seconds);
    setTotal(total);
    setTimerArc(visibleArc);
  };

  const handleSwitch = (e) => {
    setIsMuted(!e.target.checked ? false : true);
  };

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode());
  };

  createEffect(() => {
    const thresholds = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000];

    if (thresholds.includes(total()) && !isMuted()) {
      beep.play();
      beep.currentTime = 0;
    }
  });

  onMount(() => {
    beep.load();
    gong.load();
  });

  return (
    <div class={`${styles.app} ${isDarkMode() ? styles.dark : ""}`}>
      <div class={styles.card}>
        <div class={styles.topbar}>
          <div class={styles.branding}>
            <img class={styles.logo} src={logo} alt="logo" />
            <p class={styles.text}>
              Pitch <span>Please</span>
            </p>
          </div>
          <div class={styles.settings}>
            <div class={styles.volume}>
              <Show
                when={!isMuted()}
                fallback={<VolumeOff sx={{ color: isDarkMode() ? "#f9fafb" : "#343740" }} />}
              >
                <VolumeUp sx={{ color: isDarkMode() ? "#f9fafb" : "#343740" }} />
              </Show>
              <SwitchButton size="small" onChange={(e) => handleSwitch(e)} checked={!isMuted()} />
            </div>
            <div class={styles.dark_mode} onClick={handleToggle}>
              <Show when={isDarkMode()} fallback={<DarkMode sx={{ color: "#343740" }} />}>
                <LightMode sx={{ color: "#f9fafb" }} />
              </Show>
            </div>
          </div>
        </div>
        <h1 class={styles.title}>Pitch Please!</h1>
        <p class={styles.caption}>Run your next pitch like a pro.</p>
        <div class={`${styles.timer_wrapper} ${!isPaused() ? styles.running : ""}`}>
          <svg class={styles.progress_ring} width="400" height="400">
            <circle class={styles.progress_background} r="185" cx="200" cy="200" />
            <circle class={styles.progress_circle1} r={radius} cx="200" cy="200" />
            <circle
              class={styles.progress_circle2}
              display={isFinished() && "none"}
              stroke-dasharray={[timerArc(), circumference]}
              stroke-dashoffset={0}
              r={radius}
              cx="200"
              cy="200"
            />
          </svg>
          <div class={styles.logo_wrapper}>
            <img class={styles.logo} src={logo} alt="logo" />
          </div>
          <div class={styles.timer}>
            {minutes()}:{seconds()}
          </div>
          <div class={`${styles.caption} ${styles.label}`}>{minutesInt()} min pitch</div>

          <div class={styles.primary_btn_wrapper}>
            <Switch
              fallback={
                <button
                  class={`${styles.btn} ${styles.primary_btn}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPaused(false);
                    initializeClock();
                  }}
                >
                  Start
                </button>
              }
            >
              <Match when={!isPaused() && isFinished()}>
                <button
                  class={`${styles.btn} ${styles.primary_btn}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const timer = timers.find((timer) => timer.minutesInt === minutesInt());
                    prepForRestart(timer);
                  }}
                >
                  Reset
                </button>
              </Match>
              <Match when={!isPaused() && !isFinished()}>
                <button
                  class={`${styles.btn} ${styles.primary_btn}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPaused(true);
                  }}
                >
                  Pause
                </button>
              </Match>
            </Switch>
          </div>
        </div>
        <div class={`${styles.interval_btn_container}`}>
          <For each={timers}>
            {(timer, idx) => (
              <button
                class={`${styles.btn} ${timer.isSelected ? styles.selected_btn : styles.secondary_btn}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTimers([0, 1, 2], { isSelected: false });
                  setTimers(idx(), { isSelected: true });
                  prepForRestart(timer);
                }}
              >
                {timer.minutesInt} min
              </button>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export default App;
