import { useLocalStorage } from 'usehooks-ts';

export const FIGURES = ['male', 'female'];

// Which figure the app shows for muscles and animations. Chosen in the settings
// and switchable at the figure itself; remembered in this browser.
export default function useFigure() {
  return useLocalStorage('figure', 'male');
}
