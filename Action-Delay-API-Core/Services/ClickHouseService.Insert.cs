using Action_Delay_API_Core.Models.Database.Clickhouse;
using ClickHouse.Client.Copy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Action_Delay_API_Core.Models.NATS.Event;

namespace Action_Delay_API_Core.Services
{
    public partial class ClickHouseService
    {

        public async Task InsertGeneric(List<object[]> data, string[] columns, string table, CancellationToken token = default)
        {
            if (_config.SendClickhouseResultsToNATS)
            {
                try
                {
                    List<ClickhouseRow> rows = new List<ClickhouseRow>();
                    foreach (var row in data)
                    {
                        var obj = new Dictionary<string, object>();

                        for (int i = 0; i < columns.Length && i < row.Length; i++)
                        {
                            obj[columns[i]] = row[i];
                        }

                        rows.Add(new ClickhouseRow()
                        {
                            TableName = table,
                            Data = (obj),
                        });
                    }

                    await PublishRows(rows);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting into nats clickhouse queue");
                }
            }

            await using var connection = CreateConnection(write: true);
            try
            {

                using var bulkCopyInterface = new ClickHouseBulkCopy(connection)
                {
                    DestinationTableName = table,
                    ColumnNames = columns,
                    BatchSize = 100000
                };


                await bulkCopyInterface.InitAsync();
                
                await bulkCopyInterface.WriteToServerAsync(
                    data, token);

            }
            catch (Exception ex)
            {
                _logger.LogCritical(ex, "Failure to write to Clickhouse InsertGeneric");
                SentrySdk.CaptureException(ex);
                throw;
            }

        }




        public async Task InsertRun(ClickhouseJobRun run, List<ClickhouseJobLocationRun>? locations, ClickhouseAPIError? apiError = null, CancellationToken token = default)
        {
            if (_config.SendClickhouseResultsToNATS)
            {
                try
                {
                    List<ClickhouseRow> rows = new List<ClickhouseRow>();
                    if (run != null)
                    {
                        rows.Add(new ClickhouseRow()
                        {
                            TableName = "job_runs",
                            Data = (new
                            {
                                job_name = run.JobName,
                                run_time = run.RunTime,
                                run_length = run.RunLength,
                                run_status = run.RunStatus,
                                run_info = apiError?.ErrorDescription ?? string.Empty,
                                response_latency = run.ResponseLatency,
                            }),
                        });
                    }

                    if (locations != null && locations.Any())
                    {
                        foreach (var loc in locations)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "job_runs_locations",
                                Data = (new
                                {
                                    job_name = loc.JobName,
                                    location_name = loc.LocationName,
                                    run_time = loc.RunTime,
                                    run_length = loc.RunLength,
                                    run_status = loc.RunStatus,
                                    response_latency = loc.ResponseLatency,
                                    colo_id = loc.ColoId,
                                }),
                            });
                        }
                    }

                    if (apiError != null)
                    {
                        rows.Add(new ClickhouseRow()
                        {
                            TableName = "api_errors",
                            Data = (new
                            {
                                job_name = apiError.JobName,
                                run_time = apiError.RunTime,
                                error_type = apiError.ErrorType,
                                error_description = apiError.ErrorDescription,
                                error_hash = apiError.ErrorHash,
                                response_latency = apiError.ResponseLatency,
                            }),
                        });
                    }

                    await PublishRows(rows);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting into nats clickhouse queue");
                }
            }

            try
            {
                await using var connection = CreateConnection(write: true);
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
                                    server.RunStatus, server.ResponseLatency, (uint)server.ColoId
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations");
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
            if (_config.SendClickhouseResultsToNATS)
            {
                try
                {
                    List<ClickhouseRow> rows = new List<ClickhouseRow>();
                    if (runs != null)
                    {
                        foreach (var run in runs)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "job_runs_ai",
                                Data = (new
                                {
                                    job_name = run.JobName,
                                    run_time = run.RunTime,
                                    run_length = run.RunLength,
                                    run_status = run.RunStatus,
                                    average_response_latency = run.ResponseLatency,
                                    average_binding_response_latency = run.BindingResponseLatency,
                                }),
                            });
                        }
                    }

                    if (locations != null && locations.Any())
                    {
                        foreach (var loc in locations)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "job_runs_locations_ai",
                                Data = (new
                                {
                                    job_name = loc.JobName,
                                    location_name = loc.LocationName,
                                    run_time = loc.RunTime,
                                    run_length = loc.RunLength,
                                    run_status = loc.RunStatus,
                                    response_latency = loc.ResponseLatency,
                                    colo_id = loc.ColoId,
                                    binding_response_latency = loc.BindingResponseLatency,
                                }),
                            });
                        }
                    }

                    if (apiErrors != null && apiErrors.Any())
                    {
                        foreach (var apiError in apiErrors)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "api_errors_ai",
                                Data = (new
                                {
                                    job_name = apiError.JobName,
                                    location_name = apiError.LocationName,
                                    run_time = apiError.RunTime,
                                    error_type = apiError.ErrorType,
                                    error_description = apiError.ErrorDescription,
                                    error_hash = apiError.ErrorHash,
                                    response_latency = apiError.ResponseLatency,
                                }),
                            });
                        }
                    }

                    await PublishRows(rows);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting into nats clickhouse queue");
                }
            }


            try
            {
                await using var connection = CreateConnection(write: true);
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
                                    server.RunStatus, server.ResponseLatency, (Int32)server.ColoId, server.BindingResponseLatency
                                })
                                .ToArray(), token);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogCritical(ex, "Failure to write to Clickhouse job_runs_locations_ai");
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
            if (_config.SendClickhouseResultsToNATS)
            {
                try
                {
                    List<ClickhouseRow> rows = new List<ClickhouseRow>();
                    if (runs != null)
                    {
                        foreach (var run in runs)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "job_runs_perf",
                                Data = (new
                                {
                                    job_name = run.JobName,
                                    run_time = run.RunTime,
                                    run_status = run.RunStatus,
                                    average_response_latency = run.ResponseLatency,
                                    average_binding_response_latency = run.BindingResponseLatency,
                                }),
                            });
                        }
                    }

                    if (locations != null && locations.Any())
                    {
                        foreach (var loc in locations)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "job_runs_locations_perf",
                                Data = (new
                                {
                                    job_name = loc.JobName,
                                    location_name = loc.LocationName,
                                    run_time = loc.RunTime,
                                    run_status = loc.RunStatus,
                                    response_latency = loc.ResponseLatency,
                                    location_id = loc.LocationId,
                                    binding_response_latency = loc.BindingResponseLatency,
                                }),
                            });
                        }
                    }

                    if (apiErrors != null && apiErrors.Any())
                    {
                        foreach (var apiError in apiErrors)
                        {
                            rows.Add(new ClickhouseRow()
                            {
                                TableName = "api_errors_perf",
                                Data = (new
                                {
                                    job_name = apiError.JobName,
                                    location_name = apiError.LocationName,
                                    run_time = apiError.RunTime,
                                    error_type = apiError.ErrorType,
                                    error_description = apiError.ErrorDescription,
                                    error_hash = apiError.ErrorHash,
                                    response_latency = apiError.ResponseLatency,
                                    location_id = apiError.LocationId,
                                }),
                            });
                        }
                    }

                    await PublishRows(rows);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error inserting into nats clickhouse queue");
                }
            }


            try
            {
                await using var connection = CreateConnection(write: true);

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
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
                    SentrySdk.CaptureException(ex);
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
