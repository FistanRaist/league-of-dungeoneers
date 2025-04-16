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