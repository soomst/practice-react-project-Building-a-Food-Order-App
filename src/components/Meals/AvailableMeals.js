import MealItem from "./MealItem";

import Card from "../UI/Card";
import classes from "./AvailableMeals.module.css";
import { useEffect } from "react";
import useHttp from "../../hooks/use-http";


const AvailableMeals = () => {
  const {
    data : meals,
    isLoading : isLoading,
    error : error,
    sendRequest
  } = useHttp();

  useEffect(() => {
    sendRequest('meals');
  }, []);

  const mealsList = meals
    ? Object.keys(meals).map((id) => (
      <MealItem
        key={id}
        id={id}
        name={meals[id].name}
        description={meals[id].description}
        price={meals[id].price}
      />))
    : null

  if (isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={classes.MealsError}>
        <p>{error}</p>
      </section>
    )
  }

  return (
    <section className={classes.meals}>
      <Card>
        <ul>
          {mealsList}
        </ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
