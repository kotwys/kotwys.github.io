const { createHash } = require('crypto');
const path = require('path');
const Database = require('sqlite-async');

const DB_PATH = path.join(__dirname, '../words.db');

function hash({ word, definition }) {
  const hash = createHash('md5');
  return hash.update(word + ':' + definition, 'utf-8').digest('base64');
}

const initTable = (db, name) => db.run(`
  CREATE TABLE IF NOT EXISTS ${name} (
    hash TEXT PRIMARY KEY NOT NULL,
    word TEXT NOT NULL,
    definition TEXT NOT NULL
  );
`);

async function pushWord({ word, definition }) {
  const db = await Database.open(DB_PATH);
  await initTable(db, 'words');
  await db.run(
    'INSERT INTO words (hash, word, definition) VALUES (?, ?, ?)',
    [hash({ word, definition }), word, definition],
  );
};

async function toJSON() {
  const db = await Database.open(DB_PATH, Database.OPEN_READONLY);
  const list = [];
  await db.each('SELECT hash, word, definition FROM words', (err, row) => {
    list.push({
      hash: row.hash,
      word: row.word,
      def: row.definition,
    });
  });
  return JSON.stringify(list);
};

async function find(word) {
  const db = await Database.open(DB_PATH, Database.OPEN_READONLY);
  const row = await db.get('SELECT hash FROM words WHERE word = ?', [word]);
  return row?.hash;
}

module.exports = {
  DB_PATH,
  pushWord,
  toJSON,
  find,
};