namespace PlatePath.API.DTOs;

public class SetRecipeCompletionStatusRequest
{
    public int MealPlanId { get; set; }
    public int RecipeId { get; set; }
    public bool Completed { get; set; }
}