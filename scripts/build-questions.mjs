import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = fs.readFileSync(path.join(__dirname, 'source.txt'), 'utf8');

const lines = src
  .split('\n')
  .map((l) => l.trimEnd())
  .filter((l) => !/^-- \d+ of \d+ --$/.test(l.trim()));

let i = 0;
let chapterTitle = '';
const questions = [];
let id = 0;

function skipEmpty() {
  while (i < lines.length && lines[i].trim() === '') i++;
}

while (i < lines.length) {
  const line = lines[i].trim();
  if (line.startsWith('Fakta-ark ')) {
    chapterTitle = line.replace(/^Fakta-ark \d+:\s*/, '').trim();
    i++;
    continue;
  }
  if (/^Spørgsmål \d+$/.test(line)) {
    i++;
    skipEmpty();
    const qParts = [];
    while (i < lines.length && !/^A\)\s/.test(lines[i].trim())) {
      const l = lines[i].trim();
      if (l && !/^Fakta-ark /.test(l) && !/^Spørgsmål \d+$/.test(l)) {
        qParts.push(l);
      }
      i++;
    }
    const questionText = qParts.join(' ').trim();
    const options = { A: '', B: '', C: '', D: '' };
    for (const letter of ['A', 'B', 'C', 'D']) {
      const re = new RegExp(`^${letter}\\)\\s*(.*)$`);
      if (i >= lines.length) throw new Error(`Missing option ${letter} after: ${questionText.slice(0, 40)}`);
      const m = lines[i].trim().match(re);
      if (!m) throw new Error(`Expected ${letter}) at line ${i}: ${lines[i]}`);
      let opt = m[1] || '';
      i++;
      while (
        i < lines.length &&
        !/^[A-D]\)\s/.test(lines[i].trim()) &&
        !/^Svar:\s*[A-D]/.test(lines[i].trim())
      ) {
        const t = lines[i].trim();
        if (t) opt += (opt ? ' ' : '') + t;
        i++;
      }
      options[letter] = opt.trim();
    }
    if (i >= lines.length || !/^Svar:\s*([A-D])\s*$/.test(lines[i].trim())) {
      throw new Error(`Missing Svar after options near: ${questionText.slice(0, 50)} at ${i}`);
    }
    const correct = lines[i].trim().match(/^Svar:\s*([A-D])\s*$/)[1];
    i++;
    skipEmpty();
    let explanation = '';
    if (i < lines.length && lines[i].trim().startsWith('Forklaring:')) {
      explanation = lines[i].trim().replace(/^Forklaring:\s*/, '');
      i++;
      while (i < lines.length) {
        const t = lines[i].trim();
        if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) break;
        if (/^[A-D]\)\s/.test(t)) break;
        if (/^Svar:\s*[A-D]/.test(t)) break;
        if (t) explanation += (explanation ? ' ' : '') + t;
        i++;
      }
    } else {
      while (i < lines.length && !lines[i].trim().startsWith('Forklaring:')) {
        const t = lines[i].trim();
        if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) {
          throw new Error(`Missing Forklaring for: ${questionText.slice(0, 40)}`);
        }
        i++;
      }
      if (i < lines.length && lines[i].trim().startsWith('Forklaring:')) {
        explanation = lines[i].trim().replace(/^Forklaring:\s*/, '');
        i++;
        while (i < lines.length) {
          const t = lines[i].trim();
          if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) break;
          if (/^[A-D]\)\s/.test(t)) break;
          if (/^Svar:\s*[A-D]/.test(t)) break;
          if (t) explanation += (explanation ? ' ' : '') + t;
          i++;
        }
      }
    }
    id++;
    questions.push({
      id,
      chapter: chapterTitle,
      question: questionText,
      options: [
        { key: 'A', text: options.A },
        { key: 'B', text: options.B },
        { key: 'C', text: options.C },
        { key: 'D', text: options.D },
      ],
      correctKey: correct,
      explanation: explanation.trim(),
    });
    continue;
  }
  i++;
}

fs.writeFileSync(
  path.join(__dirname, '../src/data/questions.json'),
  JSON.stringify(questions, null, 2) + '\n',
  'utf8'
);
console.log('Parsed', questions.length, 'questions');
if (questions.length !== 196) {
  console.warn('Expected 196 questions');
}
