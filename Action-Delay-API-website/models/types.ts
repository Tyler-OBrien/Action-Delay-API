export interface Incident {
    target: string;
    startedAt: string;
    endedAt: string | null;
    active: boolean;
    currentValue: string;
    thresholdValue: string;
  }
  
  export interface StatusConfig {
    groups: {
      name: string;
      items: {
        name: string;
        jobName: string;
      }[];
    }[];
  }

  export interface Job {
    jobName: string;
    internalJobName: string;
    predictedRunTime: Date;
    predictedRunStatus: string;
    type: string;
  }
  