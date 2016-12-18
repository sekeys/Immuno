using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    public interface IEnchyma : 
        IEnumerator<KeyValuePair<string, object>>
        , IEnumerable<KeyValuePair<string, object>>
        , Interface.IConvertible,Interface.IConvertible<IEnchyma>

    {
        /// <summary>
        /// 获取
        /// </summary>
        /// <param name="index"></param>
        /// <returns></returns>
        object this[string key] { get; set; }
        void Set(string key, object value);
        void SaveOrNot(string key, object value);
        void SetNull(string key);
        object Remove(string key);
        T TypeOf<T>(string key);
        T TypeOf<T>(string key,T def);
        T Extract<T>(string key);
        bool Contains(string key);
        int Numberic(string key);
        int Numberic(string key, int def);
        bool Boolean(string key);
        bool BooleanEx(string key);
        string String(string key);
        string StringEx(string key);
        string StringEx(string key,string defaultValue);
        double Double(string key);
        double Double(string key, double def);
        DateTime Date(string key);
        DateTime Date(string key, DateTime def);
        string Date(string key, string format);
        bool IsNull(string key);
        int Count { get; }

        string[] Keys { get; }
        IEnchyma Merge(IDictionary<string, object> keyvaluePairs);

        IEnchyma Merge(ICollection<KeyValuePair<string, object>> keyvaluePairs);
        IEnchyma Merge(IEnumerable<KeyValuePair<string, object>> keyvaluePairs);
        IEnchyma Merge<T>(IDictionary<string, T> keyvaluePairs);
        IEnchyma Merge<T>(ICollection<KeyValuePair<string, T>> keyvaluePairs);
        IEnchyma Merge<T>(IEnumerable<KeyValuePair<string, T>> keyvaluePairs);
        bool IsCollection<T>(string key);
        bool LikeArray { get; }
        bool Is<T>(string key);
        bool Is<T>(string key, Action<T> action);
        void Is<T>(string key, Action<T> trueAction, Action falseAction);
        bool Result { get; set; }
        int StatusCode { get; set; }
        string Json();
        string Xml();
        string Json(string key);
        string Xml(string key);

        IEnchyma Response { get; }

        IEnchyma List { get; }

    }
}
