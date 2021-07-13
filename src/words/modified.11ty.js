const { stat } = require('fs');
const { DB_PATH } = require('../../utils/wordbase');

class Changed {
  data() {
    return {
      permalink: '/words.modified',
    };
  }

  render() {
    return new Promise((resolve, reject) => {
      stat(DB_PATH, (err, stats) => {
        if (err != null)
          reject(err);

        resolve(stats.mtimeMs.toFixed(0).toString());
      });
    });
  }
}

module.exports = Changed;