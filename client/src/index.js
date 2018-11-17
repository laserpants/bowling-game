import React from 'react';
import ReactDOM from 'react-dom';

class Game extends React.Component {

  constructor() {
    super();
  }

  startGame() {
    console.log('start game');
    fetch('http://localhost:4399/games', {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
    });
  }

  render() {
    return (
      <div>
        Hello
        <button onClick={this.startGame}>
          Start a game
        </button>
      </div>
    );
  }

}

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
