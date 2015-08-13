using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Runtime.Serialization;
using System.IO;
using System.Xml.Serialization;
using OnlineTests.Common.Contracts.Repositories;
using OnlineTests.Common.Models;
using System.Xml;

namespace OnlineTests.Common.Helpers
{
    public class Serializer
    {
        public static string Serialize(object source)
        {
            string xml;

            var serializer = new DataContractSerializer(source.GetType());

            using (var backing = new System.IO.StringWriter())
            {
                using (var writer = new System.Xml.XmlTextWriter(backing))
                {
                    serializer.WriteObject(writer, source);
                    xml = backing.ToString();
                }
            }
            return xml.Replace(" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns=\"http://schemas.datacontract.org/2004/07/OnlineTests.Common.Models\"", "");
        }

        public static T Deserialize<T>(string xml)
        {
            T result;
            XmlSerializerFactory serializerFactory = new XmlSerializerFactory();
            XmlSerializer serializer = serializerFactory.CreateSerializer(typeof(T));

            using (StringReader sr3 = new StringReader(xml))
            {
                XmlReaderSettings settings = new XmlReaderSettings()
                {
                    CheckCharacters = false // default value is true;
                };

                using (XmlReader xr3 = XmlTextReader.Create(sr3, settings))
                {
                    result = (T)serializer.Deserialize(xr3);
                }
            }

            return result;
        }
    }
}
