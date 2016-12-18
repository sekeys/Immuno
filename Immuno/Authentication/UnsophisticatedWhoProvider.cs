using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{
    public class UnsophisticatedWhoProvider : WhoProvider
    {
        public static string TableName { get; set; } = "Users";
        public override bool IsAdmin(IWho who)
        {
            return
                Convert.ToInt32(Database.Unsophisticated.Unsophisticated.Scalar($"select isadmin from {TableName} where userid='{who.Token}'"))
                > 0;
        }

        public override bool IsGuest(IWho who)
        {
            return
                Convert.ToInt32(Database.Unsophisticated.Unsophisticated.Scalar($"select count(1) from {TableName} where userid='{who.Token}'"))
                == 0;
        }

        public override bool IsSupperMan(IWho who)
        {
            return
                Convert.ToInt32(Database.Unsophisticated.Unsophisticated.Scalar($"select issupper from {TableName} where userid='{who.Token}'"))
                > 0;
        }

        public override IWho Who(string token)
        {
            return
                Database.Unsophisticated.Unsophisticated.One($"select issupper from {TableName} where userid='{token}'") as IWho;

        }

        public override void Initialize(IWho who)
        {
            throw new NotImplementedException();
        }
    }
}
