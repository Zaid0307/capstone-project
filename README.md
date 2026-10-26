# Capstone Project: GetFit!

![Header](docs/images/header.png)

Create your own workout plans whether for home training or training in the gym, with GetFit!

![WorkoutPlan](docs/images/workout-plans.png)

With GetFit! you always have your workout plans with you, no matter if you work out in the gym or at home, create your individual workout plan for every situation.

![Exercise](docs/images/exercises.png)

For newcomers GetFit! also offers a collection of exercises sorted by the 6 main muscle groups of the human body.

## Demo:

You can find the hosted version on Vercel: [Demo Version of Capstone Project](https://capstone-project-lake.vercel.app/)

**Important:** This demo is optimized for mobile screen.

## Tech Stack

- React
- React Hooks
- React Router
- React Testing Library / Jest
- JavaScript
- Storybook
- styled-components
- wger.de API
- localStorage
- npm
- Vercel

## Project Setup

- Clone this repository
- You don't need an API key
- Install all dependencies with `$ npm install`
- Run app in dev mode with `$ npm start`
- Server: [http://localhost:3000/](http://localhost:3000/)
- Run tests via `$ npm run test`
- Run Storybook with `$ npm run storybook`

## Languages

The app is available in English and German. Exercise names and descriptions come from wger in the selected language and fall back to English when no translation exists. UI texts live in `src/i18n/translations.js`.

## Project Structure

```
src/
  api/          wger REST API client and data mapping
  assets/       images used by the app
  components/
    exercises/    exercise cards and muscle group navigation
    layout/       page layout and back-to-top button
    navigation/   bottom navigation and language switch
    planForm/     forms to create and edit workout plans
    ui/           small reusable building blocks (buttons, headers, …)
    workoutPlans/ display of saved workout plans
  hooks/        useExercises (API data), useWorkoutPlans (localStorage)
  i18n/         translations and language context
  pages/        one component per route
  styles/       global styles and colors
  utils/        pure functions for workout plan data
  routes.js     all paths of the app
docs/images/    screenshots for this README
```
