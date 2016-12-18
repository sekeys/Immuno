

namespace Immuno.Attributes
{
    using System;

    public class VerbAttribute : Attribute
    {
        public Verbs Verb
        {
            get;protected set;
        }
        public VerbAttribute(Verbs verb)
        {
            Verb = verb;
        }
    }
}
