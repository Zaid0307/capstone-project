// Texts of one work area, kept in their own file so that several people can work
// in parallel without touching translations.js. Same rules: every key in both
// languages. Merged in translations.js.
const editorTexts = {
  en: {
    'planEditor.menu.entry': 'Actions for {name}',
    'planEditor.menu.day': 'Actions for {name}',
    'planEditor.menu.back': 'Back',
    'planEditor.menu.moveUp': 'Move up',
    'planEditor.menu.moveDown': 'Move down',
    'planEditor.menu.duplicate': 'Duplicate',
    'planEditor.menu.remove': 'Remove',
    'planEditor.menu.delete': 'Delete',
    'planEditor.menu.moveToDay': 'Move {name} to {day}',
    'planEditor.menu.dayEarlier': 'Move earlier',
    'planEditor.menu.dayLater': 'Move later',
    'planEditor.sort.start': 'Sort',
    'planEditor.sort.done': 'Done',
    'planEditor.sort.list': 'Order of {name}',
    'planEditor.sort.hint': 'Move the exercises with the arrows.',
    'planEditor.sort.moved': '{name} is now at position {position} of {count}',
  },
  de: {
    'planEditor.menu.entry': 'Aktionen für {name}',
    'planEditor.menu.day': 'Aktionen für {name}',
    'planEditor.menu.back': 'Zurück',
    'planEditor.menu.moveUp': 'Nach oben',
    'planEditor.menu.moveDown': 'Nach unten',
    'planEditor.menu.duplicate': 'Duplizieren',
    'planEditor.menu.remove': 'Entfernen',
    'planEditor.menu.delete': 'Löschen',
    'planEditor.menu.moveToDay': '{name} nach {day} verschieben',
    'planEditor.menu.dayEarlier': 'Nach vorne',
    'planEditor.menu.dayLater': 'Nach hinten',
    'planEditor.sort.start': 'Sortieren',
    'planEditor.sort.done': 'Fertig',
    'planEditor.sort.list': 'Reihenfolge von {name}',
    'planEditor.sort.hint': 'Mit den Pfeilen verschiebst du die Übungen.',
    'planEditor.sort.moved': '{name} ist jetzt an Position {position} von {count}',
  },
};

export default editorTexts;
