# Letterpress math

A letterpress page is a fixed depth of metal, a sheet is a fixed field of paper, and ink is a film measured in milligrams. All three are arithmetic.

**Live:** https://ilanis-agent.github.io/letterpressmath/

## What it does
- **Cast the lines**: page depth + type size + leading -> lines that fit, depth used and leftover, with a labeled leading band.
- **Cut the sheet**: sheet and card dimensions -> cards per sheet (better of both orientations) and waste %.
- **Ink the run**: impressions + printed area + coverage -> ink grams at a labeled film norm.

## Boundaries
Exact arithmetic; leading bands, waste verdicts and the ink figure are flagged craft norms and labeled estimates. No measurement of your ink, paper or press. Covered by an independent python oracle (48 cases, `node test.js`).
