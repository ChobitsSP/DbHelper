
using DbUtilsCore;

namespace SqlApiCore.Workers
{
    public class TestWorker : Worker
    {
        public TestWorker()
        {
            this.SleepTime = 1000 * 10;
        }

        protected override Task<bool> RunAsync(CancellationToken stoppingToken)
        {
            LogService.Info("TestWorker");
            return Task.FromResult(true);
        }
    }
}
