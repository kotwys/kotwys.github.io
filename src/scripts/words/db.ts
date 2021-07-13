import Dexie, { Table } from 'dexie';

type Caches = {
  store: string,
  lastUpdated: number,
};

export type Word = {
  hash: string,
  word: string,
  def: string,
};

class Wordbase extends Dexie {
  words: Table<Word, string>;

  constructor() {
    super('kotwys-github-io');
    this.version(1).stores({
      words: 'hash',
      caches: 'store',
    });

    this.words = this.table('words');
  }

  async update() {
    const caches: Table<Caches, string> = this.table('caches');
    const { lastUpdated = 0 } = await caches.get('words') ?? {};
    const modified = await fetch('/words.modified')
      .then(res => res.text())
      .then(parseInt);
    
    if (modified > lastUpdated) {
      const data: Word[] = await fetch('/words.json').then(res => res.json());
      await Promise.all(data.map(async (word) => {
        const entry = await this.words.get(word.hash);
        if (!entry) {
          await this.words.add(word);
        }
      }));

      caches.put({
        store: 'words',
        lastUpdated: modified,
      });
    }
  }
};

export default async function() {
  const db = new Wordbase();
  await db.update();
  if (!await db.words.toCollection().first()) {
    throw 'No words retrieved.';
  }
  return db;
};