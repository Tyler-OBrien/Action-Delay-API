using Action_Delay_API.Models.API.Responses.DTOs;
using Action_Delay_API.Models.API.Responses;
using Action_Delay_API.Services.v2;
using FluentResults;

namespace Action_Delay_API.Models.Services.v2
{
    public interface ILocationDataService
    {

        public Task<Result<DataResponse<LocationDataResponse[]>>> GetLocations(CancellationToken token);

        public Task<Result<DataResponse<LocationDataResponse>>> GetLocation(string locationName,
            CancellationToken token);


        public Task<Result<DataResponse<JobLocationDataResponse[]>>> GetLocationJobData(string jobName,
            CancellationToken token);

        public Task<Result<DataResponse<JobLocationDataResponse>>> GetLocationsJobData(string jobName,
            string locationName, CancellationToken token);
    }
}
