export class LODActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["league-of-dungeoneers", "sheet", "actor"],
      template: "systems/league-of-dungeoneers/templates/actor/actor-sheet.html",
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }
      ],
      width: 800,
      height: 600,
      resizable: false
    });
  }

  get template() {
    const type = this.actor.type;
    console.log("LODActorSheet get template: Actor type is", type);
    if (type === "monster") {
      return "systems/league-of-dungeoneers/templates/actor/actor-monster.html";
    }
    return "systems/league-of-dungeoneers/templates/actor/actor-sheet.html";
  }

  get defaultOptions() {
    const options = super.defaultOptions;
    if (this.actor.type === "monster") {
      options.resizable = true;
    }
    return options;
  }

  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    context.system.notes = typeof context.system.notes === "string" ? context.system.notes : "";
    context.owner = this.actor.isOwner;
    context.editable = this.isEditable;
    console.log("LODActorSheet getData:", context);
    return context;
  }

  async activateListeners(html) {
    super.activateListeners(html);

    this._tabs.forEach(tab => {
      tab.bind(html[0]);
      console.log("LODActorSheet activateListeners: Tab bound", tab);
    });

    console.log("LODActorSheet activateListeners: Tabs initialized", this._tabs);

    // Debug: Log the classes applied to the sheet
    console.log("LODActorSheet classes on sheet:", this.element[0].classList.toString());
    console.log("LODActorSheet .columns element exists:", html.find(".abilities .columns").length > 0);
    console.log("LODActorSheet .column elements:", html.find(".abilities .columns .column").length);

    html.find(".add-recipe").click(async (event) => {
      event.preventDefault();
      const recipes = this.actor.system.recipes || [];
      recipes.push({
        name: "",
        component1: "",
        component2: "",
        component3: "",
        component4: ""
      });
      await this.actor.update({ "system.recipes": recipes });
    });

    html.find(".delete-recipe").click(async (event) => {
      event.preventDefault();
      const index = event.currentTarget.dataset.index;
      const recipes = this.actor.system.recipes || [];
      recipes.splice(index, 1);
      await this.actor.update({ "system.recipes": recipes });
    });

    // Drag-and-drop for Special Rules and Weapons
    html.find('[data-drop-target="special-rule"]').on("drop", this._onDropSpecialRule.bind(this));
    html.find('[data-drop-target="weapon"]').on("drop", this._onDropWeapon.bind(this));
  }

  async _onDropSpecialRule(event) {
    event.preventDefault();
    const data = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));
    if (data.type !== "Item" || data.system?.type !== "specialRule") return;

    const item = await Item.fromDropData(data);
    const specialRules = this.actor.system.specialRules || [];
    specialRules.push({ name: item.system.name });
    await this.actor.update({ "system.specialRules": specialRules });
  }

  async _onDropWeapon(event) {
    event.preventDefault();
    const data = JSON.parse(event.originalEvent.dataTransfer.getData("text/plain"));
    if (data.type !== "Item" || data.system?.type !== "weapon") return;

    const item = await Item.fromDropData(data);
    const weapons = this.actor.system.weapons || [];
    weapons.push({ name: item.system.name, dmg: item.system.dmg });
    await this.actor.update({ "system.weapons": weapons });
  }

  _onChangeTab(event, tabs, active) {
    try {
      super._onChangeTab(event, tabs, active);
      console.log("LODActorSheet _onChangeTab: Switched to tab", active);
    } catch (error) {
      console.error("LODActorSheet _onChangeTab error:", error);
    }
  }
}