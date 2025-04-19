class LODItemSheet extends ItemSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["league-of-dungeoneers", "sheet", "item"],
      template: "systems/league-of-dungeoneers/templates/item/item-sheet.html",
      width: 600,
      height: 400,
      resizable: true,
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "details" }
      ]
    });
  }

  getData() {
    const context = super.getData();
    context.system = context.item.system;
    context.handsOptions = [
      { value: "1", label: "1 Hand" },
      { value: "2", label: "2 Hands" }
    ];
    context.baseTypeOptions = [
      { value: "Padded", label: "Padded" },
      { value: "Leather", label: "Leather" },
      { value: "Mail", label: "Mail" },
      { value: "Sleeved Mail", label: "Sleeved Mail" },
      { value: "Plate", label: "Plate" },
      { value: "None", label: "None" }
    ];
    context.coversOptions = [
      { value: "Head", label: "Head" },
      { value: "Torso", label: "Torso" },
      { value: "Torso (Back Only)", label: "Torso (Back Only)" },
      { value: "Legs", label: "Legs" },
      { value: "Arms", label: "Arms" },
      { value: "Shield", label: "Shield" }
    ];
    context.tierOptions = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" }
    ];
    context.availabilityOptions = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" }
    ];
    context.classOptions = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
      { value: "6", label: "6" }
    ];
    context.reloadOptions = [
      { value: "", label: "" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" }
    ];
    context.partials = {
      "weapon": "weapon",
      "armor": "armor",
      "equipment": "equipment",
      "ingredient": "ingredient",
      "potion": "potion",
      "spell": "spell",
      "prayer": "prayer",
      "talent": "talent",
      "perk": "perk",
      "profession": "profession",
      "race": "race",
      "background": "background"
    };
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}

export { LODItemSheet };