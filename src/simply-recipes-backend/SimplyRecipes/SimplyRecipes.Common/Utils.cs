namespace SimplyRecipes.Common
{
    using System;
    using System.Net;

    using Microsoft.AspNetCore.Http;

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
    }
}
