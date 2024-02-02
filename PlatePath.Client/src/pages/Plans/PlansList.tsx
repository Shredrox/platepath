//@ts-nocheck
//Sorry for the people that are going to look at this code.
import { useEffect, useState } from "react";
import { BoxContainer, Columns } from "../../components";
import {
  Typography,
  Autocomplete,
  TextField,
  Divider,
  Checkbox,
} from "@mui/material";
import { apiUrl, useAuth } from "../../components/auth";

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
};
interface MealPlan {
  id: number;
  recipes: Recipe[];
}

const PlansList = ({
                     names,
                     getNames,
                   }: {
  names: string[];
  getNames: () => void;
}) => {
  const { getToken } = useAuth();
  const [meal, setMeal] = useState<MealPlan>({ id: -1, recipes: [] });
  const [recipe, setRecipe] = useState<Recipe>();
  useEffect(() => {
    getNames();
  }, []);
  const onSelect = (e: React.SyntheticEvent<Element, Event>) => {
    const target = e.target as HTMLLIElement;
    setRecipe(undefined);
    const token = getToken();
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    fetch(`${apiUrl}/MealPlans/${target.textContent}`, {
      method: "GET",
      headers: myHeaders,
    })
        .then((r) => r.json())
        .then((res) => {
          console.log(res);
          if (res.mealPlan) {
            setMeal({ ...res.mealPlan, recipes: res.recipes });
          }
        })
        .catch((err) => alert(err));
  };
  const onSelectRecipe = (e: React.SyntheticEvent<Element, Event>) => {
    const token = getToken();
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    const target = e.target as HTMLLIElement;
    console.log(target);
    const recipe = meal.recipes.find((obj) => obj.name === target.textContent);
    if (recipe) {
      fetch(
          `${apiUrl}/MealPlans/getMealCompletionStatuses?mealPlanId=${meal.id}`,
          {
            method: "GET",
            headers: myHeaders,
          }
      )
          .then((r) => r.json())
          .then((res) => {
            const responseRecipe = res.find((obj) => obj.recipeId === recipe.id);
            const r = { ...recipe, completed: responseRecipe.isCompleted };
            setRecipe({
              ...r,
              ingredientLines: recipe.ingredientLines.replaceAll("&&", "\n"),
            });
          })
          .catch((err) => alert(err));
    }
  };
  return (
      <>
        <BoxContainer
            gap="30px"
            sx={{
              justifyContent: "flex-start",
            }}
        >
          <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={names}
              onChange={(e) => onSelect(e)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Meal Plans" />}
          />

          {meal.recipes.length ? (
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={meal.recipes}
                  onChange={(e) => onSelectRecipe(e)}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Recipes" />}
                  getOptionLabel={(option: Recipe) => option.name}
              />
          ) : null}
        </BoxContainer>

        <Divider sx={{ my: "10px" }} />
        {recipe ? (
            <>
              <BoxContainer gap="5px" alignItems="center">
                Completed{" "}
                <Checkbox
                    checked={recipe.completed}
                    onClick={(e) => {
                      const token = getToken();
                      const myHeaders = new Headers({
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      });
                      fetch(`${apiUrl}/MealPlans/setMealCompletionStatus`, {
                        method: "PUT",
                        headers: myHeaders,
                        body: JSON.stringify({
                          mealPlanId: meal.id,
                          recipeId: recipe.id,
                          completed: !recipe.completed,
                        }),
                      })
                          .then(() => {
                            setRecipe({ ...recipe, completed: !recipe.completed });
                          })
                          .catch((err) => alert(err));
                    }}
                />
              </BoxContainer>
              <BoxContainer
                  sx={{
                    justifyContent: "flex-start",
                    width: "100%",
                  }}
              >
                <img
                    src={recipe.imageURL}
                    alt="meal img"
                    width="250px"
                    height="250px"
                />
                <Columns gap="7px" ml="15px">
                  <Typography variant="h6">Calories: {recipe.kcal}kcal</Typography>
                  <Typography variant="h6">Fats: {recipe.fats}g</Typography>
                  <Typography variant="h6">
                    Carbohydrates: {recipe.carbohydrates}g
                  </Typography>
                  <Typography variant="h6">Protein: {recipe.protein}g</Typography>
                </Columns>
              </BoxContainer>
              <Columns
                  sx={{
                    alignItems: "flex-start",
                    width: "100%",
                    whiteSpace: "pre-line",
                    maxHeight: "500px",
                    overflow: "scroll",
                  }}
              >
                <Columns mb="20px">
                  <Typography variant="h5">Needed Ingredients</Typography>
                  <Divider />
                </Columns>
                <Typography variant="h6" fontStyle="italic">
                  {recipe.ingredientLines}
                </Typography>
              </Columns>
            </>
        ) : null}
        {/* <BoxContainer
        sx={{
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "100%",
          gap: "30px",
          "&>div": {
            flex: "1 1 160px",
          },
        }}
      >
        
        {plans.map((plan, i) => (
          <PlanCard {...plan} key={i} />
        ))}
      </BoxContainer> */}
      </>
  );
};
export default PlansList;