import assert from 'assert';
import uniqid from 'uniqid';
import MemoryStore from './store/memory';

// http://www.tenpin.org.au/index.php?id=875

class Game {

  static store;

  constructor() {
    this.id = uniqid();
    Game.store.save(this);
  }

  static find(id) {
    return Game.store.find(id);
  }

  ///
  /// A frame consists of up to two deliveries. If you bowl a strike there is
  /// only one delivery per frame. However, if you leave pins remaining after
  /// the first ball, a frame consists of two deliveries. The tenth frame
  /// consists of up to three deliveries if you should either bowl a strike on
  /// your first delivery or make a spare.
  ///
  generateFrame() {
    var isLast = false;
    if (isLast)
    {
      return []; // todo
    }
    else
    {
      const k = Math.floor(Math.random()*11);
      assert(k <= 10);

      if (10 == k)
          return [k];  // strike!

      const j = Math.floor(Math.random()*(11 - k));
      assert(j <= 10 - k);

      return [k, j];
    }
  }

}

Game.store = new MemoryStore();

export default Game;
