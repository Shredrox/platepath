using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using PlatePath.API.Data.Models.Recipes;
using PlatePath.API.Singleton;

namespace PlatePath.API.Data.Models.MealPlans;

public class MealPlan
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string UserId { get; set; }
    public string Name { get; set; }
    public int Days { get; set; }
    public int MealsPerDay { get; set; }
    
    [JsonIgnore]
    public ICollection<MealPlanRecipe> MealPlanRecipes { get; set; } = new List<MealPlanRecipe>();
}

public record MealPlanResponse : BaseResponse
{
    public MealPlanResponse() { }
    public MealPlanResponse(ErrorCode error) : base(error) { }
    public MealPlan MealPlan { get; set; }
    
    public ICollection<Recipe> Recipes { get; set; }
}

public record AllMealPlansResponse : BaseResponse
{
    public AllMealPlansResponse() { }
    public AllMealPlansResponse(ErrorCode error) : base(error) { }
    public List<string> MealPlanNames { get; set; }
    public int Count { get; set; }
}