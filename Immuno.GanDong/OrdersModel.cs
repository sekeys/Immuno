using Microsoft.Azure.Documents;
using System;

namespace Immuno.GanDong
{
    public class OrdersModel:Document
    {
        public string Client { get; set; }
    }
}
