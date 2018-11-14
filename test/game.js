import assert from 'assert';
import Game from '../src/game';

describe('Game', () => {

  describe('isComplete', () => {

    it('should return false for a new game', () => {
      var game = new Game();
      assert(!game.isComplete());
    });

    it('should return true after 10 calls to insertFrame()', () => {
      var game = new Game();
      for (let i = 0; i < 10; i++)
        game.insertFrame();
      assert(game.isComplete());
    });

  });

});
