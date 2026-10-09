// Letterpress math: type depth, sheet cutting and ink - exact arithmetic, labeled craft norms.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Letterpressmath = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  const round = x => Math.round(x * 100) / 100;
  const PT_TO_MM = 25.4 / 72;

  function leadBand(leadingPt) {
    if (leadingPt <= 0) return 'solid set - dense and dark (labeled)';
    if (leadingPt <= 2) return 'the classic +2 (labeled)';
    return 'airy - the page breathes (labeled)';
  }
  function wasteBand(pct) {
    if (pct < 10) return 'a tidy cut (labeled)';
    if (pct < 25) return 'acceptable offcuts (labeled)';
    return 'half the sheet is confetti (labeled)';
  }
  function inkBand(g) {
    if (g < 1) return 'a whisper of ink (labeled)';
    if (g < 10) return 'a thimble (labeled)';
    if (g < 100) return 'a spoonful (labeled)';
    return 'open the tin (labeled)';
  }

  // lines that fit a page depth at a type size + leading (leading is extra points added to the body)
  function lines(depthMm, sizePt, leadingPt) {
    if (!(depthMm > 0)) throw new Error('page depth must be positive');
    if (!(sizePt > 0)) throw new Error('type size must be positive');
    if (!(leadingPt >= 0)) throw new Error('leading cannot be negative');
    const pitchMm = (sizePt + leadingPt) * PT_TO_MM;
    if (pitchMm > depthMm) throw new Error('the pitch is taller than the page (labeled)');
    const count = Math.floor(depthMm / pitchMm + 1e-9);
    const usedMm = round(count * pitchMm);
    return { lines: count, usedMm, leftMm: round(depthMm - usedMm), verdict: leadBand(leadingPt) };
  }

  // cards per parent sheet, best of both orientations
  function cut(sheetW, sheetH, cardW, cardH) {
    if (!(sheetW > 0 && sheetH > 0)) throw new Error('sheet dimensions must be positive');
    if (!(cardW > 0 && cardH > 0)) throw new Error('card dimensions must be positive');
    const n1 = Math.floor(sheetW / cardW) * Math.floor(sheetH / cardH);
    const n2 = Math.floor(sheetW / cardH) * Math.floor(sheetH / cardW);
    const count = Math.max(n1, n2);
    if (count === 0) throw new Error('the card is bigger than the sheet (labeled)');
    const wastePct = round(100 * (sheetW * sheetH - count * cardW * cardH) / (sheetW * sheetH));
    return { count, wastePct, verdict: wasteBand(wastePct) };
  }

  // ink grams from impressions, printed area and coverage (labeled: 0.4 g per 1000 full-coverage cm2-impressions)
  function ink(impressions, areaCm2, coveragePct) {
    if (!(impressions >= 1)) throw new Error('at least one impression');
    if (!(areaCm2 > 0)) throw new Error('printed area must be positive');
    if (!(coveragePct > 0 && coveragePct <= 100)) throw new Error('coverage must be 0-100% (labeled)');
    const inkG = round(impressions * areaCm2 * coveragePct / 100 * 0.0004);
    return { inkG, verdict: inkBand(inkG) };
  }

  return { lines, cut, ink, leadBand, wasteBand, inkBand };
});
