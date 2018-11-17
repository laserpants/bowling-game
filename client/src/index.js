import React    from 'react';
import ReactDOM from 'react-dom';

const api = { url: process.env.API_URL || 'http://localhost:4399' };

const request = {
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }
};

const wait = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));

class Frame extends React.Component {

  render() {
    return (
      <div style={{ display: 'flex', width: '66px', height: '60px', border: '1px solid red' }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '1px solid black'
        }}>
        </div>
        <div style={{
          width: '20px',
          height: '20px',
          border: '1px solid black'
        }}>
        </div>
        <div style={{
          width: '20px',
          height: '20px',
          border: '1px solid black'
        }}>
        </div>
      </div>
    );
  }

}

class Game extends React.Component {

  constructor() {
    super();
    this.start = this.start.bind(this);
    this.advance = this.advance.bind(this);
    this.state = {
      players: [],
      framesPlayed: 0,
      status: 'pending'  // 'pending' | 'wait' | 'ongoing' | 'complete'
    };
  }

  start() {
    this.setState({ status: 'wait' });
    let players = [];
    fetch(`${api.url}/games`, request)
    .then(response => response.json())
    .then(json => {
      players.push(json.game);
    })
    .then(() => fetch(`${api.url}/games`, request))
    .then(response => response.json())
    .then(json => {
      players.push(json.game);
    })
    .then(() => wait(250))
    .then(() => {
      this.setState({ players, status: 'ongoing' });
    });
  }

  advance() {
    this.setState({ status: 'wait' });
    const { players, status, framesPlayed } = this.state;
    let nextPlayers = [], nextFramesPlayed = 1 + framesPlayed;
    if ('ongoing' == status) {
      fetch(`${api.url}/games/${players[0].id}/frames`, request)
      .then(response => response.json())
      .then(json => {
        nextPlayers.push(json.game);
      })
      .then(() => fetch(`${api.url}/games/${players[1].id}/frames`, request))
      .then(response => response.json())
      .then(json => {
        nextPlayers.push(json.game);
      })
      .then(() => wait(250))
      .then(() => {
        this.setState({ 
          players: nextPlayers,
          framesPlayed: nextFramesPlayed,
          status: 10 == nextFramesPlayed ? 'complete' : 'ongoing'
        });
      });
    }
  }

  render() {
    const { status } = this.state;
    if ('wait' == status) {
      return (
        <div>
          Please wait...
        </div>
      );
    }
    return (
      <div>
        <div>
          {('pending' == status || 'complete' == status) && (
            <button onClick={this.start}>
              {'Start a new game'}
            </button>
          )}
        </div>
        <div>
          {('complete' == status || 'ongoing' == status) && (
            <div style={{ display: 'flex' }}>
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
              <Frame />
            </div>
          )}
        </div>
        <div>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
        <div>
          {'ongoing' == status && (
            <button onClick={this.advance}>
              {'Play next frame'}
            </button>
          )}
        </div>
      </div>
    );
  }

}

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
