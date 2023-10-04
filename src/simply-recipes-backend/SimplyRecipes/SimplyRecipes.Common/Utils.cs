namespace SimplyRecipes.Common
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Text.RegularExpressions;

    using AngleSharp.Html.Parser;
    using Microsoft.AspNetCore.Http;

    using SimplyRecipes.Data.Models;

    public static class Utils
    {
        public static string GetIpAddress(IHeaderDictionary headers, IPAddress remoteIpAddress)
        {
            if (headers.ContainsKey("X-Forwarded-For"))
            {
                return headers["X-Forwarded-For"];
            }
            else
            {
                return remoteIpAddress?.MapToIPv4().ToString();
            }
        }

        public static CookieOptions CreateTokenCookie(int refreshTokenExpiration)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(refreshTokenExpiration),
                SameSite = SameSiteMode.None,
                Secure = true
            };

            return cookieOptions;
        }

        public static string GetSearchText(Article article)
        {
            // Get only text from content
            var parser = new HtmlParser();
            var document = parser.ParseDocument($"<html><body>{article.Description}</body></html>");

            StringBuilder result = new StringBuilder();

            // Append title
            result.Append(article.Title + " " + document.Body.TextContent);
            var text = result.ToString().ToLower();

            // Remove all non-alphanumeric characters
            var regex = new Regex(@"[^\w\d]", RegexOptions.Compiled);
            text = regex.Replace(text, " ");

            // Split words and remove duplicate values
            var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries).Distinct();

            // Combine all words
            return string.Join(" ", words);
        }

        public static string GenerateLoremIpsum(int minWords, int maxWords,
            int minSentences, int maxSentences, int numParagraphs)
        {
            var words = new[]{"lorem", "ipsum", "dolor", "sit", "amet", "consectetuer",
                "adipiscing", "elit", "sed", "diam", "nonummy", "nibh", "euismod",
                "tincidunt", "ut", "laoreet", "dolore", "magna", "aliquam", "erat"};

            var rand = new Random();
            int numSentences = rand.Next(maxSentences - minSentences) + minSentences + 1;
            int numWords = rand.Next(maxWords - minWords) + minWords + 1;

            StringBuilder result = new StringBuilder();

            for (int p = 0; p < numParagraphs; p++)
            {
                result.Append("<p>");
                for (int s = 0; s < numSentences; s++)
                {
                    for (int w = 0; w < numWords; w++)
                    {
                        if (w > 0)
                        {
                            result.Append(" ");
                        }

                        result.Append(words[rand.Next(words.Length)]);
                    }
                    result.Append(". ");
                }
                result.Append("</p>");
            }

            return result.ToString();
        }
    }
}
