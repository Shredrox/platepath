using Microsoft.EntityFrameworkCore;
using PlatePath.API.Data;
using PlatePath.API.Data.Models.MealPlans;
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
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();
        }

        public IQueryable<Recipe> GetUserRecipes(string? userId)
        {
            return _context.Recipes.Where(r => r.UserId == userId);
        }

        public async Task AddRecipeToMealPlan(MealPlanRecipeAddRequest request, string? userId)
        {
            var mealPlan = await _context.MealPlans
                .Include(m => m.MealPlanRecipes)
                .SingleOrDefaultAsync(m => m.Name == request.MealPlanName && m.UserId == userId);
            
            if (mealPlan != null)
            {
                var existingRecipe = mealPlan.MealPlanRecipes
                    .FirstOrDefault(r => r.RecipeId == request.RecipeId);
                
                if (existingRecipe == null)
                {
                    var recipe = await _context.Recipes
                        .SingleAsync(r => r.Id == request.RecipeId);

                    var newRecipe = new MealPlanRecipe(mealPlan.Id, recipe.Id);
                    
                    mealPlan.MealPlanRecipes.Add(newRecipe);
                    
                    await _context.SaveChangesAsync();
                }
            }
        }
    }
}
