/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary The script to run and scrape for bonuses on character sheets.
 */

import { addMessageListener, sendMessageToExtension } from "../chromeMessaging";
import { AbilityScore, Dnd5eCharacterSheetBonuses } from "../types/dnd5e";
import { MessageAction } from "../types/messageAction";

window.addEventListener('load', scrapeSheetData, false);

function scrapeSheetData () {
  console.log(`found iframe ${document.title}`);

  const is2024Sheet = document.baseURI.startsWith('https://advanced-sheets.production.roll20');

  if (is2024Sheet) {
    console.log('2024 sheet detected');

    waitForElement(
      '#abilityBlueprint',
      1000,
      10000
    ).then((result: boolean) => {
      if (result) {
        const characterName = document.querySelector('span.name__name')?.textContent ?? undefined;
        const abilityScoreElements = [...document.querySelectorAll('div.abilities__list div.list__item')];
        const abilityScores = abilityScoreElements.map((element: Element) => element.querySelector('.ability-button span')?.textContent?.slice(1));
        const saveBonuses = abilityScoreElements.map((element: Element) => element.querySelector('.save-button span')?.textContent?.slice(1));
        
        const dnd5eCharacterSheetBonuses: Dnd5eCharacterSheetBonuses = {
          abilityScoreBonuses: {
            [AbilityScore.Strength]: Number(abilityScores[0]),
            [AbilityScore.Dexterity]: Number(abilityScores[1]),
            [AbilityScore.Constitution]: Number(abilityScores[2]),
            [AbilityScore.Intelligence]: Number(abilityScores[3]),
            [AbilityScore.Wisdom]: Number(abilityScores[4]),
            [AbilityScore.Charisma]: Number(abilityScores[5]),
          },
          abilitySaveBonuses: {
            [AbilityScore.Strength]: Number(saveBonuses[0]),
            [AbilityScore.Dexterity]: Number(saveBonuses[1]),
            [AbilityScore.Constitution]: Number(saveBonuses[2]),
            [AbilityScore.Intelligence]: Number(saveBonuses[3]),
            [AbilityScore.Wisdom]: Number(saveBonuses[4]),
            [AbilityScore.Charisma]: Number(saveBonuses[5]),
          }
        };
        console.log('with ability scores', dnd5eCharacterSheetBonuses);

        if (characterName && dnd5eCharacterSheetBonuses) {
          addMessageListener<MessageAction.PixelConnectionRequest>(
            async (_message) => {
              sendCharacterSheetDataToExtension(characterName, dnd5eCharacterSheetBonuses);
          });
      
          sendCharacterSheetDataToExtension(characterName, dnd5eCharacterSheetBonuses);
        } else {
          console.warn('character sheet scraper could not locate data');
        }
      } else {
        console.warn('character sheet scraper timed out waiting for elements');
      }
    });
  } else {
    console.log('2014 sheet detected');
    const characterName = (document.querySelector('input[name="attr_character_name"') as HTMLInputElement)?.value;
    const abilityScoreElements = [...document.querySelectorAll('div.attr-container')].slice(6, 12);
    const abilityScores = abilityScoreElements.map((element: Element) => element.querySelector('.attr')?.textContent);
    const saveBonuses = [...document.querySelectorAll('.saving-throw-container .saving-throw')].map((element: Element) => element.querySelector('span[name$="save_bonus"')?.textContent);
    
    const dnd5eCharacterSheetBonuses: Dnd5eCharacterSheetBonuses = {
      abilityScoreBonuses: {
        [AbilityScore.Strength]: Number(abilityScores[0]),
        [AbilityScore.Dexterity]: Number(abilityScores[1]),
        [AbilityScore.Constitution]: Number(abilityScores[2]),
        [AbilityScore.Intelligence]: Number(abilityScores[3]),
        [AbilityScore.Wisdom]: Number(abilityScores[4]),
        [AbilityScore.Charisma]: Number(abilityScores[5]),
      },
      abilitySaveBonuses: {
        [AbilityScore.Strength]: Number(saveBonuses[0]),
        [AbilityScore.Dexterity]: Number(saveBonuses[1]),
        [AbilityScore.Constitution]: Number(saveBonuses[2]),
        [AbilityScore.Intelligence]: Number(saveBonuses[3]),
        [AbilityScore.Wisdom]: Number(saveBonuses[4]),
        [AbilityScore.Charisma]: Number(saveBonuses[5]),
      }
    };
    console.log('with ability scores', dnd5eCharacterSheetBonuses);

    addMessageListener<MessageAction.PixelConnectionRequest>(
      async (_message) => {
        sendCharacterSheetDataToExtension(characterName, dnd5eCharacterSheetBonuses);
    });

    sendCharacterSheetDataToExtension(characterName, dnd5eCharacterSheetBonuses);
  }
};

function sendCharacterSheetDataToExtension(characterName: string, data: Dnd5eCharacterSheetBonuses) {
  sendMessageToExtension({
    action: MessageAction.CharacterSheetResponse,
    characterName,
    bonuses: data
  });
};

function waitForElement(selector: string, checkFrequencyInMs: number, timeoutInMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector)) {
      resolve(true);
      return;
    } else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
          resolve(false);
          return;
        } else {
          loopSearch();
        }
      }, checkFrequencyInMs);
    }
  })();
  });
};
