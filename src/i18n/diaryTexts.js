// Texts of one work area, kept in their own file so that several people can work
// in parallel without touching translations.js. Same rules: every key in both
// languages. Merged in translations.js.
const diaryTexts = {
  en: {
    // Dialog for a training that did not take place
    'diary.skip.title': 'Record training as missed',
    'diary.skip.reasonLabel': 'Reason (optional)',
    'diary.skip.reason.sick': 'Ill',
    'diary.skip.reason.injured': 'Injured',
    'diary.skip.reason.noTime': 'No time',
    'diary.skip.reason.travel': 'Travel',
    'diary.skip.reason.recovery': 'Recovery',
    'diary.skip.reason.other': 'Other',
    'diary.skip.detailLabel': 'Details (optional)',
    'diary.skip.confirm': 'Record as missed',
    'diary.skip.cancel': 'Cancel',
  },
  de: {
    'diary.skip.title': 'Training als ausgefallen eintragen',
    'diary.skip.reasonLabel': 'Grund (optional)',
    'diary.skip.reason.sick': 'Krank',
    'diary.skip.reason.injured': 'Verletzt',
    'diary.skip.reason.noTime': 'Keine Zeit',
    'diary.skip.reason.travel': 'Reise',
    'diary.skip.reason.recovery': 'Erholung',
    'diary.skip.reason.other': 'Sonstiges',
    'diary.skip.detailLabel': 'Details (optional)',
    'diary.skip.confirm': 'Als ausgefallen eintragen',
    'diary.skip.cancel': 'Abbrechen',
  },
};

export default diaryTexts;
