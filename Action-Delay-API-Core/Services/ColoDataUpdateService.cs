using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Action_Delay_API_Core.Broker.ColoData;
using Action_Delay_API_Core.Models.Database.Postgres;
using Action_Delay_API_Core.Models.Jobs;
using Action_Delay_API_Core.Models.Local;
using Action_Delay_API_Core.Models.NATS;
using Action_Delay_API_Core.Models.NATS.Requests;
using Action_Delay_API_Core.Models.NATS.Responses;
using Action_Delay_API_Core.Models.Services;
using FluentResults;
using Microsoft.EntityFrameworkCore;

namespace Action_Delay_API_Core.Services
{
    public class ColoDataUpdateService : IColoDataUpdateService
    {
        private readonly LocalConfig _config;
        private readonly ILogger _logger;
        private readonly IColoDataBroker _coloData;
        private readonly ActionDelayDatabaseContext _context;
        private readonly IQueue _queue;




        public ColoDataUpdateService(LocalConfig baseConfigurationOptions, ILogger<ColoDataUpdateService> logger, ActionDelayDatabaseContext context, IColoDataBroker coloDataBroker, IQueue queue)
        {
            _config = baseConfigurationOptions;
            _logger = logger;
            _context = context;
            _coloData = coloDataBroker;
            _queue = queue;
        }

        public async Task Run()
        {
            try
            {
                await TryUpdateLocalDB();
                _logger.LogInformation("Successfully updated local colos DB");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating local colo data db");
            }
            var getAllCurrentColos = await _context.ColoData.ToListAsync();
            var getCurrentLocationData = await _context.LocationData.ToListAsync();
            _logger.LogInformation($"We got current location data: {String.Join(", ",getCurrentLocationData.Select(loc => loc.LocationName))}");
            foreach (var location in _config.Locations.Where(location => location.Disabled == false))
            {
               var tryGetColoId = await RunLocation(location, CancellationToken.None);
               var tryGetColoInfo = getAllCurrentColos.FirstOrDefault(colo => colo.ColoId == tryGetColoId);
               if (tryGetColoInfo == null)
               {
                    _logger.LogError($"Could not get info for coloid {tryGetColoId} for {location.DisplayName ?? location.Name}, aborting update");
                    continue;
               }
               if (tryGetColoId != null)
               {
                   var tryGetCurrentLocationData =
                       getCurrentLocationData.FirstOrDefault(dbLocation => location.Name.Equals(dbLocation.LocationName, StringComparison.OrdinalIgnoreCase));
                   if (tryGetCurrentLocationData == null)
                   {
                       _logger.LogInformation($"We tried to get {location.Name}, but we couldn't find it, creating new..");
                       tryGetCurrentLocationData = new LocationData();
                       tryGetCurrentLocationData.LocationName = location.Name;
                       _context.LocationData.Add(tryGetCurrentLocationData);
                   }
                   // changed!
                   if (tryGetCurrentLocationData.IATA == null || tryGetCurrentLocationData.IATA.Equals(tryGetColoInfo.IATA, StringComparison.OrdinalIgnoreCase) == false)
                   {
                        tryGetCurrentLocationData.LastChange = DateTime.UtcNow;
                   }

                   tryGetCurrentLocationData.ColoId = tryGetColoId.Value;
                   tryGetCurrentLocationData.IATA = tryGetColoInfo.IATA;
                   tryGetCurrentLocationData.FriendlyLocationName = tryGetColoInfo.FriendlyName;
                   tryGetCurrentLocationData.ColoLatitude = tryGetColoInfo.Latitude;
                   tryGetCurrentLocationData.ColoLongitude = tryGetColoInfo.Longitude;
                   tryGetCurrentLocationData.Enabled = !location.Disabled;
                    tryGetCurrentLocationData.LastUpdate = DateTime.UtcNow;
               }
            }

            foreach (var location in _config.Locations.Where(location => location.Disabled))
            {
                var tryGetCurrentLocationData =
                    getCurrentLocationData.FirstOrDefault(dbLocation => location.Name == dbLocation.LocationName);
                if (tryGetCurrentLocationData != null)
                {
                    tryGetCurrentLocationData.Enabled = !location.Disabled;
                }
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Finished running colo data update..");
        }



        public async Task<int?> RunLocation(Location location, CancellationToken token)
        {

            var tryGetResult = await SendRequest(location, token);
            if (tryGetResult.IsFailed)
            {
                _logger.LogInformation($"Error getting response {tryGetResult.Errors.FirstOrDefault()?.Message}, aborting colo update..");
                return null;
            }
            var getResponse = tryGetResult.Value;



            _logger.LogInformation($"One HTTP Request returned from {location.Name} - Success {getResponse.WasSuccess}");

            if (getResponse.StatusCode == HttpStatusCode.OK)
            {
                // We got the right value!
                if (getResponse.Headers.TryGetValue("colo", out var coloValue) &&
                    int.TryParse(coloValue, out var coloInt))
                {
                    _logger.LogInformation($"{location.Name} got colo {coloInt}, returning...");
                    return coloInt;
                }
                else
                {
                    _logger.LogInformation($"{location.Name} colo update invalid response, could not get colo header or was unparsable! Let's try again...");
                    return null;
                }
            }
            else
            {
                _logger.LogInformation($"{location.Name} colo update invalid response, {getResponse.StatusCode} instead of 200 / OK! Let's try again...");
                if (getResponse is { WasSuccess: false, ProxyFailure: true })
                {
                    _logger.LogInformation($"{location.Name} a non-success status code of: Bad Gateway / {getResponse.StatusCode} ABORTING colo update!!!!! Headers: {String.Join(" | ", getResponse.Headers.Select(headers => $"{headers.Key}: {headers.Value}"))}");
                    return null;
                }

                return null;
            }
        }
        public Task<Result<SerializableHttpResponse>> SendRequest(Location location, CancellationToken token)
        {
            var newRequest = new NATSHttpRequest()
            {
                Headers = new Dictionary<string, string>()
                {
                    { "User-Agent", $"Action-Delay-API Update Colo location"}
                },
                URL = "https://debug.chaika.me",
                NetType = location.NetType ?? NetType.Either,
                TimeoutMs = 10_000,
                EnableConnectionReuse = true
            };
            return _queue.HTTP(newRequest, location.NATSName ?? location.Name, token);
        }

        public async Task TryUpdateLocalDB()
        {
            var getData = await _coloData.GetColoData(CancellationToken.None);
            if (getData.IsFailed)
            {
                _logger.LogInformation($"Failed to get colo data, {getData.Errors.FirstOrDefault()?.ToString()}");
                return;
            }

            var getColoData = getData.Value;

            var getAllCurrentColos = await _context.ColoData.ToListAsync();

            foreach (var coloData in getColoData)
            {
                var getExistingColoData = getAllCurrentColos.FirstOrDefault(colo => colo.ColoId == coloData.Id);
                if (getExistingColoData == null)
                {
                    _context.ColoData.Add(new ColoData(coloData));
                }
                else
                {
                    getExistingColoData.Update(coloData);
                }
            }
            await _context.SaveChangesAsync();

        }
    }
}
