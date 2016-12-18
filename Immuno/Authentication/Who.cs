using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Authentication
{


    public class Who : IWho
    {
        public Who()
        {
            Token = Guid.NewGuid().ToString();
            Name = Token;
        }

        
        public Who(string token)
        {
            this.Token  = token;
            this.Name = token;
        }
        public Who(string token, string name)
        {
            this.Token = token;
            this.Name = name;
        }
        public WhoProvider Provider { get { return WhoProvider.Provider; } }
        public virtual bool IsAdmin
        {
            get
            {
                return Provider.IsAdmin(this);
            }
        }

        public virtual bool IsGuest { get { return Provider.IsGuest(this); } }

        public virtual bool IsSupperMan
        {
            get
            {
                return Provider.IsSupperMan(this);
            }
        }

        public  string Token
        {
            get;
            private set;
        }

        public object ExtendObject { get; set; }


        public string AuthenticationType
        {
            get;
            protected set;
        }

        public bool IsAuthenticated
        {
            get;
            protected set;
        }

        public string Name
        {
            get;
            private set;
        }

        public List<string> Roles
        {
            get;
            protected set;
        } = new List<string>();
    }


}