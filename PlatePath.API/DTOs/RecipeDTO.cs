namespace PlatePath.API.DTOs
{
    public class RecipeDTO
    {
        public string Name { get; set; }

        public int Kcal { get; set; }

        public int Servings { get; set; }

        public int Carbohydrates { get; set; }

        public int Fats { get; set; }

        public int Protein { get; set; }

        public string IngredientLines { get; set; }
    }
}
