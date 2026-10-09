const M = require('./engine.js');
const E = require('./expected.json');
let n = 0, fail = 0;
const eq = (a, b, tag) => {
  n++;
  if (JSON.stringify(a) !== JSON.stringify(b)) { fail++; console.error('FAIL', tag, JSON.stringify(a), '!=', JSON.stringify(b)); }
};
for (const c of E.lines) { let r; try { r = M.lines(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'lines ' + c.in); }
for (const c of E.cut) { let r; try { r = M.cut(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'cut ' + c.in); }
for (const c of E.ink) { let r; try { r = M.ink(...c.in); } catch (e) { r = { error: e.message }; } eq(r, c.out, 'ink ' + c.in); }
// anchors
const ln = M.lines(250, 12, 2);
eq(ln.lines, 50, 'anchor lines'); eq(ln.usedMm, 246.94, 'anchor used');
eq(M.cut(450, 320, 85, 55).count, 25, 'anchor cut');
eq(M.ink(500, 50, 30).inkG, 3, 'anchor ink');
// invariant: used + left = depth
n++;
{ const q = M.lines(197, 11, 1.5); if (Math.abs(q.usedMm + q.leftMm - 197) > 0.02) { fail++; console.error('FAIL depth invariant'); } }
// errors
const errs = [
  () => M.lines(0, 12, 2), () => M.lines(250, 0, 2), () => M.lines(250, 12, -1), () => M.lines(3, 12, 2),
  () => M.cut(0, 320, 85, 55), () => M.cut(450, 320, 0, 55), () => M.cut(100, 100, 200, 200),
  () => M.ink(0, 50, 30), () => M.ink(500, 0, 30), () => M.ink(500, 50, 101),
];
const msgs = ['page depth must be positive','type size must be positive','leading cannot be negative','the pitch is taller than the page (labeled)',
  'sheet dimensions must be positive','card dimensions must be positive','the card is bigger than the sheet (labeled)',
  'at least one impression','printed area must be positive','coverage must be 0-100% (labeled)'];
errs.forEach((f, i) => {
  n++;
  try { f(); fail++; console.error('FAIL no-throw', i); }
  catch (e) { if (e.message !== msgs[i]) { fail++; console.error('FAIL msg', i, e.message, 'want', msgs[i]); } }
});
console.log(fail ? fail + ' FAILURES / ' + n : n + '/' + n + ' checks pass');
process.exit(fail ? 1 : 0);
