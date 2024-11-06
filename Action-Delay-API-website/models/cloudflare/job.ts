export interface GetJobs {
    data: Job[];
}

export interface Job {
    jobName:                string;
    internalJobName:        string;
    lastRunTime:            Date;
    lastRunLengthMs:        number;
    lastRunStatus:          string;
    currentRunTime:         Date;
    currentRunLengthMs?:    number;
    currentRunStatus:       string;
    predictedDelayLengthMs: number;
    predictedRunTime:       Date;
    predictedRunStatus:     string;
    description: string; 
    type: string;
}
