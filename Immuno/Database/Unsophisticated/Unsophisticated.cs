using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Immuno.Database.Unsophisticated
{
    using System.Data;
    using System.Data.SqlClient;
    public class Unsophisticated
    {
        public static string ConnectionString { get; set; }

        public static IEnchyma Query(string sql)
        {
            return Query(sql, CommandType.Text);
        }
        public static IEnchyma Query(string sql, CommandType cmdType
            , System.Data.CommandBehavior behavior = CommandBehavior.CloseConnection)
        {
            IEnchyma enc = new Enchyma();
            enc.Result = true;
            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = sql;
                    cmd.CommandType = cmdType;

                    using (SqlDataReader sdr = cmd.ExecuteReader(behavior))
                    {
                        List<string> fields = new List<string>();

                        var j = 0;
                        while (sdr.Read())
                        {
                            var entity = new Enchyma();
                            for (var i = 0; i < sdr.FieldCount; i++)
                            {
                                entity.Set(sdr.GetName(i), sdr[i]);
                            }
                            enc.Set(j.ToString(), entity);
                            j++;
                        }
                        enc.Result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                enc.Result = false;
                enc.Set("exception", ex);
            }
            return enc;
        }

        public static IEnchyma One(string sql)
        {
            return One(sql, CommandType.Text);
        }
        public static IEnchyma One(string sql, CommandType cmdType
            , System.Data.CommandBehavior behavior = CommandBehavior.SingleRow)
        {
            IEnchyma enc = new Enchyma();
            enc.Result = true;
            try
            {
                enc.Result = true;
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = sql;
                    cmd.CommandType = cmdType;

                    using (SqlDataReader sdr = cmd.ExecuteReader(behavior))
                    {
                        List<string> fields = new List<string>();

                        while (sdr.Read())
                        {
                            for (var i = 0; i < sdr.FieldCount; i++)
                            {
                                enc.Set(sdr.GetName(i), sdr[i]);
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                enc.Result = false;
                enc.Set("exception", ex);
            }
            return enc;
        }
        public static IEnchyma NonQuery(string sql, CommandType cmdType = CommandType.Text)
        {
            IEnchyma enc = new Enchyma();
            enc.Result = true;
            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = sql;
                    cmd.CommandType = cmdType;
                    enc.Set("response", cmd.ExecuteNonQuery());
                    enc.Result = true;
                }
            }
            catch (Exception ex)
            {
                enc.Result = false;
                enc.Set("exception", ex);
            }
            return enc;
        }
        public static IEnchyma Scalar(string sql, CommandType cmdType = CommandType.Text)
        {
            IEnchyma enc = new Enchyma();
            enc.Result = true;
            try
            {
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    conn.Open();
                    var cmd = conn.CreateCommand();
                    cmd.CommandText = sql;
                    cmd.CommandType = cmdType;
                    enc.Set("response", cmd.ExecuteScalar());
                    enc.Result = true;
                }
            }
            catch (Exception ex)
            {
                enc.Result = false;
                enc.Set("exception", ex);
            }
            return enc;
        }
        public static SqlConnection Connection
        {
            get
            {
                return new SqlConnection(ConnectionString);
            }
        }

        public static SqlCommand Command
        {
            get
            {
                var conn = Connection;
                conn.Open();
                return conn.CreateCommand();
            }
        }
    }
}
