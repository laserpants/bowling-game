export default class MemoryStore {

  constructor() {
    this.data = {};
  }

  save(game) {
    this.data[game.id] = game;
  }

  find(id) {
    return this.data[id];
  }

}
