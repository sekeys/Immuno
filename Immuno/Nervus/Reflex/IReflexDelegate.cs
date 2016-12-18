
namespace Immuno.Nervus.Reflex
{
    public interface IReflexDelegate:IDelegate
    {
        void Run(params object[] parameter);
    }
}
