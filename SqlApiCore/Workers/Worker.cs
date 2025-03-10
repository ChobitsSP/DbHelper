using DbUtilsCore;

namespace SqlApiCore.Workers
{
    public abstract class Worker : IHostedService, IDisposable
    {
        public Worker()
        {

        }

        public Task StartAsync(CancellationToken stoppingToken)
        {
            LogService.Info(string.Format("{0} starting at: {1}", this.GetType().Name, DateTimeOffset.Now));

            Task.Run(async () =>
            {
                await ExecuteAsync(stoppingToken);
            }, stoppingToken);

            return Task.CompletedTask;
        }

        protected async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                bool isSleep;

                try
                {
                    isSleep = await this.RunAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    LogService.Error(ex);
                    isSleep = true;
                }

                await Task.Delay(isSleep ? this.SleepTime : 0, stoppingToken);
            }
        }

        protected abstract Task<bool> RunAsync(CancellationToken stoppingToken);
        public int SleepTime { get; protected set; } = 5000;

        public Task StopAsync(CancellationToken stoppingToken)
        {
            LogService.Info(string.Format("{0} stop at: {1}", this.GetType().Name, DateTimeOffset.Now));
            this.Dispose();
            return Task.CompletedTask;
        }

        public virtual void Dispose()
        {

        }
    }
}
