import express from 'express';
import Game    from './game';

const app  = express();
const port = process.env.PORT || 4399;

/*
 * Create a new game
 */
app.post('/games', (req, res) => {
  const game = new Game();
  Game.store.save(game);
  res.json({
    game: {
      ...game,
      complete: false,
      score: [],
      currentTotal: 0
    }
  });
});

/*
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
  const score = game.score();
  res.json({
    game: {
      ...game,
      complete: game.isComplete(), score,
      currentTotal: score.length ? score[score.length - 1] : 0
    }
  });
});

/*
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
  if (game.isComplete()) {
    res.status(410).json({  // 410 = Resource is no longer available
      error: 'this game is already complete'
    });
  } else {
    const frame = game.insertFrame();
    const score = game.score();
    res.json({
      game: {
        ...game,
        complete: game.isComplete(), score,
        currentTotal: score[score.length - 1]
      },
      frame
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
