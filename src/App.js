import React from 'react';
import './App.css';
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = { 
      flashCard: "",
      actualCardValue: "",
      hits: 0,
      previousHits: 0,
      hitsCanChange: true,
      miss: -1,
      levels: [5000, 2000, 1200, 700],
      selectedLevel: 1200,
      currentClick: "",

      hitsToWin: 5,
      missesToLose: 5,

      done: "Start Game",
      start: false
    };
    this.state = this.initialState;

    this.gameHandler = this.gameHandler.bind(this);
    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);
    this.generateCard = this.generateCard.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  startGame() {
    document.addEventListener('mousedown', this.gameHandler)
    document.addEventListener('contextmenu', event => {
      event.preventDefault();
    })
    this.interval = setInterval(() => {
      this.generateCard()
    }, this.state.selectedLevel);

    this.setState({
      ...this.initialState,
      done: this.state.done,
      start: true
    })
  }

  gameHandler(event) {
    let currentClick;
      let hits = this.state.hits, previousHits = !this.state.hitsCanChange ? this.state.previousHits : this.state.hits;
      if(event.button === 0) currentClick = "left";
      if(event.button === 2) currentClick = "right";
      if(currentClick === this.state.actualCardValue && this.state.hitsCanChange) {
        ++hits;   
      } else {
        currentClick = this.state.currentClick;
      }
      this.setState(state => ({
        currentClick,
        hits,
        previousHits,
        hitsCanChange: false,
        done: hits === this.state.hitsToWin ? "You WON!! Restart Game" : null,
        start: false
      }), () => {
        console.log("this.state.actualCardValue " + this.state.actualCardValue);
        console.log();
        console.log("this.state.currentClick " + this.state.currentClick);
        console.log("*******************");
      });
  }

  stopGame() {
    console.log("Stop Game called")
    document.removeEventListener('mousedown', this.gameHandler);
    clearInterval(this.interval);
  }

  generateCard() {
    const cards = ["left", "right"];
    const randomNum = Math.floor(Math.random()*100);
    let flashCard = "";
    if(randomNum < 50)
      flashCard = cards[0];
    else 
      flashCard = cards[1];

    this.setState(state => ({
      flashCard: "flash",
      hitsCanChange: false,
      miss: state.previousHits === state.hits ? state.miss + 1 : state.miss,
      done: state.miss + 1 === state.missesToLose ? "Try Again :) Restart Game" : null,
      start: false
    }));

    setTimeout(() => {
      this.setState(state => ({
        flashCard: flashCard,
        hitsCanChange: true,
        previousHits: state.hits,
        actualCardValue: flashCard
      }));
    }, 200)
  }
  render() {
    if(this.state.done !== null && this.state.start === false) {
      this.stopGame();
    }
    return (
      <div>
        <div>
          <div className={"rightText"}>
              Hits To Win : {this.state.hitsToWin}
          </div>
          <div className={"rightText"}>
              Misses To Lose : {this.state.hitsToWin}
          </div>
        </div>
        {this.state.done !== null 
        ? 
        <button className={"done-button"} onClick = {this.startGame}>
          {this.state.done}
        </button>
        : 
        <div className = {"game-pane"}>
            <div>
              Card: {this.state.flashCard}
            </div>

            <div>
              Hits: {this.state.hits}
            </div>

            <div>
              Miss: {this.state.miss === -1 ? 0 : this.state.miss}
            </div>

            <div>
              Levels: {JSON.stringify(this.state.levels)}
            </div>

            <div>
              Selected Level: {this.state.selectedLevel}
            </div>

            <div>
              Current Click: {this.state.currentClick}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Game;