using System.ComponentModel.DataAnnotations;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace didaktos.backend.Controllers
{
    [ApiController]
    [Route("api/assistant")]
    public class AssistantAIController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AssistantAIController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = config["Gemini:ApiKey"]!;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateContent([FromBody] GeminiPrompt prompt)
        {
            var fullRequest = "";
            if (prompt.Choice == "Question")
            {
                fullRequest =
                    "Do not add any introduction or commentary. Identify the most important key points and  return 5 to 10 questions that someone should be able to answer if they understand the material in the following text:"
                    + prompt.Text;
            }
            else if (prompt.Choice == "Summary")
            {
                fullRequest =
                    "Do not add any introduction or commentary. Extract the most important key points and create a summary.Make the summary about 1/3 of the original text length. Only include the core ideas. Text:"
                    + prompt.Text;
            }
            else if (prompt.Choice == "Schedule")
            {
                fullRequest =
                    "Do not add any introduction or commentary. Create a schedule using a time frame that a college student could learn all the material in the following lesson. Text:"
                    + prompt.Text;
            }
            else
            {
                return BadRequest();
            }

            var url =
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

            var requestBody = new
            {
                contents = new[] { new { parts = new[] { new { text = fullRequest } } } },
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Post, $"{url}?key={_apiKey}");
            request.Content = content;

            var response = await _httpClient.SendAsync(request);

            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, responseBody);

            return Ok(JsonDocument.Parse(responseBody));
        }
    }

    public class GeminiPrompt
    {
        public required string Text { get; set; }
        public string Choice { get; set; } = string.Empty;
    }
}
