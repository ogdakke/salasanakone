# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.1](https://github.com/ogdakke/salasanakone/commits/3.1.1) - 03-05-2025

- Now you can manage your downloads from the settings island.

## [3.1.0](https://github.com/ogdakke/salasanakone/commits/3.1.0) - 29-03-2024

- [#15](https://github.com/ogdakke/salasanakone/pull/16): feature toggle, improvements in creating password, better UI for island
- [#15](https://github.com/ogdakke/salasanakone/pull/15): Add adjacency graphs and common pkg to zxcvbn, UI improvements, create state.ts, add fetchedDatasets field in state, update dependencies
- [#14](https://github.com/ogdakke/salasanakone/pull/14): Allow removing datasets, remove state management from reducer, improve island by adding additional data in it, move zxcvbn to a web worker
- [#13](https://github.com/ogdakke/salasanakone/pull/13): move linting and formatting to biomejs

## [3.0.1](https://github.com/ogdakke/salasanakone/commits/3.0.1) - 08-03-2024

- [#12](https://github.com/ogdakke/salasanakone/pull/12):
  - improve bundle size, iOS select for language, move language out of formValues, dataset fetching error handling etc.
  - update dependencies

## [3.0.0](https://github.com/ogdakke/salasanakone/commits/3.0.0) - 01-03-2024

- [#11](https://github.com/ogdakke/salasanakone/pull/11): Fetch dataset remotely, add language picker, add translations

## [2.1.2](https://github.com/ogdakke/salasanakone/commits/2.1.2) - 26-02-2024

- Update dependecies, changes in UI, some general cleanup of code

## [2.1.1](https://github.com/ogdakke/salasanakone/commits/2.1.1) - 16-01-2024

- [#10](https://github.com/ogdakke/salasanakone/pull/10): Update dependencies

## [2.1.0](https://github.com/ogdakke/salasanakone/commits/2.1.0) - 10-11-2023

- [#7](https://github.com/ogdakke/salasanakone/pull/7): UI overhaul, result input for checking user's own string
- [#6](https://github.com/ogdakke/salasanakone/pull/6): UI overhaul and general clean up

## [2.0.4](https://github.com/ogdakke/salasanakone/commits/2.0.4) - 04-11-2023

- [#5](https://github.com/ogdakke/salasanakone/pull/5): Persist FormContext to localStorage, move passphrase to ResultContext

## [2.0.3](https://github.com/ogdakke/salasanakone/commits/2.0.3) - 04-11-2023

- [#4](https://github.com/ogdakke/salasanakone/pull/4) Remove redux, and use context instead. Redux was too much for this app, since it will probably never have more routes or anything like that.
  - general fixes and clean up

## [2.0.2](https://github.com/ogdakke/salasanakone/commits/2.0.2) - 04-11-2023

### Added

- [#3](https://github.com/ogdakke/salasanakone/pull/3) UI: Island, a component that displays the strength of a password as a "progress bar".

### Removed

- [#3](https://github.com/ogdakke/salasanakone/pull/3) UI: Time to crack -popover

## [2.0.1](https://github.com/ogdakke/salasanakone/commits/2.0.1) - 26-10-2023

### Changed

- Update dependencies

### Fixed

- UI: Safari font-size got too big on copy of text inside Result

## [2.0.0](https://github.com/ogdakke/salasanakone/commits/2.0.0) - 03-08-2023

### Added

- Translation possibility

### Changed

- State to redux

### Removed

-
