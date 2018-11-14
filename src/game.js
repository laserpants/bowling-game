import assert from 'assert';
import uniqid from 'uniqid';
import MemoryStore from './store/memory';
import random from './rand';

///
/// A frame consists of up to two deliveries. If you bowl a strike there is
/// only one delivery in that frame. However, if you have pins remaining after
/// the first ball, a frame consists of two deliveries. 
///
class Frame {

  ///
  /// Create and populate a frame with random values
  ///
  constructor() {
    this.deliveries = [];
    const k = random(10);
    this.deliveries.push(k);
    if (10 != k) {
      this.deliveries.push(random(10 - k));
    }
  }

  ///
  /// \returns true if the frame is a strike, or false otherwise
  ///
  isStrike() {
    return 1 == this.deliveries.length;
  }

  ///
  /// \returns true if the frame is a spare, or false otherwise
  ///
  isSpare() {
    if (2 != this.deliveries.length)
      return false;
    return 10 == (this.deliveries[0] + this.deliveries[1]);
  }

}

///
/// A game consists of ten frames. A maximum of two deliveries is made in each 
/// frame except in the last frame, in which three deliveries are made if the 
/// player has scored a strike or a spare.
///
class Game {

  static store;

  ///
  /// Create a new game
  ///
  constructor() {
    this.id = uniqid();
    this.frames = [];
    Game.store.save(this);
  }

  ///
  /// Static method to lookup an existing game by its ID.
  ///
  /// \params id the ID of the game to lookup
  ///
  /// \returns a Game object, or null if a game with the given ID does not exist
  ///
  static find(id) {
    return Game.store.find(id);
  }

  ///
  /// Advance an ongoing game by generating and inserting a new frame.
  ///
  /// \returns a new frame, or the empty list if the game is already complete
  ///
  insertFrame() {
    if (this.isComplete()) {
      return [];
    }
    const frame = this._generateFrame();
    this.frames.push(frame);
    return frame;
  }

  ///
  /// \returns a boolean denoting whether the game is completed or not
  ///
  isComplete() {
    return 10 == this.frames.length;
  }

  _generateFrame() {
    const frame = new Frame();
    if (9 == this.frames.length) {
      // In the last frame, three deliveries are made if the player has scored 
      // a strike or a spare in that frame. 
      if (frame.isStrike()) {
        const bonusFrame = new Frame();
        return frame.deliveries.concat(bonusFrame.deliveries);
      } else if (frame.isSpare()) {
        return frame.deliveries.concat(random(10));
      }
    }
    return frame.deliveries;
  }

}

Game.store = new MemoryStore();

export default Game;
