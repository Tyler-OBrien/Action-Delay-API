import { formatValue, rawValue } from './compare/scale';
export function formatDuration(ms: number | undefined | null): string {
    return formatValue(ms ?? null, 'ms');
}
export function durationParts(ms: number | undefined | null): string[] {
    const text = formatDuration(ms);
    return text === '—' ? ['—', ''] : text.split(' ');
}
export function rawDuration(ms: number | undefined | null): string {
    return rawValue(ms ?? null, 'ms');
}
/** Status has historically shown cron lateness above its once-a-minute interval. */
export function statusDuration(jobName: string, ms: number | undefined): string {
    return formatDuration(jobName === 'cron' && ms ? ms - 60_000 : ms);
}
