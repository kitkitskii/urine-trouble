(function (root) {
  'use strict';

  const ITERATIONS = 600000;
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const copy = config => config && {
    version: 1,
    algorithm: 'PBKDF2-SHA-256',
    iterations: config.iterations,
    salt: config.salt,
    hash: config.hash
  };
  const valid = config => Boolean(config && typeof config === 'object' && !Array.isArray(config) &&
    own(config, 'version') && config.version === 1 &&
    own(config, 'algorithm') && config.algorithm === 'PBKDF2-SHA-256' &&
    own(config, 'iterations') && config.iterations === ITERATIONS &&
    own(config, 'salt') && typeof config.salt === 'string' && /^[0-9a-f]{32}$/.test(config.salt) &&
    own(config, 'hash') && typeof config.hash === 'string' && /^[0-9a-f]{64}$/.test(config.hash));
  const published = valid(root.UT_EDITOR_ACCESS_CONFIG) ? copy(root.UT_EDITOR_ACCESS_CONFIG) : null;
  const publishedFingerprint = published ? JSON.stringify(published) : '';
  const projectId = typeof root.URINE_DEFAULT_CONTENT?.id === 'string' && root.URINE_DEFAULT_CONTENT.id ?
    root.URINE_DEFAULT_CONTENT.id : 'urine-trouble-arcade-v1';
  const storageKey = projectId + ':editor-password';
  let config = copy(published);
  let unlocked = false;
  let generation = 0;

  // A saved password change is local to this browser, and never saves an unlocked session.
  // A new published verifier invalidates an older browser-specific password change.
  if (published) {
    try {
      const raw = root.localStorage?.getItem(storageKey);
      const saved = typeof raw === 'string' && raw.length <= 4096 ? JSON.parse(raw) : null;
      if (saved && saved.publishedFingerprint === publishedFingerprint && valid(saved.config)) config = copy(saved.config);
    } catch (_) { /* The published password still works when browser storage is unavailable. */ }
  }

  function supported() {
    return Boolean(config && root.isSecureContext !== false &&
      typeof root.crypto?.subtle?.importKey === 'function' &&
      typeof root.crypto?.subtle?.deriveBits === 'function' &&
      typeof root.crypto?.getRandomValues === 'function' &&
      typeof root.TextEncoder === 'function');
  }

  function getConfig() { return copy(config); }
  function isUnlocked() { return unlocked && supported(); }
  function lock() { unlocked = false; generation += 1; }
  const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  const unhex = value => Uint8Array.from(value.match(/../g), byte => parseInt(byte, 16));
  function sameHash(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    let difference = 0;
    for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return difference === 0;
  }

  async function derive(password, settings) {
    const bytes = new root.TextEncoder().encode(password);
    let key;
    try { key = await root.crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveBits']); }
    finally { bytes.fill(0); }
    const result = await root.crypto.subtle.deriveBits({
      name: 'PBKDF2', hash: 'SHA-256', salt: unhex(settings.salt), iterations: settings.iterations
    }, key, 256);
    return hex(new Uint8Array(result));
  }

  async function unlock(password) {
    lock();
    if (!supported() || typeof password !== 'string' || password.length === 0 || password.length > 128) return false;
    const attempt = generation, expected = copy(config);
    try {
      const result = await derive(password, expected);
      if (generation !== attempt) return false;
      unlocked = sameHash(result, expected.hash);
      return unlocked;
    } catch (_) { return false; }
  }

  async function changePassword(currentPassword, newPassword) {
    if (!supported()) throw new Error('Password verification is unavailable. Open this website in a supported browser.');
    if (!isUnlocked()) throw new Error('Unlock Edit Content before changing the password.');
    if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128) {
      throw new Error('Use a new password with 12 to 128 characters.');
    }
    if (typeof currentPassword !== 'string' || currentPassword.length === 0 || currentPassword.length > 128) {
      throw new Error('The current password is incorrect.');
    }
    const attempt = generation, expected = copy(config);
    let verified;
    try { verified = sameHash(await derive(currentPassword, expected), expected.hash); }
    catch (_) { throw new Error('The password could not be checked. Please try again.'); }
    if (generation !== attempt || !isUnlocked()) throw new Error('The editor was locked. Unlock it and try again.');
    if (!verified) throw new Error('The current password is incorrect.');
    const next = {version: 1, algorithm: 'PBKDF2-SHA-256', iterations: ITERATIONS, salt: '', hash: ''};
    try {
      next.salt = hex(root.crypto.getRandomValues(new Uint8Array(16)));
      next.hash = await derive(newPassword, next);
    } catch (_) { throw new Error('The new password could not be saved. Please try again.'); }
    if (generation !== attempt || !isUnlocked()) throw new Error('The editor was locked. Unlock it and try again.');
    config = copy(next);
    generation += 1;
    let persisted = false;
    try {
      if (root.localStorage && typeof root.localStorage.setItem === 'function') {
        root.localStorage.setItem(storageKey, JSON.stringify({publishedFingerprint, config: copy(config)}));
        persisted = true;
      }
    } catch (_) { /* Exporting can retain this password even when local storage cannot. */ }
    return {persisted};
  }

  root.UTInstructorAccess = Object.freeze({supported, isUnlocked, getConfig, unlock, lock, changePassword});
})(typeof window !== 'undefined' ? window : globalThis);
