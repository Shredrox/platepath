using PlatePath.API.Data.Models.Recipes;
using PlatePath.API.DTOs;

namespace PlatePath.API.Services
{
    public interface IRecipeService
    {
        Task CreateCustomRecipe(RecipeDTO request, string? userId);
        IQueryable<Recipe> GetUserRecipes(string? userId);
        Task AddRecipeToMealPlan(MealPlanRecipeAddRequest request, string? userId);
    }
}
