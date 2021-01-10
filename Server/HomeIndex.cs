using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using System.Threading;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;

namespace Server
{
    public static class HomeIndex
    {
        [FunctionName("HomeIndex")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            if (req.Headers.Keys.Contains("Authorization"))
            {
                var token = req.Headers["Authorization"].ToString();
                token = token.Split("Bearer ")[1];

                const string auth0Domain = Constants.Auth0Domain; // Your Auth0 domain
                const string auth0Audience = Constants.Audience; // Your API Identifier

                try
                {
                    // Download the OIDC configuration which contains the JWKS
                    // NB!!: Downloading this takes time, so do not do it very time you need to validate a token, Try and do it only once in the lifetime
                    //     of your application!!
                    IConfigurationManager<OpenIdConnectConfiguration> configurationManager = new ConfigurationManager<OpenIdConnectConfiguration>($"{auth0Domain}.well-known/openid-configuration", new OpenIdConnectConfigurationRetriever());
                    OpenIdConnectConfiguration openIdConfig = AsyncHelper.RunSync(async () => await configurationManager.GetConfigurationAsync(CancellationToken.None));

                    // Configure the TokenValidationParameters. Assign the SigningKeys which were downloaded from Auth0. 
                    // Also set the Issuer and Audience(s) to validate
                    TokenValidationParameters validationParameters =
                        new TokenValidationParameters
                        {
                            ValidIssuer = auth0Domain,
                            ValidAudiences = new[] { auth0Audience },
                            IssuerSigningKeys = openIdConfig.SigningKeys
                        };

                    // Now validate the token. If the token is not valid for any reason, an exception will be thrown by the method
                    SecurityToken validatedToken;
                    JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
                    var user = handler.ValidateToken(token, validationParameters, out validatedToken);
                    Console.WriteLine(validatedToken);
                    // The ValidateToken method above will return a ClaimsPrincipal. Get the user ID from the NameIdentifier claim
                    // (The sub claim from the JWT will be translated to the NameIdentifier claim)
                    Console.WriteLine($"Token is validated. User Id {user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value}");
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error occurred while validating token: {e.Message}");
                    throw;
                }
            }

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            string responseMessage = string.IsNullOrEmpty(name)
                ? "The function is working."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(new {responseMessage = responseMessage});
        }
    }

    internal static class AsyncHelper
    {
        private static readonly TaskFactory TaskFactory = new TaskFactory(CancellationToken.None, TaskCreationOptions.None, TaskContinuationOptions.None, TaskScheduler.Default);

        public static void RunSync(Func<Task> func)
        {
            TaskFactory.StartNew(func).Unwrap().GetAwaiter().GetResult();
        }

        public static TResult RunSync<TResult>(Func<Task<TResult>> func)
        {
            return TaskFactory.StartNew(func).Unwrap().GetAwaiter().GetResult();
        }
    }
}
