import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';

class App extends Component {

  constructor(props) {
    super(props);
    this.getTimeRemaining = this.getTimeRemaining.bind(this);
    this.initializeClock = this.initializeClock.bind(this);
    this.state = {
      deadline: new Date(Date.parse(new Date()) + 300000),
      minutes: "",
      seconds: "",
      timePermitted: "5 minutes"
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
  
  initializeClock(endtime) {
    const updateClock = () => {
    let t = this.getTimeRemaining(endtime);
  
    this.setState(() => {
      return {
        minutes: ('0' + t.minutes).slice(-2),
        seconds: ('0' + t.seconds).slice(-2)
      };
    });
  
      if (t.total <= 0) {
        clearInterval(timeinterval);
      }
    }
  
    updateClock();
    let timeinterval = setInterval(updateClock, 1000);
  }

  render() {
    return (
      <div className="App">
        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"></link>
        <h1 className="bold">Pitch Please!</h1>
        <div className="border">
          {this.initializeClock(this.state.deadline)}
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
        </div>
      </div>
    );
  }
}

export default App;
