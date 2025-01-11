using Action_Delay_API_Core.Models.Database.Clickhouse;
using ClickHouse.Client.Copy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService
    {

        public async Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError = null, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();
                try
                {
                    if (locations != null && locations.Any())
                    {
                        using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "job_runs_locations",
                            BatchSize = 100000
                        };
                        await bulkCopyInterface.InitAsync();
                        await bulkCopyInterface.WriteToServerAsync(
                            locations.Select(server => new object[]
                                {
                                    server.JobName, server.LocationName, server.RunTime, server.RunLength,
                                    server.RunStatus, server.ResponseLatency, server.ColoId
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations");
                    throw;
                }

                try
                {
                    using var bulkCopyRun = new ClickHouseBulkCopy(connection)
                    {
                        DestinationTableName = "job_runs",
                        BatchSize = 100000
                    };
                    await bulkCopyRun.InitAsync();

                    await bulkCopyRun.WriteToServerAsync(
                        new[]
                        {
                            new object[]
                            {
                                run.JobName, run.RunTime, run.RunLength, run.RunStatus,
                                apiError?.ErrorDescription ?? string.Empty, run.ResponseLatency
                            }
                        }, token);

                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs");
                    throw;
                }
                try
                {
                    if (apiError != null)
                    {
                        using var bulkCopyApiError = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "api_errors",
                            BatchSize = 100000
                        };
                        await bulkCopyApiError.InitAsync();
                        await bulkCopyApiError.WriteToServerAsync(
                            new[]
                            {
                                new object[]
                                {
                                    apiError.JobName, apiError.RunTime, apiError.ErrorType, apiError.ErrorDescription,
                                    apiError.ErrorHash, apiError.ResponseLatency
                                }
                            }, token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse api_errors");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse");
            }
        }

        public async Task InsertRunAI(List<ClickhouseJobRun> runs, List<ClickhouseJobLocationRun>? locations, List<ClickhouseAPIError>? apiErrors = null, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();
                try
                {
                    if (locations != null && locations.Any())
                    {
                        using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "job_runs_locations_ai",
                            BatchSize = 100000
                        };
                        await bulkCopyInterface.InitAsync();
                        await bulkCopyInterface.WriteToServerAsync(
                            locations.Select(server => new object[]
                                {
                                    server.JobName, server.LocationName, server.RunTime, server.RunLength,
                                    server.RunStatus, server.ResponseLatency, server.ColoId, server.BindingResponseLatency
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations_ai");
                    throw;
                }

                try
                {
                    using var bulkCopyRun = new ClickHouseBulkCopy(connection)
                    {
                        DestinationTableName = "job_runs_ai",
                        BatchSize = 100000
                    };
                    await bulkCopyRun.InitAsync();
                    await bulkCopyRun.WriteToServerAsync(
                        runs.Select(run => new object[]
                            {
                                run.JobName, run.RunTime, run.RunLength, run.RunStatus,
                                string.Empty, run.ResponseLatency, run.BindingResponseLatency
                            })
                            .ToArray(), token);

                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_ai");
                    throw;
                }
                try
                {
                    if (apiErrors != null && apiErrors.Any())
                    {
                        using var bulkCopyApiError = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "api_errors_ai",
                            BatchSize = 100000
                        };
                        await bulkCopyApiError.InitAsync();
                        await bulkCopyApiError.WriteToServerAsync(
                            apiErrors.Select(apiError => new object[]
                                {
                                    apiError.JobName, apiError.LocationName, apiError.RunTime, apiError.ErrorType, apiError.ErrorDescription,
                                    apiError.ErrorHash, apiError.ResponseLatency
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse api_errors_ai");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse ai");
            }
        }


        public async Task InsertRunPerf(List<ClickhouseJobRunPerf> runs, List<ClickhouseJobLocationRunPerf>? locations,
            List<ClickhouseAPIErrorPerf>? apiErrors = null, CancellationToken token = default)
        {
            try
            {
                await using var connection = CreateConnection();

                try
                {
                    using var bulkCopyRun = new ClickHouseBulkCopy(connection)
                    {
                        DestinationTableName = "job_runs_perf",
                        BatchSize = 100000
                    };
                    await bulkCopyRun.InitAsync();
                    await bulkCopyRun.WriteToServerAsync(
                        runs.Select(run => new object[]
                            {
                                run.JobName, run.RunTime, run.RunStatus, run.ResponseLatency, run.BindingResponseLatency
                            })
                            .ToArray(), token);

                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs");
                    throw;
                }
                try
                {
                    if (locations != null && locations.Any())
                    {
                        using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "job_runs_locations_perf",
                            BatchSize = 100000
                        };
                        await bulkCopyInterface.InitAsync();
                        await bulkCopyInterface.WriteToServerAsync(
                            locations.Select(server => new object[]
                                {
                                    server.JobName, server.LocationName, server.RunTime,
                                    server.RunStatus, server.ResponseLatency, server.LocationId, server.BindingResponseLatency
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations_perf");
                    _logger.LogCritical($"Attempted input: {System.Text.Json.JsonSerializer.Serialize(locations)}");
                    throw;
                }


     
                try
                {
                    if (apiErrors != null && apiErrors.Any())
                    {
                        using var bulkCopyApiError = new ClickHouseBulkCopy(connection)
                        {
                            DestinationTableName = "api_errors_perf",
                            BatchSize = 100000
                        };
                        await bulkCopyApiError.InitAsync();
                        await bulkCopyApiError.WriteToServerAsync(
                            apiErrors.Select(apiError => new object[]
                                {
                                    apiError.JobName, apiError.LocationName, apiError.RunTime, apiError.ErrorType, apiError.ErrorDescription,
                                    apiError.ErrorHash, apiError.ResponseLatency, apiError.LocationName ?? string.Empty,
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse api_errors_perf");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse perf");
            }
        }

    }
}
