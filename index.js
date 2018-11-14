import express from 'express';
import uniqid  from 'uniqid';
import assert  from 'assert';

const app  = express();
const port = process.env.PORT || 4399;

class MemoryStore {

  constructor() {
    this.data = {};
  }

  save(game) {
    this.data[game.id] = game;
  }

  find(id) {
    return this.data[id];
  }

}

//class SqliteStore {
//}

class Game {

  static store;

  constructor() {
    this.id = uniqid();
  }

  save() {
    Game.store.save(this);
  }

  static find(id) {
    return Game.store.find(id);
  }

}

// http://www.tenpin.org.au/index.php?id=875

// A frame consists of up to two deliveries. If you bowl a strike there is only 
// one delivery per frame. However, if you leave pins remaining after the first 
// ball, a frame consists of two deliveries. The tenth frame consists of up to 
// three deliveries if you should either bowl a strike on your first delivery 
// or make a spare. 
//
function frame(isLast = false) {
  if (isLast)
  {
  }
  else
  {
    const k = Math.floor(Math.random()*11);
    assert(k <= 10);

    if (10 == k)
        return [k];

    const j = Math.floor(Math.random()*(11 - k));
    assert(j <= 10 - k);

    return [k, j];
  }
}

app.post('/game', (req, res) => {
  let game = new Game();
  game.save();
  res.json({
    game: { id: game.id }
  });
});

app.post('/frame/:game_id', (req, res) => {
  const id = req.params['game_id'];
  const game = Game.find(id);
  if (!game) {
    res
      .status(404)
      .json({
        error: 'a game with that id does not exist'
      });
    return;
  }
  res.json({
    game: { id }
  });
});

app.get('/score/:game_id', (req, res) => {
  res.json({
    stats: { error: 'not implemented' }
  });
});

app.get('/stats/:game_id', (req, res) => {
  res.json({
    stats: { error: 'not implemented' }
  });
});

app.listen(port, () => {
  Game.store = new MemoryStore();
  console.log(`Listening on port ${port}`);
});
