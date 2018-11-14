import express from 'express'; 

const app  = express();
const port = process.env.PORT || 4399;

app.get('/start', (req, res) => {
  res.json({
    game: {
      id: 1
    }
  });
});

app.get('/roll/:game_id', (req, res) => {
  const id = req.params['game_id'];
  res.json({
    game: {
      id: id
    }
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
