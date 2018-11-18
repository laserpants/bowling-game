import assert from 'assert';
import uniqid from 'uniqid';
import MemoryStore from './store/memory';
import random from './rand';

/**
 * A frame consists of up to two deliveries. If you bowl a strike there is
 * only one delivery in that frame. However, if you have pins remaining after
 * the first ball, then the frame consists of two deliveries.
 */
class Frame {

  /**
   * Create and populate a frame with random values
   *
   * @constructor
   */
  constructor() {
    this.deliveries = [];
    const k = random(10);
    this.deliveries.push(k);
    if (10 != k) {
      this.deliveries.push(random(10 - k));
    }
  }

  /**
   * @returns {boolean} true if the frame is a strike, or false otherwise
   */
  isStrike() {
    return 1 == this.deliveries.length;
  }

  /**
   * @returns {boolean} true if the frame is a spare, or false otherwise
   */
  isSpare() {
    if (2 != this.deliveries.length)
      return false;
    return 10 == (this.deliveries[0] + this.deliveries[1]);
  }

}

/**
 * A game consists of ten frames. A maximum of two deliveries is made in each
 * frame except in the last frame, in which three deliveries are made if the
 * player has scored a strike or a spare.
 */
class Game {

  static store;

  /**
   * Create a new game
   *
   * @constructor
   */
  constructor() {
    this.id = uniqid();
    this.frames = [];
  }

  /**
   * Static method to lookup an existing game by its ID.
   *
   * @param {string} id the ID of the game to search for
   *
   * @returns {Game} a Game object, or null if a game with the given ID does
   *                 not exist
   */
  static find(id) {
    return Game.store.find(id);
  }

  /**
   * Advance an ongoing game by generating and inserting a new frame.
   *
   * @returns {Array} a new frame, or the empty array if the game is already
   *                  complete
   */
  insertFrame() {
    if (this.isComplete()) {
      return [];
    }
    const frame = this._generateFrame();
    this.frames.push(frame);
    return frame;
  }

  /**
   * @returns {boolean} a boolean denoting whether the game is completed or not
   */
  isComplete() {
    return 10 == this.frames.length;
  }

  /**
   * Generate a score sheet for this game in the form of an array of the points
   * accumulated after each completed frame. In the case that the last frame is
   * a strike or spare, the number of entries in this array may be less than
   * the number of played frames.
   *
   * @returns {Array} a score sheet for this game
   */
  score() {
    let score = [], i = 0,
        rolls = [].concat.apply([], this.frames);
    while (score.length < 10 && i < rolls.length - 1) {
      const strike = 10 == rolls[i];
      const spare  = !strike && 10 == rolls[i] + rolls[i + 1];
      if ((strike || spare) && i >= rolls.length - 2)
        break;
      if (strike || spare) {
        score.push(rolls[i] + rolls[i + 1] + rolls[i + 2]);
      } else {
        score.push(rolls[i] + rolls[i + 1]);
      }
      i += strike ? 1 : 2;
    }
    let acc = 0;
    return score.map(s => { acc += s; return acc; });
  }

  _generateFrame() {
    const frame = new Frame();
    if (9 == this.frames.length) {
      // In the last frame, three deliveries are made if the player has scored
      // a strike or a spare in that frame.
      if (frame.isStrike()) {
        const bonusFrame = new Frame();
        return frame.deliveries.concat(
          bonusFrame.isStrike() ? [10, random(10)] : bonusFrame.deliveries
        );
      } else if (frame.isSpare()) {
        return frame.deliveries.concat(random(10));
      }
    }
    return frame.deliveries;
  }

}

Game.store = new MemoryStore();

export default Game;
