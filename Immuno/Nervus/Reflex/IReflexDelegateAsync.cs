

namespace Immuno.Nervus.Reflex
{
    public interface IReflexDelegateAsync : IDelegate
    {
        void RunAsync(params object[] parameter);
    }
}
