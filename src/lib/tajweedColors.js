// Tajweed rule color map
export const tajweedColors = {
  h: '#AAAAAA',              // Hamzat Wasl (silent)
  s: '#AAAAAA',              // Silent
  l: '#AAAAAA',              // Laam Shamsiyah (silent)
  n: '#537FFF',              // Madda Normal (2 counts)
  p: '#4050FF',              // Madda Permissible
  m: '#000EBC',              // Madda Necessary (6 counts)
  q: '#DD0008',              // Qalqalah
  o: '#DD0008',              // Qalqalah (alt code)
  f: '#9400A8',              // Ikhfa
  w: '#9400A8',              // Ikhfa Shafawi
  a: '#169200',              // Idgham with Ghunnah
  u: '#169200',              // Idgham without Ghunnah
  i: '#169200',              // Iqlab (some APIs)
  b: '#26BFFD',              // Iqlab
  g: '#FF7E1E',              // Ghunnah
  c: '#000000',              // Custom (default)
};

// Rule name map (for tooltip)
export const tajweedRuleNames = {
  h: 'Hamzat Wasl (silent)',
  s: 'Silent',
  l: 'Laam Shamsiyah (silent)',
  n: 'Madda Normal',
  p: 'Madda Permissible',
  m: 'Madda Necessary',
  q: 'Qalqalah',
  o: 'Qalqalah',
  f: 'Ikhfa',
  w: 'Ikhfa Shafawi',
  a: 'Idgham with Ghunnah',
  u: 'Idgham without Ghunnah',
  i: 'Iqlab',
  b: 'Iqlab',
  g: 'Ghunnah',
  c: 'Custom',
};

export const tajweedLegend = [
  { rule: 'Madda', color: '#537FFF', desc: 'Vowel prolongation' },
  { rule: 'Qalqalah', color: '#DD0008', desc: 'Echoing sound' },
  { rule: 'Ikhfa', color: '#9400A8', desc: 'Hidden nasalization' },
  { rule: 'Idgham', color: '#169200', desc: 'Merging' },
  { rule: 'Iqlab', color: '#26BFFD', desc: 'Conversion to Meem' },
  { rule: 'Ghunnah', color: '#FF7E1E', desc: 'Nasalization' },
  { rule: 'Silent', color: '#AAAAAA', desc: 'Not pronounced' },
];

/**
 * ═══════════════════════════════════════════════════════════════
 * Parse Al-Quran Cloud Tajweed Text
 * ═══════════════════════════════════════════════════════════════
 *
 * Input format:
 *   "[h:9421[ٱ]للَّهِ [l[ٱ]لرَّحْمَٰنِ [l[ٱ]لرَّحِيمِ"
 *
 * Output:
 *   HTML with <span style="color:X"> for colored parts,
 *   plain text for the rest.
 * ═══════════════════════════════════════════════════════════════
 */
export function parseTajweed(text) {
  if (!text || typeof text !== 'string') return '';

  // Regex to match: [rule_code_with_optional_colon_number[content]
  // Examples: [h:9421[ٱ]  [l[ٱ]  [n[َا]  [q[بْ]
  const regex = /\[([a-z])(?::[0-9]+)?\[([^\]]*)\]/g;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      result += escapeHtml(text.substring(lastIndex, match.index));
    }

    const ruleCode = match[1].toLowerCase();
    const content = match[2];
    const color = tajweedColors[ruleCode];
    const ruleName = tajweedRuleNames[ruleCode] || ruleCode;

    if (color) {
      result += `<span class="tajweed-${ruleCode}" style="color:${color}" title="${ruleName}">${escapeHtml(content)}</span>`;
    } else {
      result += escapeHtml(content);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result += escapeHtml(text.substring(lastIndex));
  }

  return result;
}

/**
 * Remove all tajweed markup — get plain Arabic text
 */
export function stripTajweed(text) {
  if (!text) return '';
  return text.replace(/\[[a-z](?::[0-9]+)?\[([^\]]*)\]/g, '$1');
}

/**
 * HTML escape
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
