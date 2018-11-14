import express from 'express';
import Game    from './game';

const app  = express();
const port = process.env.PORT || 4399;

app.post('/games', (req, res) => {
  const game = new Game();
  game.complete = false;
  res.json({ game });
});

app.get('/games/:id', (req, res) => {
  let game = Game.find(req.params['id']);
  if (!game) {
    res
      .status(404)
      .json({
        error: 'a game with that id does not exist'
      });
    return;
  }
  game.complete = game.isComplete();
  res.json({ game });
});

app.post('/games/:game_id/frames', (req, res) => {
  const game = Game.find(req.params['game_id']);
  if (!game) {
    res
      .status(404)
      .json({
        error: 'a game with that id does not exist'
      });
    return;
  }
  game.complete = game.isComplete();
  if (game.complete) {
    res.status(410).json();  // The resource is no longer available
  } else {
    const frame = game.insertFrame();
    res.json({ game, frame });
  }
});

//app.get('/games/:game_id/score', (req, res) => {
//  res.json({
//    stats: { error: 'not implemented' }
//  });
//});
//
//app.get('/games/:game_id/stats', (req, res) => {
//  res.json({
//    stats: { error: 'not implemented' }
//  });
//});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
