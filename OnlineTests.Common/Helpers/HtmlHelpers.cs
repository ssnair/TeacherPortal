using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace OnlineTests.Common.Helpers
{
    public static class ccpsHtmlHelper
    {
        // positive look behind for ">", one or more whitespace (non-greedy), positive lookahead for "<"
        private static readonly Regex InsignificantHtmlWhitespace = new Regex(@"(?<=>)\s+?(?=<)");

        // Known not to handle HTML comments or CDATA correctly, which we don't use.
        public static string RemoveInsignificantHtmlWhiteSpace(string html)
        {
            return InsignificantHtmlWhitespace.Replace(html, String.Empty).Trim();
        }
    }
}
