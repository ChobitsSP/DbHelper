using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using SqlApiCore.Models;
using static System.Net.Mime.MediaTypeNames;
using System.Text;

namespace SqlApiCore.Middleware
{
    public class ItemResultOutputFormatter : TextOutputFormatter
    {
        public ItemResultOutputFormatter()
        {
            SupportedEncodings.Add(Encoding.UTF8);
            SupportedMediaTypes.Add(Application.Json);
        }

        public override bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            if (context.ObjectType == typeof(ItemResult) || context.Object is ItemResult)
            {
                return base.CanWriteResult(context);
            }
            return false;
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (selectedEncoding == null)
            {
                throw new ArgumentNullException(nameof(selectedEncoding));
            }

            var valueAsString = JsonConvert.SerializeObject(context.Object, new JsonSerializerSettings()
            {
                NullValueHandling = NullValueHandling.Include,
                DateFormatString = "yyyy-MM-dd HH:mm:ss",
            });

            if (string.IsNullOrEmpty(valueAsString))
            {
                await Task.CompletedTask;
            }

            var response = context.HttpContext.Response;
            await response.WriteAsync(valueAsString, selectedEncoding);
        }
    }
}
