import { Language, Translations } from "@/models/translations"

export const en: Translations = {
  salasanakone: "Passphrase Generator",
  new: "new",
  clickToCopyOrEdit: "Copy or edit",
  hasCopiedPassword: "Password is copied",
  inputPlaceholder: "eg. '-' or '?'",
  promptToAddWords: "Add words",
  ok: "Ok",
  length: "Length of password",
  update: "Update",
  tryAgain: "Try again",
  useWords: "Passphrase",
  useCharacters: "Password",
  useUppercase: "Uppercase",
  useNumbers: "Numbers",
  useSeparator: "Separator",
  useSpecials: "Special characters",
  strengthDefault: "",
  strengthAwful: "",
  strengthBad: "",
  strengthOk: "",
  strengthGood: "",
  strengthGreat: "",
  loadingStrength: "Calculating...",
  timeToCrack: "Estimated time to crack",
  lengthOfPassPhrase: "{passLength} words",
  lengthOfPassWord: "{passLength} characters",
  leaveFeedback: "",
  thanksForFeedback: "",
  thanksForFeedbackLeaveAnother: "",
  visitMySite: "Visit my site",
  share: "Share",
  moreInfo: "More info",
  resultHelperLabel: "Click to copy the password",
  errorNoGeneration: "Something went wrong... No password was generated",
  tryToRefresh: "Try to refresh the site",
  updateToNewVersion: "A new version is available! Please click to refresh",
  worksOffline: "The app now works offline",
  somethingWentWrong: "Something went wrong",
  editResult: "Edit",
  editResultDesc: "Edit and check a custom passphrase",
  resultInputPlaceholder: "Type your password here",
  saveResult: "Save and check",
  saveAndCheckString: "Save and check strength",
  passphraseDesc:
    "A passphrase is a string of words, usually separated with a special character and includes a number or numbers",
  separatorInputLabel: "Separator characters",
  saveCustomSeparatorDesc: "Save separator characters",
  saveCustomSeparator: "Save",
  languageInfo: "Change language",
  useWordsInfo: "Will the password contain words?",
  useCharactersInfo: "Will the password contain characters?",
  useUppercaseInfo: "Will the password have uppercase characters?",
  useNumbersInfo: "Will the password contain numbers?",
  useSeparatorInfo: "Will the passphrase contain separators?",
  useSpecialsInfo: "Will the password contain special characters?",
  copied: "Copied to clipboard",
  [Language.en]: "English",
  [Language.fi]: "Suomi",
}

export const fi = {
  salasanakone: "Salasanakone",
  ok: "Ok",
  update: "Päivitä",
  new: "Uusi",
  tryAgain: "Yritä uudelleen",
  useWords: "Salalause",
  useCharacters: "Normaali salasana",
  useUppercase: "Isot kirjaimet",
  useNumbers: "Numerot",
  useSeparator: "Välimerkit",
  useSpecials: "Erikoismerkit",
  strengthDefault: "Arvio",
  strengthAwful: "Surkea",
  strengthBad: "Huono",
  strengthOk: "Ok",
  strengthGood: "Hyvä",
  strengthGreat: "Loistava",
  loadingStrength: "Lasketaan...",
  timeToCrack: "Murtamisaika",
  clickToCopyOrEdit: "Kopioi tai muokkaa",
  hasCopiedPassword: "Kopioitu",
  inputPlaceholder: 'Esim. "-" tai "?" tai "3!"',
  promptToAddWords: "Lisää sanoja",
  lengthOfPassPhrase: "{passLength} sanaa",
  lengthOfPassWord: "{passLength} merkkiä",
  leaveFeedback: "Jätä palaute",
  thanksForFeedback: "Kiitos palautteesta",
  thanksForFeedbackLeaveAnother:
    "Kiitos jos annoit palautetta, voit antaa\nuuden palautteen klikkaamalla.",
  visitMySite: "Vieraile sivuillani",
  share: "Jaa",
  moreInfo: "Lisätietoja",
  resultHelperLabel: "Salasana, jonka voi kopioida napauttamalla",
  errorNoGeneration: "Jotain meni vikaan... Salasanaa ei luotu.",
  tryToRefresh: "Koeta päivittää sivu.",
  updateToNewVersion: "Uusi versio saatavilla. Päivitä sivu napauttamalla.",
  worksOffline: "Sivusto toimii nyt myös ilman verkkoyhteyttä.",
  somethingWentWrong: "Jotain meni vikaan.",
  editResult: "Muokkaa",
  editResultDesc: "Muokkaa ja tarkista haluamasi sana",
  resultInputPlaceholder: "Minkä vahvuus tarkistetaan?",
  saveResult: "Tarkista",
  saveAndCheckString: "Tallenna ja tarkista sanan vahvuus.",
  passphraseDesc:
    "Salalause on sanoista koostuva, pidempi salasana. Siinä on usein välimerkkejä sanojen välissä, ja numero jossain kohdassa.",
  length: "Salasanan pituus",
  separatorInputLabel: "Välimerkit, jotka erottavat sanat",
  saveCustomSeparator: "Tallenna",
  saveCustomSeparatorDesc: "Tallenna välimerkit",
  languageInfo: "Vaihda kieli",
  useWordsInfo: "Luodaanko salalause sanoista?",
  useCharactersInfo: "Luodaanko normaali salasana?",
  useUppercaseInfo: "Sisältääkö salasana isoja kirjaimia?",
  useNumbersInfo: "Sisältääkö salasana numeroita?",
  useSeparatorInfo: "Sisältääkö salasana välimerkkejä?",
  useSpecialsInfo: "Sisältääkö salasana erikoismerkkejä?",
  copied: "Kopioitu leikepöydälle",
  [Language.en]: "English",
  [Language.fi]: "Suomi",
} as const
