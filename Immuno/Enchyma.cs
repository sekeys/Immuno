namespace Immuno
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    public class Enchyma : IEnchyma
    {
        public static Newtonsoft.Json.JsonSerializerSettings JsonSerializerSettings { get; set; } =
        new Newtonsoft.Json.JsonSerializerSettings()
        {
            NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore

        };
        public System.Collections.Concurrent.ConcurrentDictionary<string, object> m_dictionary = new System.Collections.Concurrent.ConcurrentDictionary<string, object>();
        public object Current
        {
            get
            {
                return m_dictionary.GetEnumerator().Current;
            }
        }

        KeyValuePair<string, object> IEnumerator<KeyValuePair<string, object>>.Current
        {
            get
            {
                return m_dictionary.GetEnumerator().Current;
            }
        }

        public string[] Keys
        {
            get
            {
                return m_dictionary.Keys.ToArray();
            }
        }

        public bool Result
        {
            get;
            set;
        }
        public int StatusCode { get; set; }

        public bool IsCollection<T>(string key)
        {
            return Is<ICollection<T>>(key);
        }
        internal readonly System.Text.RegularExpressions.Regex matchNumber = new System.Text.RegularExpressions.Regex(@"\d+");
        public bool LikeArray
        {
            get
            {
                var hasNumber = false;
                var haszeror = false;
                foreach (var key in Keys)
                {
                    if (key.ToString().Equals("0"))
                    {
                        haszeror = true;
                        hasNumber = true;
                        break;
                    }
                    if (matchNumber.IsMatch(key))
                    {
                        hasNumber = true;
                    }
                }
                return haszeror && hasNumber;
            }
        }

        public int Count
        {
            get
            {
                return m_dictionary.Count;
            }
        }

        public IEnchyma Response
        {
            get
            {
                return this.Contains("response") ? this.Extract<IEnchyma>("reponse") : null;
            }
        }

        public IEnchyma List
        {
            get
            {
                Enchyma enc = new Enchyma();
                foreach (var key in Keys)
                {
                    if (matchNumber.IsMatch(key))
                    {
                        enc.Set(key, this[key]);
                    }
                }
                return enc;
            }
        }

        public object this[string key]
        {
            get
            {
                return m_dictionary[key.ToLower()];
            }

            set
            {
                m_dictionary[key.ToLower()] = value;
            }
        }

        public bool Boolean(string key)
        {

            Require.NotNull(key);
            try
            {
                if (Contains(key))
                {

                    return (bool)this[key];
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool Contains(string key)
        {
            return m_dictionary.ContainsKey(key.ToLower());
        }

        public DateTime Date(string key)
        {
            Require.NotNull(key);
            if (this.Contains(key))
            {
                return System.Convert.ToDateTime(this[key]);
            }
            return default(DateTime);
        }

        public DateTime Date(string key, DateTime def)
        {
            try
            {
                Require.NotNull(key);
                if (this.Contains(key))
                {
                    return System.Convert.ToDateTime(this[key]);
                }
                return def;
            }
            catch (Exception)
            {
                return def;
            }
        }

        public void Dispose()
        {
            m_dictionary.GetEnumerator().Dispose();
        }

        public double Double(string key)
        {
            Require.NotNull(key);
            if (this.Contains(key))
            {
                return System.Convert.ToDouble(this[key]);
            }
            return 0d;
        }

        public double Double(string key, double def)
        {
            try
            {
                Require.NotNull(key);
                if (this.Contains(key))
                {
                    return System.Convert.ToDouble(this[key]);
                }
                return def;
            }
            catch (Exception)
            {
                return def;
            }
        }

        public T Extract<T>(string key)
        {
            throw new NotImplementedException();
        }

        public bool IsNull(string key)
        {
            if (Contains(key))
            {
                return this[key] == null;
            }
            return true;
        }

        public bool MoveNext()
        {
            return this.GetEnumerator().MoveNext();
        }

        public int Numberic(string key)
        {
            Require.NotNull(key);
            if (this.Contains(key))
            {
                var value = this[key].ToString();
                return System.Convert.ToInt32(value);
            }
            return 0;
        }

        public int Numberic(string key, int def)
        {
            try
            {
                Require.NotNull(key);
                if (this.Contains(key))
                {
                    return System.Convert.ToInt32(this[key].ToString());
                }
                return def;
            }
            catch (Exception)
            {
                return def;
            }
        }

        public void Reset()
        {
            this.GetEnumerator().Reset();
        }

        public string String(string key)
        {
            Require.NotNull(key);
            if (this.Contains(key))
            {
                return this[key].ToString();
            }
            return "";
        }

        public T TypeOf<T>(string key)
        {
            Require.NotNull(key);
            if (this.Contains(key))
            {
                return (T)this[key];
            }
            return default(T);
        }

        public IEnchyma Merge(IDictionary<string, object> keyvaluePairs)
        {

            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }

        public IEnchyma Merge(ICollection<KeyValuePair<string, object>> keyvaluePairs)
        {

            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }
        public IEnchyma Merge(IEnumerable<KeyValuePair<string, object>> keyvaluePairs)
        {

            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }
        public IEnchyma Merge<T>(IDictionary<string, T> keyvaluePairs)
        {

            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }

        public IEnchyma Merge<T>(ICollection<KeyValuePair<string, T>> keyvaluePairs)
        {
            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }

        public IEnchyma Merge<T>(IEnumerable<KeyValuePair<string, T>> keyvaluePairs)
        {
            foreach (var keyvalue in keyvaluePairs)
            {
                this[keyvalue.Key] = keyvalue.Value;
            }
            return this;
        }

        public bool Is<T>(string key)
        {
            if (Contains(key))
            {
                var value = this[key];
                if (value is T)
                {
                    return true;
                }
            }
            return false;
        }

        public bool Is<T>(string key, Action<T> action)
        {
            if (Is<T>(key))
            {
                action.Invoke(this.TypeOf<T>(key));
                return true;
            }
            return false;
        }
        public void Is<T>(string key, Action<T> trueAction, Action falseAction)
        {
            if (Is<T>(key))
            {
                trueAction.Invoke(this.TypeOf<T>(key));
            }
            falseAction.Invoke();
        }
        public string Json()
        {
            return Json("");
        }

        public string Xml()
        {
            throw new NotImplementedException();
        }

        public string Json(string key)
        {
            object temp = this;
            string json = "";
            if (!string.IsNullOrWhiteSpace(key))
            {
                temp = this[key];
            }
            if (temp is IEnchyma)
            {
                json += "{";
                foreach (var kv in (IEnchyma)temp)
                {
                    if (kv.Value is IEnchyma)
                    {
                        json += $"\"{kv.Key}\":{((IEnchyma)kv.Value).Json()},";
                    }
                    else if (kv.Value is string)
                    {

                        json += $"\"{kv.Key}\":\"{kv.Value.ToString()}\",";
                    }
                    else if (kv.Value is int || kv.Value is bool || kv.Value is float || kv.Value is double)
                    {

                        json += $"\"{kv.Key}\":{kv.Value.ToString().ToLower()},";
                    }
                    else
                    {
                        json += $"\"{kv.Key}\":{Newtonsoft.Json.JsonConvert.SerializeObject(kv.Value,JsonSerializerSettings)},";
                    }
                }
                json = json.TrimEnd(',') + "}";
            }
            else
            {
                json += $"{Newtonsoft.Json.JsonConvert.SerializeObject(temp, JsonSerializerSettings)}";
            }
            return json;
        }

        public string Xml(string key)
        {
            throw new NotImplementedException();
        }

        public void Set(string key, object value)
        {
            m_dictionary[key.ToLower()] = value;
        }

        public void SaveOrNot(string key, object value)
        {
            if (!m_dictionary.ContainsKey(key))
            {
                m_dictionary[key] = value;
            }
        }

        public void SetNull(string key)
        {
            m_dictionary[key.ToLower()] = null;
        }

        public object Remove(string key)
        {
            object obj = null;
            if (m_dictionary.ContainsKey(key))
            {
                m_dictionary.TryRemove(key.ToLower(), out obj);
            }
            return obj;
        }

        public IEnumerator<KeyValuePair<string, object>> GetEnumerator()
        {
            return m_dictionary.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return m_dictionary.GetEnumerator();
        }
        /// <summary>
        /// 转换成本类型的
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public T Convert<T>()
        {
            return (T)System.Activator.CreateInstance(typeof(T), this);
        }

        public IEnchyma Convert(Type type)
        {
            return System.Activator.CreateInstance(type, this) as IEnchyma;
        }

        public T TypeOf<T>(string key, T def)
        {
            try
            {
                if (this.Contains(key))
                {
                    return (T)this[key];
                }
                return def;
            }
            catch (Exception ex)
            {
                return def;
            }
        }

        public bool BooleanEx(string key)
        {
            try
            {
                if (Contains(key))
                {
                    if (this[key] is bool)
                        return (bool)this[key];
                    else
                    {
                        var t = this[key].ToString();
                        if (!"0".Equals(t) || "true".Equals(t, StringComparison.OrdinalIgnoreCase) || "t".Equals(t, StringComparison.OrdinalIgnoreCase))
                        {
                            return true;
                        }
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public string StringEx(string key)
        {
            try
            {
                if (this.Contains(key))
                {
                    return this[key].ToString();
                }
                return "";
            }
            catch (Exception ex)
            {
                return "";
            }

        }
        public string StringEx(string key, string defaultValue)
        {
            try
            {
                if (this.Contains(key))
                {
                    return this[key].ToString();
                }
                return defaultValue;
            }
            catch (Exception ex)
            {
                return defaultValue;
            }

        }

        public string Date(string key, string format)
        {
            try
            {
                var date = DateTime.Parse(this[key].ToString());
                return date.ToString(format);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
