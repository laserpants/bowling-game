import express from 'express';
import Game    from './game';

const app  = express();
const port = process.env.PORT || 4399;

/**
 * Create a new game
 */
app.post('/games', (req, res) => {
  const game = new Game();
  game.complete = false;
  res.json({ game });
});

/**
 * View an existing game
 */
app.get('/games/:id', (req, res) => {
  let game = Game.find(req.params['id']);
  if (!game) {
    res
      .status(404)
      .json({ error: 'a game with that id does not exist' });
    return;
  }
  game.complete = game.isComplete();
  res.json({ game });
});

/**
 * Advance an ongoing game by inserting a new frame
 */
app.post('/games/:id/frames', (req, res) => {
  const game = Game.find(req.params['id']);
  if (!game) {
    res
      .status(404)
      .json({ error: 'a game with that id does not exist' });
    return;
  }
  game.complete = game.isComplete();
  if (game.complete) {
    res.status(410).json();  // 410 = The resource is no longer available
  } else {
    const frame = game.insertFrame();
    res.json({ game, frame });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
