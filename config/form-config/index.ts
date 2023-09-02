import { IndexableFormValues, IndexedLabels, InputLabel } from "../../src/models"

export const inputFieldMaxLength = 8

export const defaultFormValues: IndexableFormValues = {
  words: {
    inputType: "radio",
    selected: true,
    info: "Luodaanko salalause sanoista?",
  },
  uppercase: {
    inputType: "checkbox",
    selected: false,
    info: "Sisältääkö Salasana isoja kirjaimia.",
  },
  numbers: {
    inputType: "checkbox",
    selected: true,
    info: "Sisällytetäänkö salasanaan numeroita",
  },
  randomChars: {
    inputType: "input",
    value: "-",
    selected: false,
    info: "Välimerkki, joka yhdistää sanat.",
  },
}

export function labelForCheckbox(option: InputLabel) {
  const labels: IndexedLabels = {
    uppercase: "Isot Kirjaimet",
    randomChars: "Välimerkit",
    numbers: "Numerot",
    words: "Käytä sanoja",
  }
  return labels[option] || labels.words
}
