/** Comparable configuration changes, with original collection identifiers. */
export const PROPAGATION_JOBS: Record<string, {label:string; purpose:string; context:string}> = {
  googledns: {label:'Google Cloud DNS', purpose:'dns-update', context:'Updates a TXT record and probes for the new value.'},
  dns: {label:'Cloudflare DNS · Paid', purpose:'dns-update', context:'Updates a TXT record and probes for the new value.'},
  dnsfree: {label:'Cloudflare DNS · Free', purpose:'dns-update', context:'Updates a TXT record and probes for the new value.'},
  googlearmor: {label:'Google Cloud Armor', purpose:'custom-rule-update', context:'Updates a rule blocking a marker header and probes for the block. Polls every 10 seconds initially, then every 5 seconds after 90 seconds; longer waits use backoff.'},
  waf: {label:'Cloudflare Custom Rules', purpose:'custom-rule-update', context:'Updates a blocking rule matching hostname and path, then probes for the block. Polling intervals differ from Cloud Armor.'},
  googlelb: {label:'Google Load Balancer · Redirect', purpose:'redirect-update', context:'Updates a URL-map redirect target and probes for the new Location header. Polls every 10 seconds initially, then every 5 seconds after 60 seconds; longer waits use backoff.'},
  pagerule: {label:'Cloudflare Page Rules · Redirect', purpose:'redirect-update', context:'Updates a redirect target and probes for the new Location header. Polling intervals differ from Google Load Balancer.'},
};
export const PROPAGATION_COMPARISONS = [
  {id:'propagation-google-cloudflare', label:'Google vs Cloudflare propagation', description:'Compare tested DNS, blocking-rule and redirect changes. These are different operations, so the overview has no overall ranking.', jobs:['googledns','dns','dnsfree','googlearmor','waf','googlelb','pagerule']},
  {id:'propagation-dns', label:'DNS updates', description:'TXT-record update propagation across Google Cloud DNS and Cloudflare paid and free zones.', jobs:['googledns','dns','dnsfree']},
  {id:'propagation-blocking-rules', label:'Blocking rules', description:'Cloud Armor and Cloudflare Custom Rules: how long until probes observe the updated block? Polling intervals differ.', jobs:['googlearmor','waf']},
  {id:'propagation-redirects', label:'Redirect changes', description:'Google Load Balancer URL-map redirects and Cloudflare Page Rules: how long until probes see the new redirect target? Polling intervals differ.', jobs:['googlelb','pagerule']},
];
