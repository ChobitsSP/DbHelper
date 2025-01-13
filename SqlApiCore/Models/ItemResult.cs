namespace SqlApiCore.Models
{
    public class ItemResult
    {
        public ItemResult() { }

        public ItemResult(object obj)
        {
            this.data = obj;
        }

        public ItemResult(int code, string msg)
        {
            this.code = code;
            this.msg = msg;
        }

        public int code { get; set; }

        public string msg { get; set; }

        public object data { get; set; }
    }
}
