import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.getTimeRemaining = this.getTimeRemaining.bind(this);
    this.initializeClock = this.initializeClock.bind(this);
    this.stopClock = this.stopClock.bind(this);
    this.setDeadline = this.setDeadline.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.state = {
      deadline: new Date(),
      isPaused: true,
      minutes: "05",
      seconds: "00",
      total: 300000,
      timePermitted: "5 minutes",
      clickCount: 0
    };
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
      
        if (this.state.total <= 0) {
          clearInterval(timeinterval);
          this.setState(() => {
            return {
              minutes: ('00'),
              seconds: ('00')
            };
          });
          
        }
      } else if (this.state.isPaused) {
        clearInterval(timeinterval);
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

  startTimer() {
    if (this.state.clickCount < 1) {
      const addMinutes = (numOfMinutes, date = new Date()) => {
        date.setMinutes(date.getMinutes() + numOfMinutes);
        return date;
      }
      this.setState(() => {
        return {
          deadline: addMinutes(5)
        }
      })
    };
    setTimeout(() => {
        return this.initializeClock();
    }, 500);
  }

  stopTimer() {
    setTimeout(() => {
        return this.stopClock();
    }, 10);
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
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></link>
        <h1 className="bold">Pitch Please!</h1>
        <div className="border">
          <h1>{this.state.timePermitted}</h1>
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
          <p></p>
          <button onClick={() => 
            {
              this.setState(() => ({ isPaused: false }));
              this.startTimer();
              this.setState(() => ({ clickCount: this.state.clickCount + 1 }));
            }
            }>Start</button>
             <button onClick={() => 
              {
                this.setState(() => ({ isPaused: true }));
                this.stopTimer();
              }
              }>Stop</button>
        </div>
      </div>
    );
  }
}

export default App;
