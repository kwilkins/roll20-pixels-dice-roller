/**
 * @copyright 2024 Kevin Wilkinson
 * @license GPL-3.0-or-later
 * @summary Types for D&D 5e character sheet scraping.
 */

export enum AbilityScore {
  Strength = 'Strength',
  Dexterity = 'Dexterity',
  Constitution = 'Constitution',
  Intelligence = 'Intelligence',
  Wisdom = 'Wisdom',
  Charisma = 'Charisma'
}

export enum Skill {
  Acrobatics = 'Acrobatics',
  AnimalHandling = 'AnimalHandling',
  Arcana = 'Arcana',
  Athletics = 'Athletics',
  Deception = 'Deception',
  History = 'History',
  Insight = 'Insight',
  Intimidation = 'Intimidation',
  Investigation = 'Investigation',
  Medicine = 'Medicine',
  Nature = 'Nature',
  Perception = 'Perception',
  Performance = 'Performance',
  Persuasion = 'Persuasion',
  Religion = 'Religion',
  SleightOfHand = 'SleightOfHand',
  Stealth = 'Stealth',
  Survival = 'Survival'
}

export interface Dnd5eCharacterSheetBonuses {
  abilityScoreBonuses: Record<AbilityScore, number>;
  abilitySaveBonuses: Record<AbilityScore, number>;
}