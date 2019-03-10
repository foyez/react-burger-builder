import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredients from './BurgerIngredients/BurgerIngredients';

const Burger = props => {
  let transformedIngredients = Object.keys(props.ingredients)
    .map(igKey => {
      return [...Array(props.ingredients[igKey])]
        .map((_, i) => <BurgerIngredients key={ igKey + i } type={ igKey } />)
    })
    .reduce((arr, el) => arr.concat(el), []);
  console.log(transformedIngredients);

  if (!transformedIngredients.length) {
    transformedIngredients = <p>Please start adding ingredients!</p>;
  }

  return (
    <div className={ classes.Burger }>
      <BurgerIngredients type="bread-top" />
      {/* <BurgerIngredients type="cheese" />
      <BurgerIngredients type="meat" /> */}
      { transformedIngredients }
      <BurgerIngredients type="bread-bottom" />
    </div>
  )
}

export default Burger;