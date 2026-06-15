export interface JobLocation {
  locationName:       string;
  jobName:            string;
  internalJobName:    string;
  responseTimeUtc:    string;
  lastRunTime:        string;
  lastRunLengthMs:    number;
  lastRunStatus:      string;
  currentRunTime:     string;
  currentRunLengthMs: number;
  currentRunStatus:   string;
  coloId?:            number;
}
