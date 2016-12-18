
namespace Immuno.Database
{
    using System.IO;
    using System.Collections.Generic;
    using System.Collections;
    using System.Linq;
    public class FileDb
    {

        public static IEnchyma Read(string path, bool containsHead = true, char seqChar = '\t')
        {
            Enchyma enchyma = new Enchyma();
            if (File.Exists(path))
            {
                string[] contents = File.ReadAllLines(path).Where(m => !string.IsNullOrWhiteSpace(m)).ToArray();
                if (contents.Length > 0)
                {
                    var headers = contents[0].Split(seqChar).Where(m => !string.IsNullOrWhiteSpace(m)).ToArray();
                    var pos = 1; var l = 1;
                    if (!containsHead)
                    {
                        for (var i = 0; i < headers.Length; i++)
                        {
                            headers[i] = $"Column{i}";
                        }
                        pos = l = 0;
                    }
                    for (; pos < contents.Length; pos++, l++)
                    {
                        var values = contents[pos].Split(seqChar);
                        if (values.Length != headers.Length)
                        {
                            throw new System.Exception("文件的列头与列值不一致");
                        }
                        var entity = new Enchyma();
                        for (var i = 0; i < headers.Length; i++)
                        {
                            entity.Set(headers[i], values[i]);
                        }
                        enchyma.Set(l.ToString(), entity);
                    }
                }
            }
            return enchyma;
        }

        public static IEnchyma Read(string path, IEnumerable<string> headers, char seqChar = '\t')
        {
            Enchyma enchyma = new Enchyma();
            if (File.Exists(path))
            {
                string[] contents = File.ReadAllLines(path).Where(m => !string.IsNullOrWhiteSpace(m)).ToArray();
                if (contents.Length > 0)
                {
                    var length = headers.Count();
                    for (var pos = 0; pos < contents.Length; pos++)
                    {
                        var values = contents[pos].Split(seqChar);
                        if (values.Length != length)
                        {
                            throw new System.Exception("文件的列头与列值不一致");
                        }
                        var entity = new Enchyma();
                        for (var i = 0; i < length; i++)
                        {
                            entity.Set(headers.ElementAt(i), values[i]);
                        }
                        enchyma.Set(pos.ToString(), entity);
                    }
                }
            }
            return enchyma;
        }
        public static void Write(string path, IEnchyma enchyma, bool containsHead, char seqChar = '\t')
        {
            using (StreamWriter sw = new StreamWriter(File.OpenWrite(path)))
            {
                var list = enchyma.List;
                if (list.Count == 0)
                {
                    throw new System.Exception("不存在相关的数据");
                }
                List<string> headers = new List<string>();
                foreach (var header in list.TypeOf<IEnchyma>("0").Keys)
                {
                    sw.Write(header + "\t");
                    headers.Add(header);
                }
                sw.WriteLine();
                var hlength = headers.Count;
                foreach (var k in list)
                {
                    IEnchyma entity = k.Value as IEnchyma;
                    if (entity == null) { continue; }
                    for (var i = 0; i < hlength; i++)
                    {
                        if (entity.Contains(headers[hlength]))
                        {
                            sw.Write(entity.String(headers[hlength])+"\t");
                        }
                        else
                        {
                            sw.Write( "\t");
                        }
                    }
                    sw.WriteLine();
                }
            }
        }
        public static void Write(string path, IEnchyma enchyma, IEnumerable<string> headers, char seqChar = '\t')
        {

            using (StreamWriter sw = new StreamWriter(File.OpenWrite(path)))
            {
                var list = enchyma.List;
                if (list.Count == 0)
                {
                    throw new System.Exception("不存在相关的数据");
                }
                var hlength = headers.Count();
                foreach (var k in list)
                {
                    IEnchyma entity = k.Value as IEnchyma;
                    if (entity == null) { continue; }
                    for (var i = 0; i < hlength; i++)
                    {
                        if (entity.Contains(headers.ElementAt(hlength)))
                        {
                            sw.Write(entity.String(headers.ElementAt(hlength)) + "\t");
                        }
                        else
                        {
                            sw.Write("\t");
                        }
                    }
                    sw.WriteLine();
                }
            }
        }


        public static void Append(string path, bool containsHead, char seqChar = '\t')
        {
            //using (StringWriter sw = new StreamWriter(File.OpenWrite(path)))
            //{
            //    File.AppendAllLines()
            //}
        }
        public static void Append(string path, string header, char seqChar = '\t')
        {
        }

    }
}
