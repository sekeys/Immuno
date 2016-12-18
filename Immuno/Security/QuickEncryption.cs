using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace Immuno.Security
{
    public class QuickEncryption
    {
        #region 使用对称加密、解密

        /// <summary>
        /// 使用对称算法加密
        /// </summary>
        /// <param name="str"></param>
        /// <param name="encryptKey"></param>
        /// <returns></returns>
        public static string SymmetricEncrypts(string str, string encryptKey)
        {
            string result = string.Empty;
            byte[] inputData = System.Text.Encoding.UTF8.GetBytes(str);
            byte[] IV = { 0x77, 0x70, 0x50, 0xD9, 0xE1, 0x7F, 0x23, 0x13, 0x7A, 0xB3, 0xC7, 0xA7, 0x48, 0x2A, 0x4B, 0x39 };
            try
            {
                byte[] byKey = System.Text.Encoding.UTF8.GetBytes(encryptKey);
                //如需指定加密算法，可在Create()参数中指定字符串
                //Create()方法中的参数可以是：DES、RC2 System、Rijndael、TripleDES 
                //采用不同的实现类对IV向量的要求不一样(可以用GenerateIV()方法生成)，无参数表示用Rijndael
                SymmetricAlgorithm Algorithm = Aes.Create();//产生一种加密算法
                MemoryStream msTarget = new MemoryStream();
                //定义将数据流链接到加密转换的流。
                CryptoStream encStream = new CryptoStream(msTarget, Algorithm.CreateEncryptor(byKey, IV), CryptoStreamMode.Write);
                encStream.Write(inputData, 0, inputData.Length);
                encStream.FlushFinalBlock();
                result = Convert.ToBase64String(msTarget.ToArray());
            }
            catch (Exception)
            {
                return null;
            }
            return result;
        }


        /// <summary>
        /// 使用对称算法解密
        /// </summary>
        /// <param name="encryptStr"></param>
        /// <param name="encryptKey"></param>
        /// <returns></returns>
        public static string SymmectricDecrypts(string encryptStr, string encryptKey)
        {
            string result = string.Empty;
            //加密时使用的是Convert.ToBase64String(),解密时必须使用Convert.FromBase64String()
            try
            {
                byte[] encryptData = Convert.FromBase64String(encryptStr);
                byte[] byKey = System.Text.Encoding.UTF8.GetBytes(encryptKey);
                byte[] IV = { 0x77, 0x70, 0x50, 0xD9, 0xE1, 0x7F, 0x23, 0x13, 0x7A, 0xB3, 0xC7, 0xA7, 0x48, 0x2A, 0x4B, 0x39 };
                SymmetricAlgorithm Algorithm = Aes.Create();
                MemoryStream msTarget = new MemoryStream();
                CryptoStream decStream = new CryptoStream(msTarget, Algorithm.CreateDecryptor(byKey, IV), CryptoStreamMode.Write);
                decStream.Write(encryptData, 0, encryptData.Length);
                decStream.FlushFinalBlock();
                result = System.Text.Encoding.UTF8.GetString(msTarget.ToArray());
            }
            catch (Exception)
            {
                return null;
            }
            return result;
        }

        #endregion


    }
}
