using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Organization.Scope
{
    public class RawChain
    {
        public RawChain()
        {

        }
        public RawChain(string rawString)
        {
            Parse(rawString);
        }
        public RawChain(IEnumerable<string> raws)
        {
            Parse(raws);
        }
        private List<Raw> Raws { get; set; } = new List<Raw>();
        public void Add(Raw raw)
        {
            var temp = Raws.Where(m => m.At == raw.At).FirstOrDefault();
            if (temp != null)
            {
                Raws.Remove(temp);
            }
            Raws.Add(raw);
        }

        public void Add(string text)
        {
            Raws.Add(new Raw() { Text = text, At = Raws.Count });
        }

        public void Remove()
        {
            var temp = Raws.OrderBy(m => m.At).Last();
            Raws.Remove(temp);
        }
        public void Remove(int at)
        {
            var temp = Raws.Where(m => m.At == at).FirstOrDefault();
            if (temp != null)
            {
                Raws.Remove(temp);
            }
        }

        public void Remove(string text)
        {
            var temp = Raws.Where(m => m.Text == text).FirstOrDefault();
            if (temp != null)
            {
                Raws.Remove(temp);
            }
        }

        public string Text(int at)
        {
            var temp = Raws.Where(m => m.At == at).FirstOrDefault();
            if (temp != null)
            {
                return temp.Text;
            }
            return string.Empty;
        }

        public string Text()
        {
            return Text(Current);
        }
        public int Current { get; protected set; } = -1;
        public int Count { get { return Raws.Count; } }
        public string Next()
        {
            Current += 1;
            if (Current >= Count)
            {
                return string.Empty;
            }
            return Text(Current);
        }
        public Raw NextRaw()
        {
            Current += 1;
            if (Current >= Count)
            {
                return null;
            }
            return Raws.Where(m => m.At == Current).FirstOrDefault(); ;
        }
        public void Clear()
        {
            Raws.Clear();
        }
        public void Reset()
        {
            Current = -1;
        }
        public string Previous()
        {
            Current--;
            if (Current < 0)
            {
                throw new ArgumentOutOfRangeException();
            }
            return Text(Current);
        }
        public void Sort()
        {
            Raws.OrderBy(m => m.At);
        }

        public override string ToString()
        {
            var texts = Raws.OrderBy(m => m.At).Select(m => m.Text);
            string r = "";
            foreach (var s in texts)
            {
                r += $"/{s}/";
            }
            return r;
        }

        public void Parse(IEnumerable<string> str)
        {
            foreach (var r in str)
            {
                Raws.Add(new Raw() { Text = r, At = Raws.Count });
            }
        }
        public void Parse(string rawString)
        {
            Parse(rawString.Split('/', '\\').Where(m => !string.IsNullOrWhiteSpace(m)));
        }
    }
}
