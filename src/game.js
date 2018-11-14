import assert from 'assert';
import uniqid from 'uniqid';
import MemoryStore from './store/memory';
import random from './rand';

// http://www.tenpin.org.au/index.php?id=875

///
/// A frame consists of up to two deliveries. If you bowl a strike there is
/// only one delivery per frame. However, if you leave pins remaining after
/// the first ball, a frame consists of two deliveries. 
///
class Frame {

  constructor() {
    this.deliveries = [];
    const k = random(10);
    this.deliveries.push(k);
    if (10 != k) {
      this.deliveries.push(random(10 - k));
    }
  }

  isStrike() {
    return [10] == this.deliveries;
  }

  isSpare() {
    return (2 == this.deliveries.length) 
      && (10 == this.deliveries[0] + this.deliveries[1]);
  }

}

class Game {

  static store;

  constructor() {
    this.id = uniqid();
    this.frames = [];
    Game.store.save(this);
  }

  static find(id) {
    return Game.store.find(id);
  }

  insertFrame() {
    if (this.isComplete()) {
      return [];
    }
    const frame = this._generateFrame();
    this.frames.push(frame);
    return frame;
  }

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
