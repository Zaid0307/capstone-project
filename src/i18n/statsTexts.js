// Texts of one work area, kept in their own file so that several people can work
// in parallel without touching translations.js. Same rules: every key in both
// languages. Merged in translations.js.
const statsTexts = {
  en: {
    'stats.planEditor.groupLegend':
      'Main muscle = 1 set, supporting muscle = ½ set; per set a group counts once with its highest share. Own exercises count fully for their chosen group. Stretching, mobility and cardio are not counted.',
    'stats.streak.targetRule':
      'Goal: the most training days per week among your active strength plans. Every workout of an active plan counts, free workouts too.',
  },
  de: {
    'stats.planEditor.groupLegend':
      'Hauptmuskel = 1 Satz, Hilfsmuskel = ½ Satz; pro Satz zählt eine Gruppe einmal mit dem höchsten Anteil. Eigene Übungen zählen voll für ihre gewählte Gruppe. Dehnen, Mobility und Cardio zählen nicht.',
    'stats.streak.targetRule':
      'Ziel: die meisten Trainingstage pro Woche unter deinen aktiven Kraftplänen. Jedes Training eines aktiven Plans zählt, freie Trainings auch.',
  },
};

export default statsTexts;
