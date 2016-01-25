import test from 'blue-tape';
import initDeis from '../src';

const deis = initDeis();

/* eslint-disable arrow-body-style */
test('GET /apps', (t) => {
  return deis.apps.list().then((apps) => {
    t.looseEqual(Object.keys(apps), [
      'count', 'next', 'previous', 'results',
    ]);
  });
});

test('methods', (t) => {
  t.looseEqual(Object.keys(deis), [
    'apps', 'clusters', 'keys', 'auth', 'admin',
  ]);
  t.end();
});
