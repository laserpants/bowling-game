import uniqid from 'uniqid';

class Game {

  static store;

  constructor() {
    this.id = uniqid();
    Game.store.save(this);
  }

  static find(id) {
    return Game.store.find(id);
  }

}

export default Game;
