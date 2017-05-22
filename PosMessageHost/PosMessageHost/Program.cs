using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace PosMessageHost
{
    class Program
    {
        // TODO: Add these in configuration during install or let the chrome extension send them
        const int _port = 8765;
        const string _server = "192.168.100.10";

        // Reading and writing to the Console IO taken from:
        // https://stackoverflow.com/questions/30880709/c-sharp-native-host-with-chrome-native-messaging
        static void Main(string[] args)
        {
            JObject data = Read();

            var processed = ProcessMessage(data);
            Write(processed);
        }

        public static string ProcessMessage(JObject clientData)
        {
            var message = clientData.ToString(Formatting.None);

            byte[] data = Encoding.ASCII.GetBytes(message);

            var sock = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            sock.Connect(IPAddress.Parse(_server), _port);

            int r = sock.Send(data);

            var receivedData = new byte[256];

            int bytes = sock.Receive(receivedData);
            return Encoding.ASCII.GetString(receivedData, 0, bytes);
        }

        public static JObject Read()
        {
            var stdin = Console.OpenStandardInput();
            var length = 0;

            var lengthBytes = new byte[4];
            stdin.Read(lengthBytes, 0, 4);
            length = BitConverter.ToInt32(lengthBytes, 0);

            var buffer = new char[length];
            using (var reader = new StreamReader(stdin))
            {
                while (reader.Peek() >= 0)
                {
                    reader.Read(buffer, 0, buffer.Length);
                }
            }

            return JsonConvert.DeserializeObject<JObject>(new string(buffer));
        }

        public static void Write(JToken data)
        {
            var json = new JObject
            {
                ["data"] = data
            };

            var bytes = Encoding.UTF8.GetBytes(json.ToString(Formatting.None));

            var stdout = Console.OpenStandardOutput();
            stdout.WriteByte((byte)((bytes.Length >> 0) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 8) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 16) & 0xFF));
            stdout.WriteByte((byte)((bytes.Length >> 24) & 0xFF));
            stdout.Write(bytes, 0, bytes.Length);
            stdout.Flush();
        }
    }
}