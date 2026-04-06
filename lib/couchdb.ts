import nano from 'nano';

const url = process.env.COUCHDB_URL || 'http://admin:password123@127.0.0.1:5984';
const dbClient = nano(url);

export default dbClient;