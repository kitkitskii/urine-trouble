(function (root) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cardsOf = round => round && Array.isArray(round.cards) ? round.cards : [];
  const categoriesOf = round => round && Array.isArray(round.categories) ? round.categories : [];
  const answersOf = state => state && Array.isArray(state.answers) ? state.answers : [];
  const labelOf = (round, id) => { const value = categoriesOf(round).find(category => category.id === id); return value ? value.label : ''; };

  function freshSort() { return { index: 0, answers: [], feedback: null, mistakes: 0 }; }

  function sortComplete(round, state) {
    const cards = cardsOf(round), answers = answersOf(state);
    return cards.length > 0 && answers.length === cards.length && answers.every((answer, index) => answer.cardId === cards[index].id && answer.correct === true && answer.selectedCategoryId === cards[index].categoryId && answer.correctCategoryId === cards[index].categoryId);
  }

  function sortPerfect(round, state) {
    return sortComplete(round, state) && !(Number(state && state.mistakes) > 0);
  }

  function chooseSort(round, state, categoryId) {
    const cards = cardsOf(round), answers = answersOf(state);
    if (!state || !Number.isInteger(state.index) || state.index < 0 || state.index >= cards.length || state.feedback || sortComplete(round, state)) return state;
    const category = categoriesOf(round).find(value => value.id === categoryId), card = cards[state.index];
    if (!category || answers.length !== state.index || !categoriesOf(round).some(value => value.id === card.categoryId)) return state;
    const answer = {
      cardId: card.id,
      selectedCategoryId: categoryId,
      correctCategoryId: card.categoryId,
      correct: categoryId === card.categoryId,
      explanation: String(card.explanation || '')
    };
    const mistakes = Number.isInteger(state.mistakes) && state.mistakes >= 0 ? state.mistakes : 0;
    return { ...state, index: state.index, answers: answers.concat(answer), feedback: { ...answer }, mistakes: mistakes + (answer.correct ? 0 : 1) };
  }

  function retrySort(round, state) {
    const cards = cardsOf(round), answers = answersOf(state), index = state && state.index;
    if (!state || !state.feedback || state.feedback.correct !== false || !Number.isInteger(index) || index < 0 || index >= cards.length || answers.length !== index + 1 || answers[index].cardId !== cards[index].id || answers[index].correct !== false || state.feedback.cardId !== cards[index].id) return state;
    const mistakes = Number.isInteger(state.mistakes) && state.mistakes > 0 ? state.mistakes : 1;
    return { ...state, index, answers: answers.slice(0, index).map(answer => ({ ...answer })), feedback: null, mistakes };
  }

  function advanceSort(round, state) {
    const cards = cardsOf(round);
    if (!state || !state.feedback || state.feedback.correct !== true || !Number.isInteger(state.index) || state.index < 0 || state.index >= cards.length) return state;
    return { ...state, index: Math.min(cards.length, state.index + 1), answers: answersOf(state).map(answer => ({ ...answer })), feedback: null };
  }

  function sortReviewMarkup(round, state) {
    const cards = cardsOf(round), categories = categoriesOf(round), answers = answersOf(state);
    if (!cards.length) return '<p class="empty">No sorting cards in this round.</p>';
    return '<ol class="sort-review">' + cards.map((card, index) => {
      const answer = answers.find(value => value.cardId === card.id), folderIndex = categories.findIndex(category => category.id === card.categoryId);
      return '<li class="sort-review-item ' + (answer ? answer.correct ? 'is-correct' : 'is-review' : '') + '"><div class="sort-review-top"><span class="sort-review-number">' + (index + 1) + '</span><strong>' + esc(card.text) + '</strong>' + (answer ? '<span class="sort-result ' + (answer.correct ? 'correct' : 'incorrect') + '">' + (answer.correct ? 'Correct' : 'Review') + '</span>' : '') + '</div>' + (answer && !answer.correct ? '<p class="sort-your-answer">Your category: ' + esc(labelOf(round, answer.selectedCategoryId)) + '</p>' : '') + '<p class="sort-correct-category">Correct category: <strong class="sort-review-folder folder-color-' + folderIndex + '"><span class="sort-folder-icon" aria-hidden="true"></span>' + esc(labelOf(round, card.categoryId)) + '</strong></p><p>' + esc(card.explanation) + '</p></li>';
    }).join('') + '</ol>';
  }

  function sortMarkup(round, state, options) {
    options = options || {};
    if (options.closed) return sortReviewMarkup(round, state);
    const cards = cardsOf(round), index = state && Number.isInteger(state.index) ? state.index : 0, card = cards[index];
    if (!card) return cards.length ? sortReviewMarkup(round, state) : '<p class="empty">No sorting cards in this round.</p>';
    const feedback = state && state.feedback, answers = answersOf(state), correct = answers.filter(answer => answer.correct).length;
    const trail = '<ol class="sort-trail" aria-label="Cards in this round">' + cards.map((_, position) => {
      const answer = answers[position], status = answer ? answer.correct ? 'is-complete' : 'is-review' : position === index ? 'is-current' : '';
      return '<li class="sort-trail-step ' + status + '" aria-label="Card ' + (position + 1) + ': ' + (answer ? answer.correct ? 'correct' : 'review' : position === index ? 'current' : 'not attempted') + '"><span aria-hidden="true">' + (answer && answer.correct ? '✓' : position + 1) + '</span></li>';
    }).join('') + '</ol>';
    const choices = categoriesOf(round).map((category, folderIndex) => {
      const selected = !!feedback && feedback.selectedCategoryId === category.id, isCorrect = !!feedback && feedback.correctCategoryId === category.id, isWrong = selected && !isCorrect;
      return '<button type="button" class="sort-category folder-color-' + folderIndex + (selected ? ' selected' : '') + (isCorrect ? ' is-correct' : '') + (isWrong ? ' is-wrong' : '') + '" data-action="sort-choice" data-category="' + esc(category.id) + '" aria-pressed="' + String(selected) + '"' + (feedback ? ' disabled' : '') + '><span class="sort-folder-icon" aria-hidden="true"></span><span class="sort-category-label">' + esc(category.label) + '</span>' + (isCorrect ? '<span class="sort-category-result" aria-hidden="true">✓</span>' : isWrong ? '<span class="sort-category-result" aria-hidden="true">↪</span>' : '') + '</button>';
    }).join('');
    const result = feedback ? '<section class="sort-feedback ' + (feedback.correct ? 'good' : 'wrong') + '" aria-live="polite"><div class="sort-feedback-head"><span class="sort-feedback-icon" aria-hidden="true">' + (feedback.correct ? '✓' : '↪') + '</span><h3>' + (feedback.correct ? 'Correct category.' : 'Correct category: ' + esc(labelOf(round, feedback.correctCategoryId))) + '</h3></div>' + (feedback.correct ? '<p class="sort-category-badge">Filed under ' + esc(labelOf(round, feedback.correctCategoryId)) + '</p>' : '<p>You chose <strong>' + esc(labelOf(round, feedback.selectedCategoryId)) + '</strong>.</p>') + '<p>' + esc(feedback.explanation) + '</p></section>' : '';
    return '<div class="sort-game"><div class="sort-progress"><span>Card ' + (index + 1) + ' / ' + cards.length + '</span><span>' + correct + ' correct</span></div>' + trail + '<div class="sort-card-stack"><span class="sort-paper-sheet" aria-hidden="true"></span><div class="sort-card' + (feedback ? ' is-filed ' + (feedback.correct ? 'is-correct' : 'is-review') : '') + '"><span class="sort-document-mark" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span><span class="sort-card-label">FILE THIS UNDER…</span><p>' + esc(card.text) + '</p></div></div><div class="sort-categories" role="group" aria-label="Choose the category">' + choices + '</div>' + result + '</div>';
  }

  root.UTActivities = { freshSort, chooseSort, retrySort, advanceSort, sortComplete, sortPerfect, sortMarkup, sortReviewMarkup };
})(typeof window !== 'undefined' ? window : globalThis);
