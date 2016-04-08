const request = require('supertest');

describe('Server', () => {
  let server;

  before(() => {
    server = require('./server');
  });

  it('responds to /', (done) => {
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('responds to music api', (done) => {
    request(server)
      .get('/api/music')
      .expect(200, done);
  });
});
