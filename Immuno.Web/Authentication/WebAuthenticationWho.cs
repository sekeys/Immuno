using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Immuno.Authentication;

namespace Immuno.Web.Authentication
{
    public class WebAuthenticationWho : Immuno.Authentication.Who
    {

        public WebAuthenticationWho() : base()
        {
        }


        public WebAuthenticationWho(string token) : base(token)
        {
        }
        public WebAuthenticationWho(string token, string name) : base(token, name)
        {
        }
        public bool Guest { get; set; }
        public  bool IsGuest
        {
            get { return Guest; }
        }
        public bool SupperMan
        {
            get;set;
        }
        public   bool IsSupperMan
        {
            get{ return SupperMan; }
        }
        public   bool IsAdmin
        {
            get { return Admin; }
        }
        public bool Admin
        {
            get;set;
        }

    }
}
