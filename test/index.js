import test from 'blue-tape';
import initDeis from '../src';

const opts = process.env.DEIS_CONTROLLER ? {
  controller: process.env.DEIS_CONTROLLER,
  token: process.env.DEIS_TOKEN,
} : null;

const deis = initDeis(opts);

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
