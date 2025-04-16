console.log("Loading League of Dungeoneers system");

import { LODActorSheet } from "./module/actor-sheet.mjs";
import { LODItemSheet } from "./module/item-sheet.mjs";

CONFIG.debug.hooks = true;

Hooks.once("init", async () => {
  console.log("League of Dungeoneers | Initializing system");
  console.log("LODActorSheet class:", LODActorSheet);
  console.log("LODItemSheet class:", LODItemSheet);

  // Define paths to actor partial templates
  const actorPartials = {
    "actor-main": "systems/league-of-dungeoneers/templates/actor/actor-main.html",
    "actor-combat": "systems/league-of-dungeoneers/templates/actor/actor-combat.html",
    "actor-inventory": "systems/league-of-dungeoneers/templates/actor/actor-inventory.html",
    "actor-talents": "systems/league-of-dungeoneers/templates/actor/actor-talents.html",
    "actor-spells": "systems/league-of-dungeoneers/templates/actor/actor-spells.html",
    "actor-prayers": "systems/league-of-dungeoneers/templates/actor/actor-prayers.html",
    "actor-recipes": "systems/league-of-dungeoneers/templates/actor/actor-recipes.html",
    "actor-notes": "systems/league-of-dungeoneers/templates/actor/actor-notes.html",
    "actor-effects": "systems/league-of-dungeoneers/templates/actor/actor-effects.html"
  };

  // Define paths to item partial templates
  const itemPartials = {
    "weapon": "systems/league-of-dungeoneers/templates/item/item-weapon.html",
    "armor": "systems/league-of-dungeoneers/templates/item/item-armor.html",
    "equipment": "systems/league-of-dungeoneers/templates/item/item-equipment.html",
    "ingredient": "systems/league-of-dungeoneers/templates/item/item-ingredient.html",
    "potion": "systems/league-of-dungeoneers/templates/item/item-potion.html",
    "spell": "systems/league-of-dungeoneers/templates/item/item-spell.html",
    "prayer": "systems/league-of-dungeoneers/templates/item/item-prayer.html",
    "talent": "systems/league-of-dungeoneers/templates/item/item-talent.html",
    "perk": "systems/league-of-dungeoneers/templates/item/item-perk.html",
    "profession": "systems/league-of-dungeoneers/templates/item/item-profession.html",
    "race": "systems/league-of-dungeoneers/templates/item/item-race.html",
    "background": "systems/league-of-dungeoneers/templates/item/item-background.html"
  };

  // Load all partial templates
  await loadTemplates({ ...actorPartials, ...itemPartials });
  console.log("Templates loaded");

  Actors.registerSheet("league-of-dungeoneers", LODActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "LOD.CharacterSheet"
  });
  console.log("Actor sheet registered successfully");
  console.log("Registered actor sheets:", Array.from(Actors.registeredSheets.keys()));

  Items.registerSheet("league-of-dungeoneers", LODItemSheet, {
    types: ["weapon", "armor", "equipment", "ingredient", "potion", "spell", "prayer", "talent", "perk", "profession", "race", "background"],
    makeDefault: true,
    label: "LOD.ItemSheet"
  });
  console.log("Item sheet registered successfully");
  console.log("Registered item sheets:", Array.from(Items.registeredSheets.keys()));
});

Hooks.once("ready", () => {
  console.log("League of Dungeoneers | System fully ready");
  console.log("Final registered sheets:", Array.from(Actors.registeredSheets.keys()));
});

Hooks.on("preCreateActor", (actor, data, options) => {
  console.log("preCreateActor hook fired, data before:", data);
  if (!data.type) {
    data.type = "character";
    console.log("preCreateActor: Set type to 'character'");
  }

  const defaultSystemData = {
    abilities: {
      strength: { value: 0, damageBonus: 0 },
      dexterity: { value: 0, naturalArmor: 0 },
      constitution: { value: 0, movement: 0 },
      intelligence: { value: 0, mana: 0 },
      wisdom: { value: 0, partyMorale: 0 },
      hitPoints: { current: 0, max: 0 },
      luck: { current: 0, max: 0 },
      energy: { current: 0, max: 0 },
      sanity: { current: 0, max: 0 },
      condition: "normal"
    },
    skills: [],
    weapons: [],
    quickslots: [
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { name: "", durability: 0 },
      { ammo: "", quantity: 0 }
    ],
    accessories: { necklaces: [], rings: [] },
    spells: { level1: [], level2: [], level3: [], level4: [], level5: [], level6: [] },
    prayers: { level1: [], level2: [], level3: [], level4: [] },
    recipes: [],
    inventory: [],
    encumbrance: { total: 0, carried: 0 },
    wealth: { coins: 0 },
    talents: [],
    perks: [],
    notes: ""
  };

  actor.system = foundry.utils.mergeObject(defaultSystemData, data.system || {});
  console.log("preCreateActor, data after:", data);
});