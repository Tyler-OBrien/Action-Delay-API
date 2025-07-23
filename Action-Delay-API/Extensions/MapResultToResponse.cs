using Action_Delay_API.Models.API.Responses;
using FluentResults;
using Microsoft.AspNetCore.Mvc;

namespace Action_Delay_API.Extensions
{
    public static class MapResultToResponseExtensions
    {
        public static IActionResult MapErrorToResult(this Result result)
        {
            if (result.IsSuccess)
            {
                var resp = new ObjectResult("Unknown Internal Error");
                resp.StatusCode = 500;
                return resp;
            }

            // else.. we failed :(
            var errorObj = result.Errors.FirstOrDefault();
            if (errorObj is ErrorResponse errorResponse)
            {
                var newObjectResult = new ObjectResult(errorResponse);
                newObjectResult.StatusCode = errorResponse.Error?.Code;
                return newObjectResult;
            }

            return new BadRequestObjectResult(errorObj);
        }

        public static IActionResult MapToResult<T>(this Result<T> result)
        {
            if (result.IsSuccess)
                return new OkObjectResult(result.ValueOrDefault);
            // else.. we failed :(
            var errorObj = result.Errors.FirstOrDefault();
            if (errorObj is ErrorResponse errorResponse)
            {
                var newObjectResult = new ObjectResult(errorResponse);
                newObjectResult.StatusCode = errorResponse.Error?.Code;
                return newObjectResult;
            }

            return new BadRequestObjectResult(errorObj);
        }
    }
}
