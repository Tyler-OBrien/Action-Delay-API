using System.Net;
using Action_Delay_API.Models.API.Responses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Action_Delay_API.Middleware;

public class ModelStateFilterJSON : IActionResult
{
    // Handles converting Model Validation errors into our own error format
    public async Task ExecuteResultAsync(ActionContext context)
    {
        var state = context.ModelState;
        if (!state.IsValid)
        {
            var getErrors = string.Join(" || ", GetAllErrors(state));
            var errorResponse = new ErrorResponseDetails<BadRequestObjectResult>(HttpStatusCode.BadRequest,
                $"One or more validation errors occurred, Missing: {state.ErrorCount} Items, Errors: {getErrors}",
                "resource_missing", new BadRequestObjectResult(state));
            context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.HttpContext.Response.WriteAsJsonAsync(errorResponse);
        }
    }

    // Might be simpler way to do it, but it grabs all model validation errors.
    // For Example:
    // Errors: '\"' is invalid after a value. Expected either ',', '}', or ']'. Path: $ | LineNumber: 2 | BytePositionInLine: 3. || The record field is required.
    // Errors: The Name field is required. || The Type field is required. || The Content field is required.
    public static List<string> GetAllErrors(ModelStateDictionary state)
    {
        var output = new List<string>();
        foreach (var entry in state.Values)
        foreach (var error in entry.Errors)
            output.Add(error.ErrorMessage);
        return output;
    }
}