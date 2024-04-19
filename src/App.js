import logo from './logo.svg';
import beepSound from './sounds/beep.mp3';
import gongSound from './sounds/gong.mp3';
import React, { Component } from 'react';
import './App.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.getTimeRemaining = this.getTimeRemaining.bind(this);
    this.loadSounds = this.loadSounds.bind(this);
    this.initializeClock = this.initializeClock.bind(this);
    this.stopClock = this.stopClock.bind(this);
    this.setDeadline = this.setDeadline.bind(this);
    this.addMinutes = this.addMinutes.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.state = {
      deadline: new Date(),
      isPaused: true,
      minutes: "05",
      seconds: "00",
      total: 300000,
      minutesInt: 5,
      timePermitted: "5 minutes",
      clickCount: 0,
      finished: false
    };
  }

  beep = new Audio(beepSound);
  gong = new Audio(gongSound);

  loadSounds() {
      this.beep.load();
      this.gong.load();
    }

  getTimeRemaining(endtime) {
    let t = Date.parse(endtime) - Date.parse(new Date());
    let seconds = Math.floor((t / 1000) % 60);
    let minutes = Math.floor((t / 1000 / 60) % 60);
    return {
      'total': t,
      'minutes': minutes,
      'seconds': seconds
    };
  }
    
  startTimer() {
    if (this.state.clickCount < 1) {
      this.loadSounds();
      this.setState(() => {
        return {
          deadline: this.addMinutes(this.state.minutesInt)
        }
      })
    };
    setTimeout(() => {
      return this.initializeClock();
    }, 200);
  }

  stopTimer() {
    setTimeout(() => {
      return this.stopClock();
    }, 10);
  }

  initializeClock() {
    const updateClock = () => {
      if (!this.state.isPaused) {
        let t = this.getTimeRemaining(this.state.deadline);
        
        this.setState(() => {
          return {
            minutes: ('0' + t.minutes).slice(-2),
            seconds: ('0' + t.seconds).slice(-2),
            total: t.total
          };
        });
        
        if (this.state.total < 12000) {
          this.beep.play();
          this.beep.currentTime = 0;
        }
          
        if (this.state.total < 2000) {
          clearInterval(timeinterval);
          this.setState(() => {
            return {
              minutes: ('00'),
              seconds: ('00')
            };
          });
          this.setState({ finished: true });
          this.gong.play();
          this.gong.currentTime = 0;
        }
      } else if (this.state.isPaused) {
        clearInterval(timeinterval);
        this.beep.pause();
        this.beep.currentTime = 0;
      }
    }
    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
  }
    
  stopClock() {
    const updateClock = () => {  
      if (this.state.isPaused) {
        this.setDeadline(1000);
      } else if (!this.state.isPaused) {
        clearInterval(timeinterval);
      }
    }
    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
  }
    
  addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
    return date;
  }
  
  setDeadline(millisecs) {
    this.setState((prevState) => {
      let new_deadline = new Date(Date.parse(prevState.deadline) + millisecs)
      return {
        deadline: new_deadline
      };
    });
  }
  
  render() {
    const isPaused = this.state.isPaused;
    const isFinished = this.state.finished;
    let button;
    if (isPaused || isFinished) {
      button = <button className="start-stop bold" disabled={isFinished} onClick={(e) => 
          {
            e.preventDefault();
            this.setState(() => ({ isPaused: false, clickCount: this.state.clickCount + 1 }));
            this.startTimer();
          }
          }>Start</button>
    } else {
      button = <button className="start-stop" disabled={isFinished} onClick={(e) => 
        {
          e.preventDefault();
          this.setState(() => ({ isPaused: true }));
          this.stopTimer();
        }
        }>Pause</button>
    };
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></link>
        <h1 className="bold">Pitch Please!</h1>
        <div className="border">
          <h2>{this.state.timePermitted}</h2>
          <img src={logo} className="App-logo" alt="logo" />
          <p></p>
          <div id="clockdiv">
            <div>
              <span className="minutes">{this.state.minutes}</span>
              <div className="smalltext">min</div>
            </div>
            <div>
              <span className="seconds">{this.state.seconds}</span>
              <div className="smalltext">sec</div>
            </div>
          </div>
          <div>
            <div className="start-stop-div">
              {button}
            </div>
            <div className="minutes-btn-div bold">
              <button onClick={(e) => {
                e.preventDefault();
                this.setState(() => ({
                  isPaused: true, minutes: "05", seconds: "00", total: 300000, minutesInt: 5,
                  timePermitted: "5 minutes", clickCount: 0, finished: false })
                );
              }}
              >5 minutes</button>
              <button onClick={(e) => {
                e.preventDefault();
                this.setState(() => ({
                  isPaused: true, minutes: "03", seconds: "00", total: 180000, minutesInt: 3,
                  timePermitted: "3 minutes", clickCount: 0, finished: false })
                );
              }}
              >3 minutes</button>
              <button onClick={(e) => {
                e.preventDefault();
                this.setState(() => ({
                  isPaused: true, minutes: "01", seconds: "00", total: 60000, minutesInt: 1,
                  timePermitted: "1 minute", clickCount: 0, finished: false })
                );
              }}
              >1 minute</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
