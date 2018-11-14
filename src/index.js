import express from 'express';
import Game    from './game';

const app  = express();
const port = process.env.PORT || 4399;

app.post('/game', (req, res) => {
  const game = new Game();
  res.json({ game });
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
  const frame = game.generateFrame();
  res.json({ game, frame });
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
  console.log(`Listening on port ${port}`);
});
