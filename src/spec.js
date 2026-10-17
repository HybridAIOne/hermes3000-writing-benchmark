'use strict';
/**
 * Loads a benchmark version and computes its fingerprint: sha256 over every file in
 * benchmark/<version>/, sorted by path. A run records the fingerprint, so a result can
 * always be traced to the exact tasks, keys and rules that produced it.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');

function listFiles(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? listFiles(path.join(dir, e.name)) : [path.join(dir, e.name)]))
    .sort();
}

function fingerprint(dir) {
  const h = crypto.createHash('sha256');
  for (const f of listFiles(dir)) {
    h.update(path.relative(dir, f));
    h.update('\0');
    h.update(fs.readFileSync(f));
  }
  return h.digest('hex').slice(0, 16);
}

/** Fill {{placeholders}} in a task prompt from the task's own fields. */
function renderPrompt(task) {
  return task.prompt.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (task[k] === undefined) throw new Error(`task ${task.id}: missing field "${k}" for prompt`);
    return String(task[k]).trim();
  });
}

function loadTasks(dir) {
  if (!dir || !fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => yaml.load(fs.readFileSync(path.join(dir, f), 'utf8')));
}

/**
 * @param {string} version - e.g. "v1"
 * @param {object} [opts] - { privateDir } held-out tasks, same schema, never committed
 */
function loadBenchmark(version, opts = {}) {
  const dir = path.join(ROOT, 'benchmark', version);
  const spec = yaml.load(fs.readFileSync(path.join(dir, 'spec.yaml'), 'utf8'));
  const { models } = yaml.load(fs.readFileSync(path.join(dir, 'models.yaml'), 'utf8'));
  const tasks = loadTasks(path.join(dir, 'tasks')).map((t) => ({ ...t, visibility: 'public' }));
  const privateTasks = loadTasks(opts.privateDir).map((t) => ({ ...t, visibility: 'private' }));
  const all = [...tasks, ...privateTasks];
  const ids = new Set();
  for (const t of all) {
    if (ids.has(t.id)) throw new Error(`duplicate task id ${t.id}`);
    ids.add(t.id);
    if (!spec.tracks[t.track]) throw new Error(`task ${t.id}: unknown track ${t.track}`);
  }
  return {
    version,
    dir,
    spec,
    models,
    tasks: all,
    fingerprint: fingerprint(dir),
    privateFingerprint: opts.privateDir && fs.existsSync(opts.privateDir) ? fingerprint(opts.privateDir) : null,
  };
}

module.exports = { loadBenchmark, renderPrompt, fingerprint, ROOT };
