import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';

const api = { url: 'http://localhost:4399' };

const request = {
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }
};

class ScoreCard extends React.Component {

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Player
              </td>
              <td colSpan='3'>
                1
              </td>
              <td colSpan='3'>
                2
              </td>
            </tr>
            <tr>
              <td rowSpan='2'>
                1
              </td>
              <td></td>
              <td>
                x
              </td>
              <td>
                y
              </td>
            </tr>
            <tr>
              <td colSpan='3'>
                1
              </td>
            </tr>
            <tr>
              <td rowSpan='2'>
                2
              </td>
              <td></td>
              <td>
                1
              </td>
              <td>
                1
              </td>
            </tr>
            <tr>
              <td colSpan='3'>
                1
              </td>
            </tr>
          </tbody>
        </table>
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
      game: {
        'player-1': {},
        'player-2': {},
        state: 'pending'  // 'pending' | 'wait' | 'ongoing' | 'complete'
      }
    };
  }

  start() {
    let game = {};
    fetch(`${api.url}/games`, request)
    .then(response => response.json())
    .then(json => {
      game['player-1'] = { id: json.game.id, frames: [], score: [] };
    })
    .then(() => fetch(`${api.url}/games`, request))
    .then(response => response.json())
    .then(json => {
      game['player-2'] = { id: json.game.id, frames: [], score: [] };
    })
    .then(() => {
      game.state = 'ongoing';
    })
    .then(() => {
      this.setState({ game });
    });
  }

  advance() {
    let { game } = this.state;
    let frames = [];
    if ('ongoing' == game.state) {
      fetch(`${api.url}/games/${game['player-1'].id}/frames`, request)
      .then(response => response.json())
      .then(json => {
        frames.push(json.frame)
      })
      .then(() => fetch(`${api.url}/games/${game['player-2'].id}/frames`, request))
      .then(response => response.json())
      .then(json => {
        frames.push(json.frame)
      })
      .then(() => {
        this.setState(update(this.state, {
          game: {
            'player-1': {
              frames: { $push: [frames[0]] }
            },
            'player-2': {
              frames: { $push: [frames[1]] }
            }
          }
        }));
      });
    }
  }

  render() {
    const { game } = this.state;
    return (
      <div>
        Hello
        <div>
          <button onClick={this.start}>
            Start a game
          </button>
        </div>
        <div>
          {JSON.stringify(this.state.game)}
        </div>
        <div>
          {'ongoing' == game.state && (
            <button onClick={this.advance}>
              Play next frame
            </button>
          )}
        </div>
        <div>
          <ScoreCard />
        </div>
      </div>
    );
  }

}

ReactDOM.render(
  <Game />,
  document.getElementById('app')
);
