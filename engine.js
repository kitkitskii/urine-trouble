(function (root) {
  'use strict';
  const VERSION = 1;
  const GAME_IDS = ['quiz', 'words', 'match', 'flow', 'pictures', 'leak'];
  const CHOICE_TYPES = ['MULTIPLE CHOICE', 'TRUE OR FALSE', 'TWO TRUTHS, ONE LIE'];
  const QUESTION_TYPES = [...CHOICE_TYPES, 'IDENTIFICATION', 'JUMBLED LETTERS', '4 PICS, 1 WORD'];
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);
  const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const safeKey = key => typeof key === 'string' && key.length > 0 && key.length <= 180 && !['__proto__', 'prototype', 'constructor'].includes(key);
  const pointsValue = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(1000000, Math.round(Number(value)))) : 0;
  function normalize(value) {
    return String(value == null ? '' : value).normalize('NFKD').replace(/\p{M}/gu, '').toUpperCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
  }
  const compact = value => normalize(value).replace(/\s/g, '');
  const equivalent = (a, b) => compact(a).length > 0 && compact(a) === compact(b);
  const tileInventory = value => [...compact(value)].sort().join('');

  function checkAnswer(question, value) {
    if (!isObject(question)) return false;
    const options = Array.isArray(question.options) ? question.options : [];
    const index = Number.isInteger(question.correctIndex) ? question.correctIndex : question.correct_option_index;
    const canonical = text(question.answer) ? question.answer : options[index];
    if (typeof value === 'number') return Number.isInteger(value) && value >= 0 && value < options.length && value === index;
    if (typeof value === 'boolean') return question.type === 'TRUE OR FALSE' && equivalent(value ? 'TRUE' : 'FALSE', canonical);
    if (typeof value !== 'string' || !normalize(value)) return false;
    if (equivalent(value, canonical)) return true;
    if (question.type === 'TRUE OR FALSE') {
      return normalize(value) === 'T' && equivalent(canonical, 'TRUE') || normalize(value) === 'F' && equivalent(canonical, 'FALSE');
    }
    if (options.length) return Number.isInteger(index) && index >= 0 && index < options.length && normalize(value) === String.fromCharCode(65 + index);
    if (question.type === 'JUMBLED LETTERS') return false;
    return Array.isArray(question.aliases) && question.aliases.some(alias => equivalent(value, alias));
  }

  function blankRecord() {
    return { attempts: 0, submitted: false, solved: false, revealed: false, lastCorrect: null, firstTryCorrect: false, score: 0, points: 0, pointsLocked: false, awards: [] };
  }
  function record(session, key) {
    const source = isObject(session) && isObject(session.records) && safeKey(String(key)) && own(session.records, String(key)) ? session.records[String(key)] : null;
    return { ...blankRecord(), ...(isObject(source) ? source : {}), awards: isObject(source) && Array.isArray(source.awards) ? [...source.awards] : [] };
  }
  function names(values) {
    const source = Array.isArray(values) && values.length >= 2 ? values : ['Team 1', 'Team 2'];
    return source.slice(0, 4).map((value, index) => String(value == null ? '' : value).trim().slice(0, 40) || 'Team ' + (index + 1));
  }
  function createSession(config) {
    config = isObject(config) ? config : {};
    const mode = config.mode === 'classroom' ? 'classroom' : 'solo';
    return { version: VERSION, mode, teamNames: mode === 'classroom' ? names(config.teamNames) : [], projectId: typeof config.projectId === 'string' ? config.projectId.slice(0, 120) : '', records: {} };
  }
  const validSession = session => isObject(session) && session.version === VERSION && ['solo', 'classroom'].includes(session.mode) && isObject(session.records);
  const put = (session, key, value) => ({ ...session, records: { ...session.records, [key]: value } });
  function submit(session, key, correct, points) {
    key = String(key);
    if (!validSession(session) || session.mode !== 'solo' || !safeKey(key) || typeof correct !== 'boolean') return session;
    const previous = record(session, key);
    if (previous.solved || previous.revealed) return session;
    const value = previous.pointsLocked ? previous.points : pointsValue(points);
    const first = previous.attempts === 0 && correct;
    return put(session, key, { ...previous, attempts: previous.attempts + 1, submitted: true, solved: correct, lastCorrect: correct, firstTryCorrect: first, score: first ? value : 0, points: value, pointsLocked: true });
  }
  function reveal(session, key) {
    key = String(key);
    if (!validSession(session) || !safeKey(key)) return session;
    const previous = record(session, key);
    if (previous.revealed) return session;
    return put(session, key, { ...previous, revealed: true });
  }
  function award(session, key, teamIndex, awarded, points) {
    key = String(key);
    if (!validSession(session) || session.mode !== 'classroom' || !Array.isArray(session.teamNames) || !safeKey(key) || !Number.isInteger(teamIndex) || teamIndex < 0 || teamIndex >= session.teamNames.length) return session;
    const previous = record(session, key);
    if (!previous.revealed) return session;
    const set = new Set(previous.awards);
    if (awarded) set.add(teamIndex); else set.delete(teamIndex);
    const awards = [...set].sort((a, b) => a - b);
    if (awards.length === previous.awards.length && awards.every((value, i) => value === previous.awards[i])) return session;
    return put(session, key, { ...previous, awards, points: previous.pointsLocked ? previous.points : pointsValue(points), pointsLocked: true });
  }
  function summary(session) {
    const result = { score: 0, teamScores: (session && Array.isArray(session.teamNames) ? session.teamNames : []).map(name => ({ name, score: 0 })), attempted: 0, completed: 0, revealed: 0, firstTryCorrect: 0 };
    if (!validSession(session)) return result;
    for (const key of Object.keys(session.records)) {
      if (!safeKey(key)) continue;
      const item = record(session, key);
      if (item.submitted) result.attempted++;
      if (item.solved || item.revealed) result.completed++;
      if (item.revealed) result.revealed++;
      if (item.firstTryCorrect) result.firstTryCorrect++;
      if (session.mode === 'solo' && item.firstTryCorrect && item.solved && item.attempts === 1) result.score += pointsValue(item.points);
      if (session.mode === 'classroom' && item.revealed) for (const index of new Set(item.awards)) if (Number.isInteger(index) && result.teamScores[index]) result.teamScores[index].score += pointsValue(item.points);
    }
    return result;
  }
  function restoreSession(raw, projectId) {
    try {
      const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!validSession(value) || projectId != null && value.projectId !== projectId) return null;
      const session = createSession(value);
      for (const [key, source] of Object.entries(value.records)) {
        if (!safeKey(key) || !isObject(source)) continue;
        const item = blankRecord();
        item.attempts = session.mode === 'solo' && Number.isInteger(source.attempts) && source.attempts > 0 ? Math.min(source.attempts, 1000000) : 0;
        item.submitted = item.attempts > 0;
        item.solved = item.submitted && source.solved === true;
        item.revealed = source.revealed === true;
        item.lastCorrect = item.submitted && typeof source.lastCorrect === 'boolean' ? source.lastCorrect : null;
        item.firstTryCorrect = item.solved && item.attempts === 1 && source.firstTryCorrect === true;
        item.points = pointsValue(source.points);
        item.pointsLocked = source.pointsLocked === true || item.submitted;
        item.score = item.firstTryCorrect ? item.points : 0;
        item.awards = session.mode === 'classroom' && item.revealed && Array.isArray(source.awards) ? [...new Set(source.awards.filter(index => Number.isInteger(index) && index >= 0 && index < session.teamNames.length))].sort((a, b) => a - b) : [];
        if (item.awards.length) item.pointsLocked = true;
        session.records[key] = item;
      }
      return session;
    } catch (_) { return null; }
  }

  function shuffle(values, rng) {
    const output = Array.isArray(values) ? values.slice() : [];
    const random = typeof rng === 'function' ? rng : Math.random;
    for (let i = output.length - 1; i > 0; i--) {
      const raw = Number(random());
      const unit = Number.isFinite(raw) ? Math.max(0, Math.min(0.9999999999999999, raw)) : 0.5;
      const j = Math.floor(unit * (i + 1));
      [output[i], output[j]] = [output[j], output[i]];
    }
    return output;
  }
  function seeded(seed) {
    let value = 2166136261;
    for (const char of String(seed)) { value ^= char.codePointAt(0); value = Math.imul(value, 16777619); }
    return function () { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
  }
  function selectTile(selected, index, tiles) {
    const length = tiles && Number.isInteger(tiles.length) ? tiles.length : 0;
    const output = Array.isArray(selected) ? [...new Set(selected.filter(i => Number.isInteger(i) && i >= 0 && i < length))] : [];
    if (Number.isInteger(index) && index >= 0 && index < length && !output.includes(index)) output.push(index);
    return output;
  }
  const undoTile = selected => Array.isArray(selected) ? selected.slice(0, -1) : [];

  function validateProject(project) {
    const errors = [], warnings = [];
    const fail = (path, message) => errors.push(path + ': ' + message);
    const warn = (path, message) => warnings.push(path + ': ' + message);
    const requireText = (value, path, optional) => { if (!text(value)) (optional ? warn : fail)(path, 'Enter text.'); };
    const requirePoints = (value, path) => { if (!Number.isInteger(value) || value < 0 || value > 1000000) fail(path, 'Use a whole number from 0 to 1,000,000.'); };
    const ids = (items, path) => {
      const seen = new Set();
      items.forEach((item, index) => {
        if (!isObject(item)) { fail(path + '[' + index + ']', 'Enter a content object.'); return; }
        if (!safeKey(item.id) || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(item.id)) fail(path + '[' + index + '].id', 'Use a unique short ID made from letters, numbers, hyphens, or underscores.');
        else if (seen.has(item.id)) fail(path + '[' + index + '].id', 'This ID is duplicated.');
        seen.add(item.id);
      });
    };
    if (!isObject(project)) return { valid: false, errors: ['Project: Import a project object.'], warnings };
    if (project.version !== VERSION) fail('Project version', 'Use project version 1.');
    if (!isObject(project.site)) fail('Site', 'Enter the site settings.');
    else { for(const name of ['projectTeam','institution','adviser','academicYear'])if(project.site[name]!=null&&typeof project.site[name]!=='string')fail('Project credits','Use text for '+name+'.'); requireText(project.site.title, 'Site title'); requireText(project.site.tagline, 'Site tagline', true); requireText(project.site.intro, 'Site introduction', true); }
    if (!isObject(project.settings)) fail('Settings', 'Enter the game settings.');
    else {
      requirePoints(project.settings.defaultPoints, 'Default points');
      if (!Number.isInteger(project.settings.timerSeconds) || project.settings.timerSeconds < 0 || project.settings.timerSeconds > 3600) fail('Timer', 'Use 0 for no timer, or a whole number up to 3,600 seconds.');
    }
    const lists = {};
    for (const key of ['games', 'questions', 'matching', 'sequences', 'mistakes', 'articles']) {
      if (!Array.isArray(project[key])) { fail(key, 'Use a list of items.'); lists[key] = []; }
      else { lists[key] = project[key]; ids(lists[key], key); }
    }
    const knownGames = new Set();
    lists.games.forEach((game, i) => {
      if (!isObject(game)) return;
      const label = 'Game ' + (i + 1);
      if (!GAME_IDS.includes(game.id)) fail(label, 'Choose a supported game ID: ' + GAME_IDS.join(', ') + '.');
      knownGames.add(game.id);
      requireText(game.title, label + ' title'); requireText(game.subtitle, label + ' subtitle', true); requireText(game.instructions, label + ' instructions');
      if (typeof game.enabled !== 'boolean') fail(label, 'Enabled must be true or false.');
    });
    if (!lists.games.some(game => isObject(game) && game.enabled === true)) fail('Games', 'Enable at least one game.');
    lists.questions.forEach((question, i) => {
      if (!isObject(question)) return;
      const label = 'Question ' + (question.number || i + 1);
      requireText(question.prompt, label + ' prompt'); requireText(question.answer, label + ' answer'); requireText(question.explanation, label + ' explanation', true); requirePoints(question.points, label + ' points');
      if (!QUESTION_TYPES.includes(question.type)) fail(label + ' format', 'Choose one of the supported question formats.');
      if (!['EASY', 'MEDIUM', 'HARD'].includes(question.level)) fail(label + ' difficulty', 'Choose EASY, MEDIUM, or HARD.');
      if (!Array.isArray(question.options)) fail(label + ' options', 'Use a list of options.');
      else if (CHOICE_TYPES.includes(question.type)) {
        if (question.options.length < 2 || question.options.length > 8 || question.options.some(option => !text(option))) fail(label + ' options', 'Enter two to eight nonempty choices.');
        if (new Set(question.options.map(normalize)).size !== question.options.length) fail(label + ' options', 'Remove duplicate choices.');
        if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex >= question.options.length) fail(label + ' correct choice', 'Choose an answer from the option list.');
        else if (!equivalent(question.answer, question.options[question.correctIndex])) fail(label + ' answer', 'The answer must match the selected correct choice.');
        if (question.type === 'TRUE OR FALSE' && (question.options.length !== 2 || !question.options.some(option => normalize(option) === 'TRUE') || !question.options.some(option => normalize(option) === 'FALSE'))) fail(label + ' options', 'True/False needs one TRUE choice and one FALSE choice.');
      }
      if (!Array.isArray(question.aliases) || question.aliases.some(alias => !text(alias))) fail(label + ' accepted answers', 'Use a list of nonempty alternative answers, or an empty list.');
      if (question.type === 'JUMBLED LETTERS' && (!text(question.scramble) || tileInventory(question.scramble) !== tileInventory(question.answer))) fail(label + ' word tiles', 'The tiles must use exactly the same letters as the correct answer.');
      if (!Array.isArray(question.images)) fail(label + ' pictures', 'Use a list of images.');
      else {
        if (question.type === '4 PICS, 1 WORD' && question.images.length !== 4) fail(label + ' pictures', 'This format needs four picture clues.');
        question.images.forEach((image, n) => {
          if (typeof image !== 'string' || !/^data:image\/(?:png|jpeg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(image)) fail(label + ' picture ' + (n + 1), 'Upload an embedded PNG, JPEG, WebP, or GIF image so the website also works offline.');
        });
      }
      if (!Array.isArray(question.gameIds) || question.gameIds.some(id => !knownGames.has(id))) fail(label + ' games', 'Use only enabled or available game IDs from the game list.');
    });
    const matchTerms = new Set(), matchDefinitions = new Set();
    lists.matching.forEach((pair, i) => {
      if (!isObject(pair)) return;
      const label = 'Matching pair ' + (i + 1);
      requireText(pair.term, label + ' term'); requireText(pair.definition, label + ' definition'); requireText(pair.explanation, label + ' explanation', true); requirePoints(pair.points, label + ' points');
      if (matchTerms.has(normalize(pair.term))) fail(label, 'Use a different term so matching is unambiguous.');
      if (matchDefinitions.has(normalize(pair.definition))) fail(label, 'Use a different definition so matching is unambiguous.');
      matchTerms.add(normalize(pair.term)); matchDefinitions.add(normalize(pair.definition));
    });
    lists.sequences.forEach((item, i) => {
      if (!isObject(item)) return;
      const label = 'Sequence ' + (i + 1);
      requireText(item.title, label + ' title'); requireText(item.prompt, label + ' prompt'); requireText(item.explanation, label + ' explanation', true); requirePoints(item.points, label + ' points');
      if (!Array.isArray(item.steps) || item.steps.length < 2 || item.steps.some(step => !text(step))) fail(label + ' steps', 'Enter at least two steps in the correct order.');
      else if (new Set(item.steps.map(normalize)).size !== item.steps.length) fail(label + ' steps', 'Use distinct steps so the order can be identified.');
    });
    lists.mistakes.forEach((item, i) => {
      if (!isObject(item)) return;
      const label = 'Find-the-mistake item ' + (i + 1);
      requireText(item.title, label + ' title'); requireText(item.prompt, label + ' prompt'); requireText(item.explanation, label + ' explanation', true); requirePoints(item.points, label + ' points');
      if (!Array.isArray(item.steps) || item.steps.length < 2 || item.steps.some(step => !text(step))) fail(label + ' statements', 'Enter at least two nonempty statements.');
      if (!Number.isInteger(item.wrongIndex) || !Array.isArray(item.steps) || item.wrongIndex < 0 || item.wrongIndex >= item.steps.length) fail(label + ' incorrect statement', 'Select the incorrect statement.');
    });
    lists.articles.forEach((article, i) => {
      if (!isObject(article)) return;
      const label = 'Learning topic ' + (i + 1);
      requireText(article.title, label + ' title');
      if (!Array.isArray(article.body) || !article.body.length || article.body.some(paragraph => !text(paragraph))) fail(label + ' text', 'Enter at least one paragraph.');
    });
    const counts = { quiz: lists.questions.filter(q => isObject(q) && Array.isArray(q.gameIds) && q.gameIds.includes('quiz')).length, words: lists.questions.filter(q => isObject(q) && Array.isArray(q.gameIds) && q.gameIds.includes('words')).length, pictures: lists.questions.filter(q => isObject(q) && Array.isArray(q.gameIds) && q.gameIds.includes('pictures')).length, match: lists.matching.length, flow: lists.sequences.length, leak: lists.mistakes.length };
    for (const game of lists.games) if (isObject(game) && game.enabled && !counts[game.id]) warn(game.title || game.id, 'This game has no items yet.');
    return { valid: errors.length === 0, errors, warnings };
  }
  root.UTEngine = Object.freeze({ VERSION, GAME_IDS: Object.freeze(GAME_IDS.slice()), normalize, checkAnswer, validateProject, createSession, record, submit, reveal, award, summary, restoreSession, shuffle, seeded, selectTile, undoTile });
})(typeof window !== 'undefined' ? window : globalThis);
