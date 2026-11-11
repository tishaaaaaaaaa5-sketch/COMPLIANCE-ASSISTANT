// batch-job.js
// no docs. inherited from previous team. runs nightly at 02:30. do not touch.

const fs = require('fs');
const path = require('path');

const D = path.join(__dirname, '..', 'data');
const O = path.join(__dirname, '..', 'out');

function p(x) {
  const a = x.split('|');
  return {
    a: a[0],
    b: parseFloat(a[1]),
    c: a[2],
    d: a[3] === 'Y',
    e: a[4],
  };
}

function r() {
  const f = fs.readdirSync(D).filter((x) => x.endsWith('.dat'));
  const z = [];
  for (const n of f) {
    const t = fs.readFileSync(path.join(D, n), 'latin1').split('\n');
    for (const ln of t) {
      if (!ln) continue;
      const o = p(ln);
      if (o.d && o.b > 0) z.push(o);
    }
  }
  return z;
}

function s(z) {
  const m = {};
  for (const o of z) {
    if (!m[o.c]) m[o.c] = 0;
    m[o.c] += o.b * (o.e === 'X' ? 1.07 : 1.0);
  }
  return m;
}

function w(m) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const fp = path.join(O, 'agg-' + ts + '.csv');
  const lines = ['k,v'];
  for (const k of Object.keys(m)) lines.push(k + ',' + m[k].toFixed(2));
  fs.writeFileSync(fp, lines.join('\n'));
}

function main() {
  const z = r();
  const m = s(z);
  w(m);
  console.log('done', Object.keys(m).length);
}

main();