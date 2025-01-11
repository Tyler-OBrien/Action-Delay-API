using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Action_Delay_API_Core.Services;

public class RateLimitedEventLogger
{
    private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);
    private readonly TimeSpan _releaseInterval = TimeSpan.FromSeconds(5);

    public bool ShouldLog()
    {
        if (_semaphore.Wait(0)) // Try to acquire immediately without blocking
        {
            try
            {
                return true;
            }
            finally
            {
                // Schedule the release of the semaphore after 2 seconds
                Task.Delay(_releaseInterval).ContinueWith(t => _semaphore.Release());
            }
        }

        return false;
    }
}