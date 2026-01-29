import { Language, type Translations } from "@/models/translations"

export const en: Translations = {
  salasanakone: "Passphrase Generator",

  // Description section translations
  descriptionMainTitle: "Create and check passwords",
  descriptionSubtitle: "A password generator that creates strong passwords from English words",
  descriptionIntro:
    "The English language has a rich vocabulary, making it perfect for creating strong and memorable passwords or passphrases.",
  descriptionGoodPassword:
    "A good password is long enough (over 10 characters) and contains numbers, special characters, and both uppercase and lowercase letters.",
  descriptionHarvardRecommends: "recommends using passphrases.",
  descriptionGeneratorBenefits:
    "With this password generator, you can automatically create a strong and memorable passphrase that is also easy to type. You can also check the strength of your own password.",
  descriptionPassphraseVsPasswordTitle: "Is a passphrase better than a password?",
  descriptionPassphraseVsPassword:
    "Generally, yes. If a passphrase is long enough and contains separators and preferably numbers, it is extremely difficult to crack.",
  descriptionHowCreatedTitle: "How is the password created?",
  descriptionHowCreatedSummary:
    "The generator creates a password from randomly selected words or characters.",
  descriptionHowCreatedDetails:
    "The generator selects words randomly from nearly 100,000 English words. It also adds your chosen separators and numbers between the words.",
  descriptionStrengthTitle: "How is strength evaluated?",
  descriptionStrengthSummary: "How is strength evaluated?",
  descriptionStrengthDetails1:
    "Strength evaluation is done using the same open-source program from Dropbox as used by",
  descriptionStrengthDetails2:
    "However, this generator takes English words into account for the most accurate evaluation.",
  descriptionStrengthDetails3:
    "The generator evaluates password strength based on length, randomness, and commonality. It also compares the password against a dictionary to calculate a more realistic strength if the words appear unchanged in the dictionary.",
  descriptionSecureTitle: "Secure and reliable",
  descriptionSecureDetails1:
    "The site creates passwords entirely locally - no data collection, advertising, or anything else.",
  descriptionSecureDetails2: "The site also works offline from browser cache using",
  descriptionSecureDetails3:
    "Add the site to your device's home screen as a bookmark to get the most out of its features!",
  descriptionSourceCode: "View the site's source code here:",

  // SEO translations
  seoTitle: "Password Generator | Create Strong Passwords",
  seoDescription:
    "Create and check strong, memorable passwords with this password generator easily, quickly, and automatically using English words. Check your own password's strength by typing it in the text field.",
  seoOgTitle: "Create Password | In English",
  seoOgDescription:
    "Create and check strong, memorable passwords with this password generator easily, quickly, and automatically using English words.",
  seoOgImageAlt:
    "Image of the passphrase generator website with the text 'Strong-Reliable,Memorable!Fast+Secure*Easy!' and a button that says 'Create a memorable and strong password'.",
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
  timeToCrack: "Time to crack",
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
  worksOffline: "The app now also works offline.",
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
  errorInFetchingDataset: "Error in fetching wordlist, try again later.",
  fetchDatasetTooltip:
    "You have deleted the wordlist for this language. Download it from the settings or change language",
  settingsTitle: "Settings and strength",
  storageUsed: "Storage",
  storageUsedDesc: "Site's estimated storage usage is {storage} Megabytes",
  megaByte: "MB",
  guessesNeeded: "Guesses needed",
  scoreDescription: "The password's strength on a scale of 0 to 4 is now {score}",
  manageLanguages: "Manage languages",
  deleteDataset: "Delete wordlist: {language}",
  downloadDataset: "Download wordlist for {language}",
}

