using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PlatePath.API.Data.Models.Recipes;
using PlatePath.API.DTOs;
using PlatePath.API.Services;

namespace PlatePath.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [HttpGet("all-custom")]
        [Authorize(Roles = "User")]
        public IActionResult GetUserCustomRecipes()   
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            return Ok(_recipeService.GetUserRecipes(userId).ToList());
        }
        
        [HttpPut("{id:int}/finish")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> FinishRecipe(int id)   
        {
            await _recipeService.FinishRecipe(id);
            return Ok("Recipe marked as finished");
        }

        [HttpPost("create")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> CreateRecipe([FromBody] RecipeDTO request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            await _recipeService.CreateCustomRecipe(request, userId);
            return Ok("Recipe created");
        }
    }
}
