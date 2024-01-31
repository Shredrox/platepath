
using Microsoft.EntityFrameworkCore;
using PlatePath.API.Clients;
using PlatePath.API.Data;
using PlatePath.API.Data.Models.Recipes;
using PlatePath.API.DTOs;

namespace PlatePath.API.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly ApplicationDbContext _context;
        readonly IEdamamClient _edamamClient;

        public RecipeService(ApplicationDbContext context, IEdamamClient edamamClient)
        {
            _context = context;
            _edamamClient = edamamClient;
        }

        public async Task CreateCustomRecipe(RecipeDTO request, string? userId)
        {
            var recipe = new Recipe
            {
                Name = request.Name,
                Kcal = request.Kcal,
                Servings = request.Servings,
                UserId = userId,
                IngredientLines = request.IngredientLines,
                Carbohydrates = request.Carbohydrates,
                Fats = request.Fats,
                Protein = request.Protein,
                Finished = false
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
        }

        public async Task FinishRecipe(int id)
        {
            var recipe = await _context.Recipes.SingleOrDefaultAsync(r => r.Id == id);
            if (recipe == null)
            {
                return;
            }
            recipe.Finished = !recipe.Finished;
            await _context.SaveChangesAsync();
        }

        public List<Recipe> GetUserRecipes(string? userId)
        {
            return _context.Recipes.Where(r => r.UserId == userId).ToList();
        }
    }
}
