const replace = require('replace-in-file');
const sp = require('synchronized-promise');
const db = require('./wordbase');

const operations = {
  async push(word, definition) {
    await db.pushWord({ word, definition });
  },
  async json() {
    console.log(await db.toJSON());
  },
  async prepare(...files) {
    await replace({
      files,
      from: /{#\s*?word\s*?#}(.*?){#\s*?\/word\s*?#}([^\s]*)/g,
      to: sp(async (_, base, declension) => {
        const hash = await db.find(base);
        if (!hash)
          return base + declension;

        return `{% word "${hash}", "${base + declension}" %}`;
      }),
    });
  },
};

if (process.argv.length < 3) {
  console.log('Not enough arguments.');
  process.exit(1);
}

operations[process.argv[2]](...process.argv.slice(3))
  .catch(({ message }) => {
    console.log(`Error: ${message}`);
    process.exit(2);
  });