export const fi = {
  salasanakone: "Salasanakone",

  // Description section translations
  descriptionMainTitle: "Salasanakone luo ja tarkistaa salasanoja",
  descriptionSubtitle: "Salasanageneraattori, jolla luot vahvan salasanan suomen kielen sanoista",
  descriptionIntro:
    "Suomen kieli on monimutkainen, ja sen vuoksi meille otollinen tapa luoda vahva ja muistettava salasana tai salalause.",
  descriptionGoodPassword:
    "Hyvä salasana on riittävän pitkä (yli 10 kirjainta) ja sisältää numeroita, erikoismerkkejä sekä isoja ja pieniä kirjaimia.",
  descriptionHarvardRecommends: "suosittelee salalauseiden käyttöä.",
  descriptionGeneratorBenefits:
    "Tällä salasanageneraattorilla voit luoda automaattisesti vahvan ja muistettavissa olevan salalauseen, joka on lisäksi vielä helppo kirjoittaa. Voit myös tarkistaa oman salasanan vahvuuden.",
  descriptionPassphraseVsPasswordTitle: "Onko salalause parempi kuin salasana?",
  descriptionPassphraseVsPassword:
    "Yleistäen, on. Jos salalause on riittävän pitkä sekä sisältää välimerkkejä ja mieluusti numeroita, on sen murtaminen erittäin haastavaa.",
  descriptionHowCreatedTitle: "Miten salasana luodaan?",
  descriptionHowCreatedSummary:
    "Salasanakone luo satunnaisesti valituista sanoista tai merkeistä salasanan.",
  descriptionHowCreatedDetails:
    "Salasanakone valitsee sanat lähes 100 000:sta suomen kielen sanan joukosta satunnaisesti. Lisäksi kone lisää haluamasi välimerkit ja numerot sanojen väliin.",
  descriptionStrengthTitle: "Miten vahvuus arvioidaan?",
  descriptionStrengthSummary: "Miten vahvuus arvioidaan?",
  descriptionStrengthDetails1:
    "Vahvuuden arviointi tapahtuu samalla, Dropboxin avoimen lähdekoodin ohjelmalla, kuin",
  descriptionStrengthDetails2:
    "Tosin, tämä kone ottaa huomioon suomalaiset sanat, jotta arviointi on mahdollisimman tarkka.",
  descriptionStrengthDetails3:
    "Kone arvioi salasanan vahvuuden mm. pituuden, satunnaisuuden, ja yleisyyden perusteella. Lisäksi kone vertaa salasanaa suomen kielen sanakirjaan, ja sitä kautta laskee realistisemman vahvuuden, mikäli sanat ilmenevät muuttamattomina sanakirjassa.",
  descriptionSecureTitle: "Turvallinen ja luotettava",
  descriptionSecureDetails1:
    "Sivusto luo salasanat täysin paikallisesti - ei tietojen keräystä, mainontaa tai mitään muutakaan.",
  descriptionSecureDetails2: "Sivu toimii myös ilman verkkoyhteyttä selaimen välimuistista",
  descriptionSecureDetails3:
    "Lisää sivusto laitteenne kotinäytölle kirjanmerkiksi, jotta saat kaiken irti ominaisuuksista!",
  descriptionSourceCode: "Katso sivuston lähdekoodi täältä:",

  // SEO translations
  seoTitle: "Salasanakone | Luo vahvoja salasanoja",
  seoDescription:
    "Salasanakone - Luo ja tarkista vahvoja sekä muistettavia salasanoja tällä salasanageneraattorilla helposti, nopeasti ja automaattisesti käyttämällä Suomen kielen sanoja. Tarkista oman salasanan vahvuus kirjoittamalla se teksikenttään.",
  seoOgTitle: "Luo Salasana | Suomeksi",
  seoOgDescription:
    "Salasanakone - Luo ja tarkista vahvoja ja muistettavia salasanoja tällä salasanageneraattorilla helposti, nopeasti sekä automaattisesti käyttämällä Suomen kielen sanoja.",
  seoOgImageAlt:
    "Kuva salasanakone.com sivustolle, jossa on teksti 'Vahva-Luotettava,Muistettava!Nopea+Turvallinen*Helppo!', sekä painikkeen kuva, jossa lukee 'Luo muistettava ja vahva salasana'.",
  ok: "Ok",
  update: "Päivitä",
  new: "Uusi",
  tryAgain: "Yritä uudelleen",
  useWords: "Salalause",
  useCharacters: "Salasana",
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
  errorInFetchingDataset: "Virhe haettaessa sanalistaa, yritä myöhemmin uudelleen.",
  fetchDatasetTooltip:
    "Olet poistanut tämän kielen sanalistan, lataa se uudelleen asetuksista tai vaihda kieltä.",
  settingsTitle: "Vahvuus ja asetukset",
  storageUsed: "Tallennustila",
  storageUsedDesc: "Sivuston arvioitu tallennustilan käyttö on {storage} Megatavua",
  megaByte: "Mt",
  guessesNeeded: "Arvauksia tarvitaan",
  scoreDescription: "Salasanan vahvuus asteikolla 0-4 on nyt {score}",
  manageLanguages: "Hallitse kieliä",
  deleteDataset: "Poista sanalista kielelle {language}",
  downloadDataset: "Lataa sanalista kielelle {language}",
} as const
