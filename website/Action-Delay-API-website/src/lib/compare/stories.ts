import type { Preset } from './presets';
export const STORIES = [
  { id: 'delivery', topic: 'assets', title: 'Static file delivery', question: 'How do static assets and global data reads compare?', presets: ['featured-static-delivery'] },
  { id: 'applications', topic: 'applications', title: 'Hosted applications', question: 'How do code responses compare from shared US probes?', presets: ['featured-hosted-applications'] },
  { id: 'websockets', topic: 'websockets', title: 'WebSocket lifetime', question: 'How long do reported connections last?', presets: ['ws-stability'] },
  { id: 'ci', topic: 'ci', title: 'CI runners', question: 'How do GitHub Actions, Blacksmith and Cloudflare environments compare?', presets: ['yabs-ci-runners'] },
];
export function resolveStories(presets: Preset[]) {
  return STORIES.map(s => ({ ...s, options: s.presets.flatMap(id => { const p = presets.find(p => p.id === id); return p ? [p] : []; }) })).filter(s => s.options.length);
}
export function initialPreset(presets: Preset[]) { return resolveStories(presets)[0]?.options[0] ?? presets[0] ?? null; }

export const TOPICS = [
  { id: 'compute', label: 'Edge code' }, { id: 'applications', label: 'Hosted applications' },
  { id: 'assets', label: 'Static delivery' }, { id: 'caching', label: 'Caching' }, { id: 'storage', label: 'Object storage' },
  { id: 'websockets', label: 'WebSockets' }, { id: 'ci', label: 'CI benchmarks' },
  { id: 'propagation', label: 'Propagation' }, { id: 'kv', label: 'KV & Durable Objects' },
  { id: 'sql', label: 'SQL databases' }, { id: 'ai', label: 'Workers AI' },
];
export function resolveTopics(presets: Preset[]) {
  return TOPICS.map(topic => ({ ...topic, options: presets.filter(p => p.topic === topic.id) })).filter(t => t.options.length);
}

export function storyIsActive(story: typeof STORIES[number], preset?: Preset) {
  return !!preset && story.presets.includes(preset.id);
}
