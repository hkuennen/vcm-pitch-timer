import { DarkMode, LightMode, VolumeOff, VolumeUp } from "@suid/icons-material";
import { createEffect, createSignal, For, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import "./App.scss";
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
    <div class={`app ${isDarkMode() ? "dark" : ""}`}>
      <div class="card">
        <div class="header">
          <div class="branding">
            <img class="branding__logo" src={logo} alt="logo" />
            <p class="branding__text">
              Pitch <span>Please</span>
            </p>
          </div>
          <div class="settings">
            <div class="settings__volume">
              <Show
                when={!isMuted()}
                fallback={<VolumeOff sx={{ color: isDarkMode() ? "#f9fafb" : "#343740" }} />}
              >
                <VolumeUp sx={{ color: isDarkMode() ? "#f9fafb" : "#343740" }} />
              </Show>
              <SwitchButton size="small" onChange={(e) => handleSwitch(e)} checked={!isMuted()} />
            </div>
            <a class="settings__button" onClick={handleToggle}>
              <Show when={isDarkMode()} fallback={<DarkMode sx={{ color: "#343740" }} />}>
                <LightMode sx={{ color: "#f9fafb" }} />
              </Show>
            </a>
            <a
              class="settings__button"
              href="https://github.com/hkuennen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={isDarkMode() ? "#f9fafb" : "#343740"}
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
        <h1 class="card__title">Pitch Please!</h1>
        <p class="card__caption">Run your next pitch like a pro.</p>
        <div class={`timer ${!isPaused() ? "running" : ""}`}>
          <svg class="timer__svg" viewBox="0 0 400 400">
            <circle class="timer__circle--bg" r="185" cx="200" cy="200" />
            <circle class="timer__circle--static" r={radius} cx="200" cy="200" />
            <circle
              class="timer__circle--progress"
              display={isFinished() && "none"}
              stroke-dasharray={[timerArc(), circumference]}
              stroke-dashoffset={0}
              r={radius}
              cx="200"
              cy="200"
            />
          </svg>
          <div class="logo">
            <img class="logo__img" src={logo} alt="logo" />
          </div>
          <div class="timer__countdown">
            {minutes()}:{seconds()}
          </div>
          <div class="timer__caption">{minutesInt()} min pitch</div>

          <div class="start">
            <Switch
              fallback={
                <button
                  class="start__button start__button--primary"
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
                  class="start__button start__button--primary"
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
                  class="start__button start__button--primary"
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
        <div class="reset">
          <For each={timers}>
            {(timer, idx) => (
              <button
                class={`reset__button ${timer.isSelected ? "reset__button--selected" : "reset__button--secondary"}`}
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
