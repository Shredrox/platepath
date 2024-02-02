using System.Text.Json.Serialization;
using PlatePath.API.Data.Models.Recipes;

namespace PlatePath.API.Data.Models.MealPlans;

public class MealPlanRecipe
{
    public MealPlanRecipe(int mealPlanId, int recipeId)
    {
        MealPlanId = mealPlanId;
        RecipeId = recipeId;
    }
    
    public int MealPlanId { get; set; }
    
    [JsonIgnore]
    public MealPlan MealPlan { get; set; }

    public int RecipeId { get; set; }
    
    [JsonIgnore]
    public Recipe Recipe { get; set; }

    public bool IsCompleted { get; set; }
}