using Action_Delay_API.Models.API.Responses;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using Swashbuckle.AspNetCore.Filters;

namespace Action_Delay_API.Controllers;

[ApiController]
[SwaggerResponse(400, Type = typeof(ErrorResponseDetails<object>),
    Description =
        "On request failure, an object will be returned indicating what part of your request is invalid. Optionally includes details object of type BadRequestObjectResult.")]
[SwaggerResponse(404, Type = typeof(ErrorResponse),
    Description = "On invalid route, an object will be returned indicating the invalid route.")]
[SwaggerResponse(500, Type = typeof(ErrorResponse),
    Description = "On an internal server error, an object will be returned indicating the server error.")]
[SwaggerResponse(405, Type = typeof(ErrorResponse),
    Description = "On an invalid request method,  an object will be returned indicating the wrong request method.")]
[SwaggerResponse(429, Type = typeof(ErrorResponse),
    Description = "On hitting a rate limit, a rate limit response will be returned.")]
[SwaggerResponseExample(404, typeof(ErrorResponseExample404))]
[SwaggerResponseExample(500, typeof(ErrorResponseExample500))]
[SwaggerResponseExample(405, typeof(ErrorResponseExample405))]
[SwaggerResponseExample(429, typeof(ErrorResponseExample429))]
public abstract class CustomBaseController : ControllerBase
{
}