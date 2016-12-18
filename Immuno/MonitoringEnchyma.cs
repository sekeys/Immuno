using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno
{
    public class MonitoringEnchyma : Enchyma, IEnchyma, IModelMonitoring
    {
        protected bool isChanged { get; set; } = false;
        protected bool isAppended { get; set; } = false;
        public new object this[string index]
        {
            get
            {
                return base[index];
            }
            set
            {
                if (Contains(index))
                {
                    base[index] = value;
                    isChanged = true;
                }
                else
                {

                    base[index] = value;
                    isAppended = true;
                    isChanged = true;
                }

            }
        }
        public new void Set(string key, object value)
        {
            m_dictionary[key] = value;

        }

        public void SaveOrNot(string key, object value)
        {
            if (!m_dictionary.ContainsKey(key))
            {
                m_dictionary[key] = value;
            }
        }

        public new void SetNull(string key)
        {
            m_dictionary[key] = null;
            isChanged = true;
        }

        public object Remove(string key)
        {
            object obj = null;
            if (m_dictionary.ContainsKey(key))
            {
                if (m_dictionary.TryRemove(key, out obj)) { isChanged = true; }
            }
            return obj;
        }
        public void ResetModifyStatus()
        {
            isChanged = false;
            isAppended = false;
        }
        public bool IsModified
        {
            get
            {
                return isChanged;
            }
        }
        public bool IsAppended
        {
            get
            {
                return isAppended;
            }
        }
    }
}
