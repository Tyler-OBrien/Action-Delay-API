/** Owner-supplied configuration, distinct from observations inside a runner. */
export interface BenchmarkSource {
  configuration: string;
  cadenceMinutes: number;
  capacity?: string;
  observation?: string;
}
export const BENCHMARK_SOURCES: Record<string,BenchmarkSource> = {
  pages:{configuration:'Default paid Pages build environment',cadenceMinutes:30},
  workersbuilds:{configuration:'Default paid Workers Builds environment',cadenceMinutes:30},
  workersbuildsfree:{configuration:'Free Workers Builds environment',cadenceMinutes:120},
  githubactions:{configuration:'Public repository · ubuntu-latest',cadenceMinutes:30},
  blacksmith:{configuration:'blacksmith-4vcpu-ubuntu-2404',cadenceMinutes:360},
  cfcontainers:{configuration:'Cloudflare Containers · standard-2',cadenceMinutes:30,capacity:'1 vCPU · 6,144 MiB RAM · 12,000 MB disk'},
};
export const benchmarkSource=(id:string)=>BENCHMARK_SOURCES[id];
export const benchmarkCadence=(minutes:number)=>minutes<60 ? `Every ${minutes} minutes` : `Every ${minutes/60} hours`;
export const BENCHMARK_METHOD = [
  'These tests run Geekbench 6 and 7 sequentially using YABS, with scores saved locally.',
  'The launcher enables fio disk tests and disables iperf network tests. The chart uses the first fio result: 4 KiB blocks.',
  'The 4 KiB test uses 50% random reads and 50% random writes, direct I/O, queue depth 64, two jobs and a 30-second runtime setting.',
  'Schedules differ by environment. Missing scores are omitted.',
  'CPU frequency, RAM and disk are reported by the test environment. Ingestion location is where the report is received.',
  'Older records in the Geekbench 6 fields can include Geekbench 4 or 5 results.',
];
export function benchmarkMetricNote(metric:string):string {
  if(metric==='startdelay') return 'Time from the commit subject timestamp to benchmark-script start, including the build pipeline. Zero-valued chart points are omitted when timing is missing. Nonzero aggregates may still include historical zeros.';
  if(metric==='geekbenchsingle'||metric==='geekbenchmulti') return 'Geekbench 6 CPU scores. Higher is better.';
  if(metric==='geekbench7single'||metric==='geekbench7multi') return 'Geekbench 7 CPU scores. Higher is better.';
  if(metric==='speedrw'||metric==='iorw') return '4 KiB random reads/writes, split 50/50. See methodology below for fio settings.';
  if(['freq','ram','disk'].includes(metric)) return 'Values reported by the test environment.';
  return '';
}
