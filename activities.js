(function (root) {
  'use strict';
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cardsOf = round => round && Array.isArray(round.cards) ? round.cards : [];
  const categoriesOf = round => round && Array.isArray(round.categories) ? round.categories : [];
  const answersOf = state => state && Array.isArray(state.answers) ? state.answers : [];
  const labelOf = (round, id) => { const value = categoriesOf(round).find(category => category.id === id); return value ? value.label : ''; };

  function freshSort() { return { index: 0, answers: [], feedback: null }; }

  function sortComplete(round, state) {
    const cards = cardsOf(round), answers = answersOf(state);
    return cards.length > 0 && answers.length === cards.length && answers.every((answer, index) => answer.cardId === cards[index].id);
  }

  function sortPerfect(round, state) {
    return sortComplete(round, state) && answersOf(state).every(answer => answer.correct === true);
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
    return { index: state.index, answers: answers.concat(answer), feedback: { ...answer } };
  }

  function advanceSort(round, state) {
    const cards = cardsOf(round);
    if (!state || !state.feedback || !Number.isInteger(state.index) || state.index < 0 || state.index >= cards.length) return state;
    return { index: Math.min(cards.length, state.index + 1), answers: answersOf(state).map(answer => ({ ...answer })), feedback: null };
  }

  function sortReviewMarkup(round, state) {
    const cards = cardsOf(round), answers = answersOf(state);
    if (!cards.length) return '<p class="empty">No sorting cards in this round.</p>';
    return '<ol class="sort-review">' + cards.map((card, index) => {
      const answer = answers.find(value => value.cardId === card.id);
      return '<li class="sort-review-item"><div class="sort-review-top"><span class="sort-review-number">' + (index + 1) + '</span><strong>' + esc(card.text) + '</strong>' + (answer ? '<span class="sort-result ' + (answer.correct ? 'correct' : 'incorrect') + '">' + (answer.correct ? 'Correct' : 'Review') + '</span>' : '') + '</div>' + (answer && !answer.correct ? '<p class="sort-your-answer">Your category: ' + esc(labelOf(round, answer.selectedCategoryId)) + '</p>' : '') + '<p class="sort-correct-category">Correct category: <strong>' + esc(labelOf(round, card.categoryId)) + '</strong></p><p>' + esc(card.explanation) + '</p></li>';
    }).join('') + '</ol>';
  }

  function sortMarkup(round, state, options) {
    options = options || {};
    if (options.closed) return sortReviewMarkup(round, state);
    const cards = cardsOf(round), index = state && Number.isInteger(state.index) ? state.index : 0, card = cards[index];
    if (!card) return cards.length ? sortReviewMarkup(round, state) : '<p class="empty">No sorting cards in this round.</p>';
    const feedback = state && state.feedback, correct = answersOf(state).filter(answer => answer.correct).length;
    return '<div class="sort-game"><div class="sort-progress"><span>Card ' + (index + 1) + ' / ' + cards.length + '</span><span>' + correct + ' correct</span></div><div class="sort-card"><span class="sort-card-label">FILE THIS UNDER…</span><p>' + esc(card.text) + '</p></div><div class="sort-categories" role="group" aria-label="Choose the category">' + categoriesOf(round).map(category => '<button type="button" class="sort-category ' + (feedback && feedback.selectedCategoryId === category.id ? 'selected' : '') + '" data-action="sort-choice" data-category="' + esc(category.id) + '" aria-pressed="' + String(!!feedback && feedback.selectedCategoryId === category.id) + '"' + (feedback ? ' disabled' : '') + '>' + esc(category.label) + '</button>').join('') + '</div>' + (feedback ? '<section class="sort-feedback ' + (feedback.correct ? 'good' : 'wrong') + '" aria-live="polite"><h3>' + (feedback.correct ? 'Correct category.' : 'Correct category: ' + esc(labelOf(round, feedback.correctCategoryId))) + '</h3>' + (!feedback.correct ? '<p>You chose <strong>' + esc(labelOf(round, feedback.selectedCategoryId)) + '</strong>.</p>' : '') + '<p>' + esc(feedback.explanation) + '</p></section>' : '') + '</div>';
  }

  root.UTActivities = { freshSort, chooseSort, advanceSort, sortComplete, sortPerfect, sortMarkup, sortReviewMarkup };
})(typeof window !== 'undefined' ? window : globalThis);
