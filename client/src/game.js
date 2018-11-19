import React from 'react';

const api = { url: process.env.API_URL || 'http://localhost:4399' };

console.log(api);

const request = {
  method: 'POST',
  mode: 'cors',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  }
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Box = ({ symbol }) =>
  <div className='flexbox flex-center score-card-box'>
    {0 == symbol ? '-' : (10 == symbol ? 'X' : symbol)}
  </div>

const Frame = ({ score, deliveries, isLast }) => {

  if (!deliveries) {
    return <React.Fragment />;
  }

  const boxes = () => {
    if (isLast) {
      if (10 == deliveries[0] && 10 == deliveries[1]) {
        // last frame: two strikes in a row
        return (
          <React.Fragment>
            <Box symbol='X' />
            <Box symbol='X' />
            <Box symbol={deliveries[2]} />
          </React.Fragment>
        );
      } else if (10 == deliveries[0] && 10 == deliveries[1] + deliveries[2]) {
        // last frame: a strike followed by a spare
        return (
          <React.Fragment>
            <Box symbol='X' />
            <Box symbol={deliveries[1]} />
            <Box symbol='/' />
          </React.Fragment>
        );
      } else if (10 != deliveries[0] && 10 == deliveries[0] + deliveries[1]) {
        // last frame: a spare followed by anything
        return (
          <React.Fragment>
            <Box symbol={deliveries[0]} />
            <Box symbol='/' />
            <Box symbol={deliveries[2]} />
          </React.Fragment>
        );
      } else {
        // last frame: anything else
        return (
          <React.Fragment>
            {deliveries.map((symbol, i) => 
              <Box key={i} symbol={symbol} />
            )}
          </React.Fragment>
        );
      }
    } else {
      if (1 == deliveries.length) {
        // normal frame: strike
        return (
          <React.Fragment>
            <Box />
            <Box symbol='X' />
          </React.Fragment>
        );
      } else {
        // normal frame: anything except a strike
        const spare = 10 == deliveries[0] + deliveries[1];
        return (
          <React.Fragment>
            <Box />
            <Box symbol={deliveries[0]} />
            <Box symbol={spare ? '/' : deliveries[1]} />
          </React.Fragment>
        );
      }
    }
  };

  return (
    <div className='flexbox flex-column score-card-section'>
      <div className='flexbox score-card-boxes'>
        {boxes()}
      </div>
      <div className='flexbox flex-center score-card-score'>
        {score || '?'}
      </div>
    </div>
  );

}

const Row = ({ score, frames, player }) => {

  let row = [];
  row.push(
    <div key='player' className='flexbox flex-center flex-column score-card-section'>
      {player}
    </div>
  );
  for (let i = 0; i < 10; i++) {
    row.push(<Frame isLast={9 == i} key={i} score={score[i]} deliveries={frames[i]} />);
  }
  return (
    <div className='flexbox'>{row}</div>
  );

}

class Game extends React.Component {

  constructor() {
    super();
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
    .then(() => wait(150))
    .then(() => {
      this.setState({ players, framesPlayed: 0, status: 'ongoing' });
    });
  }

  advance() {
    const { players, status, framesPlayed } = this.state;
    let nextPlayers = [], nextFramesPlayed = 1 + framesPlayed;
    if ('ongoing' == status) {
      this.setState({ status: 'wait' });
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
      .then(() => wait(150))
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
    const { status, players, framesPlayed } = this.state;
    let titles = [];
    for (let i = 0; i < 11; i++) {
      titles.push(
        <div key={i} className='flexbox flex-center flex-column score-card-title'>
          {0 == i ? 'Spelare' : i}
        </div>
      );
    }
    return (
      <div className='game'>
        <div className='flexbox flex-left-center flex-column score-card-container'>
          {'wait' == status && (
            <div className='flexbox flex-center please-wait'>
              {'Var god dröj...'}
            </div>
          )}
          {('complete' == status || 'ongoing' == status) && (
            <div className='score-card'>
              <div className='flexbox'>
                {titles}
              </div>
              {players.map((player, i) =>
                <Row 
                  key    = {i}
                  player = {`#${i + 1}`}
                  frames = {player.frames}
                  score  = {player.score} 
                />
              )}
            </div>
          )}
        </div>
        <div className='flexbox flex-center play-button-container'>
          {('wait' == status || 'ongoing' == status) && (
            <button disabled={'wait' == status} onClick={::this.advance}>
              {`Spela nästa uppställning (${framesPlayed + 1}/10)`}
            </button>
          )}
          {('pending' == status || 'complete' == status) && (
            <button onClick={::this.start}>
              {'Starta en ny spelomgång'}
            </button>
          )}
        </div>
      </div>
    );
  }

}

export default Game;
