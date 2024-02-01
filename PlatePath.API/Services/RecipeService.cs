using Microsoft.EntityFrameworkCore;
using PlatePath.API.Data;
using PlatePath.API.Data.Models.Recipes;
using PlatePath.API.DTOs;

namespace PlatePath.API.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly ApplicationDbContext _context;

        public RecipeService(ApplicationDbContext context)
        {
            _context = context;
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

        public IQueryable<Recipe> GetUserRecipes(string? userId)
        {
            return _context.Recipes.Where(r => r.UserId == userId);
        }

        public async Task AddRecipeToMealPlan(MealPlanRecipeAddRequest request, string? userId)
        {
            var mealPlan = await _context.MealPlans
                .Include(m => m.Meals)
                .SingleOrDefaultAsync(m => m.Name == request.MealPlanName && m.UserId == userId);

            if (mealPlan != null)
            {
                var existingRecipe = mealPlan.Meals
                    .FirstOrDefault(r => r.Id == request.RecipeId);
                
                if (existingRecipe == null)
                {
                    mealPlan.Meals.Add(await _context.Recipes
                        .SingleAsync(r => r.Id == request.RecipeId));
                    
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
