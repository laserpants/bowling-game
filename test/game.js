import assert from 'assert';
import Game from '../src/game';

function arrayEq(xs, ys) {
  if (xs.length != ys.length)
    return false;
  for (let i = 0; i < xs.length; i++)
    if (xs[i] != ys[i])
      return false;
  return true;
}

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

  describe('score', () => {

    it('card #1', () => {
      let g = new Game();
      g.frames = [[10], [7, 3], [9, 0], [10], [0, 8], [8, 2], [0, 6], [10], [10], [10, 8, 1]];
      assert(arrayEq(g.score(), [20, 39, 48, 66, 74, 84, 90, 120, 148, 167 ]));
    });

    it('card #2', () => {
      let g = new Game();
      g.frames = [[10], [10], [10], [10], [10], [10], [10], [10], [10], [10, 10, 10]];
      assert(arrayEq(g.score(), [ 30, 60, 90, 120, 150, 180, 210, 240, 270, 300 ]));
    });

    it('card #3', () => {
      let g = new Game();
      g.frames = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
      assert(arrayEq(g.score(), [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]));
    });

    it('card #4', () => {
      let g = new Game();
      g.frames = [[9, 1], [0, 10], [10], [10], [6, 2], [7, 3], [8, 2], [10], [9, 0], [10, 10, 8]];
      assert(arrayEq(g.score(), [10, 30, 56, 74, 82, 100, 120, 139, 148, 176]));
    });

    it('card #5 (assert false)', () => {
      let g = new Game();
      g.frames = [[9, 1], [0, 10], [10], [10], [6, 2], [7, 3], [8, 2], [10], [9, 0], [10, 10, 8]];
      assert(!arrayEq(g.score(), [10, 30, 56, 74, 92, 100, 120, 139, 148, 176]));
    });

    it('card #6 (assert false)', () => {
      let g = new Game();
      g.frames = [[9, 1], [0, 10], [10], [10], [6, 2], [7, 3], [8, 2], [10], [9, 0], [10, 10, 8]];
      assert(!arrayEq(g.score(), []));
    });

    it('card #7', () => {
      let g = new Game();
      g.frames = [[10], [10], [10], [1, 4]];
      assert(!arrayEq(g.score(), [ 30, 55, 70 ]));
    });

    it('card #8', () => {
      let g = new Game();
      g.frames = [[3, 7], [6, 2]];
      assert(arrayEq(g.score(), [ 16, 24 ]));
    });
    
    it('card #9', () => {
      let g = new Game();
      g.frames = [[3, 7], [6, 2], [5, 5], [6, 1], [8, 1], [7, 0], [4, 6], [5, 4], [10], [2, 1]];
      assert(arrayEq(g.score(), [ 16, 24, 40, 47, 56, 63, 78, 87, 100, 103 ]));
    });

    it('card #10', () => {
      let g = new Game();
      g.frames = [[3, 7], [6, 2], [5, 5], [6, 1], [8, 1], [7, 0], [4, 6], [5, 4], [10], [10, 9, 1]];
      assert(arrayEq(g.score(), [ 16, 24, 40, 47, 56, 63, 78, 87, 116, 136 ]));
    });

    it('card #11', () => {
      let g = new Game();
      g.frames = [[3, 7], [6, 2], [5, 5], [6, 1], [8, 1], [7, 0], [4, 6], [5, 4], [10], [10, 10, 3]];
      assert(arrayEq(g.score(), [ 16, 24, 40, 47, 56, 63, 78, 87, 117, 140 ]));
    });

  });

});
