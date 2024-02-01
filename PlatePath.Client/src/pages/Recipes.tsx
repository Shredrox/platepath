import axios, { AxiosHeaders } from "axios";
import { useEffect, useState } from "react"
import { apiUrl, useAuth } from "../components/auth";
import { Autocomplete, TextField } from "@mui/material";

type Recipe = {
  id: number;
  post: null;
  edamamId: string;
  name: string;
  kcal: number;
  servings: number;
  carbohydrates: number;
  fats: number;
  protein: number;
  ingredientLines: string;
  imageURL: string;
  finished: boolean;
};

const Recipes = () => {
  const { getToken } = useAuth();

  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [servings, setServings] = useState('');
  const [carbohydrates, setCarbohydrates] = useState('');
  const [fats, setFats] = useState('');
  const [protein, setProtein] = useState('');
  const [ingredientLines, setIngredientLines] = useState('');

  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [names, setNames] = useState([]);
  const [selectedMealPlan, setSelectedMealPlan] = useState<string | null>('');

  useEffect(() => {
    const getNames = () => {
      const token = getToken();
      const myHeaders = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      });
      fetch(`${apiUrl}/MealPlans/getAll`, {
        method: "GET",
        headers: myHeaders,
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.mealPlanNames) {
            setNames(res.mealPlanNames);
          }
        })
        .catch((err) => alert(err));
    };

    getNames();
  }, []);

  useEffect(() => {
    const getUserRecipes = async () =>{
      const token = getToken();

      const response = await axios.get(`${apiUrl}/Recipe/all-custom`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCustomRecipes(response.data);
    }

    getUserRecipes();
  }, [])

  const mealPlaneChange = (e: React.SyntheticEvent<Element, Event>) =>{
    const target = e.target as HTMLLIElement;
    setSelectedMealPlan(target.textContent);
  }

  const handleAddToMealPlan = async (recipeId: number) =>{
    const token = getToken();

    const response = await axios.post(`${apiUrl}/MealPlans/recipeAdd`,{
      mealPlanName: selectedMealPlan,
      recipeId: recipeId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setSelectedMealPlan('');
    window.location.reload();
  }

  const handleSubmit = async () =>{
    const newRecipe = {
      name: name,
      kcal: Number(kcal),
      servings: Number(servings),
      carbohydrates: Number(carbohydrates),
      fats: Number(fats),
      protein: Number(protein),
      ingredientLines: ingredientLines
    }

    const token = getToken();

    const response = await axios.post(`${apiUrl}/Recipe/create`, newRecipe, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    window.location.reload();
  }

  return (
    <div className='recipes-page'>
      <div className="create-recipe-form">
        <h2>Create Recipe</h2>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          type="text" 
          name="name" 
          placeholder='Name' />
        <input 
          value={kcal} 
          onChange={(e) => setKcal(e.target.value)}
          type="text" 
          name="kcal" 
          placeholder='Kcal' />
        <input 
          value={servings} 
          onChange={(e) => setServings(e.target.value)} 
          type="text" 
          name="servings" 
          placeholder='Servings' />
        <input 
          value={carbohydrates} 
          onChange={(e) => setCarbohydrates(e.target.value)}
          type="text" 
          name="carbohydrates" 
          placeholder='Carbohydrates' />
        <input 
          value={fats} 
          onChange={(e) => setFats(e.target.value)} 
          type="text" 
          name="fats" 
          placeholder='Fats' />
        <input 
          value={protein} 
          onChange={(e) => setProtein(e.target.value)} 
          type="text" 
          name="protein" 
          placeholder='Protein' />
        <input 
          value={ingredientLines} 
          onChange={(e) => setIngredientLines(e.target.value)} 
          type="text" 
          name="ingredientLines" 
          placeholder='Ingredients' />

        <button onClick={handleSubmit}>Create Recipe</button>
      </div>
      <div className="custom-recipes-list">
        <h3>Custom Recipes</h3>
        {customRecipes.map((recipe) =>(
          <div className="custom-recipe" key={recipe.id}>
            <div className="recipe-info">
              <span>Name: {recipe.name}</span> 
              <span>Kcal: {recipe.kcal}</span> 
              <span>Servings: {recipe.servings}</span> 
              <span>Carbohydrates: {recipe.carbohydrates}</span> 
              <span>Fats: {recipe.fats}</span> 
              <span>Protein: {recipe.protein}</span> 
            </div>
            <span>Ingredients: {recipe.ingredientLines}</span> 
            <div className="meal-add-container">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={names}
                onChange={(e) => mealPlaneChange(e)}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Meal Plans" />}
              />
              <button onClick={() => handleAddToMealPlan(recipe.id)}>Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Recipes
