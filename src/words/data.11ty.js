const db = require('../../utils/wordbase');

class Words {
  data() {
    return {
      permalink: '/words.json',
    };
  }

  async render() {
    return await db.toJSON();
  }
}

module.exports = Words;