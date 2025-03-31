using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace SqlWebApi.Utils
{
    public static class LogService
    {
        public static ILog logger { get; private set; }

        public static void Init(string fileName)
        {
            System.IO.FileInfo fileInfo = new System.IO.FileInfo(fileName);
            log4net.Config.XmlConfigurator.ConfigureAndWatch(fileInfo);
            // log4net.Config.XmlConfigurator.Configure();
            logger = LogManager.GetLogger("LogWritter");
        }

        public static void Warn(object message)
        {
            logger.Warn(message);
        }

        public static void Info(string message)
        {
            logger.Info(message);
        }

        public static void Error(string message)
        {
            logger.Info(message);
        }

        public static void Error(Exception exception)
        {
            logger.Error(FlattenException(exception), exception);
        }

        public static string FlattenException(Exception exception)
        {
            var stringBuilder = new StringBuilder();

            while (exception != null)
            {
                stringBuilder.AppendLine(exception.GetType().FullName);
                stringBuilder.AppendLine(exception.Message);
                stringBuilder.AppendLine(exception.StackTrace);

                exception = exception.InnerException;
            }

            return stringBuilder.ToString();
        }
    }
}