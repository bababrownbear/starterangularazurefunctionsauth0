using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace Server
{
    public static class Constants
    {
        public const string Auth0Domain = "https://###REPLACEWITHNAME###.us.auth0.com/";
        public const string Audience = "https://###REPLACEWITHNAME###.us.auth0.com/api/v2/";
    }
}