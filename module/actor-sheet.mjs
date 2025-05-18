class LODActorSheet extends ActorSheet {
  static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
          classes: ["league-of-dungeoneers", "sheet", "actor"],
          template: "systems/league-of-dungeoneers/templates/actor/actor-sheet.html",
          width: 800,
          height: 600,
          tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
      });
  }

  async getData() {
      const context = await super.getData();
      context.system = context.actor.system;
      console.log("LODActorSheet getData:", context);
      return context;
  }

  setPosition({ top, left, width, height, scale } = {}) {
      const element = this.element?.[0];
      if (!element || !element.isConnected) {
          console.debug("LODActorSheet setPosition: Skipping due to missing or disconnected element");
          return;
      }
      const currentStyle = window.getComputedStyle(element);
      const newLeft = left ?? parseFloat(currentStyle.left) || 0;
      const newTop = top ?? parseFloat(currentStyle.top) || 0;
      const newWidth = width ?? parseFloat(currentStyle.width) || this.options.width;
      const newHeight = height ?? parseFloat(currentStyle.height) || this.options.height;
      const newScale = scale ?? (currentStyle.transform ? parseFloat(currentStyle.transform.split("(")[1]) : 1);

      Object.assign(element.style, {
          left: `${newLeft}px`,
          top: `${newTop}px`,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
          transform: `scale(${newScale})`
      });
      console.debug("LODActorSheet setPosition: Applied styles", { left: newLeft, top: newTop, width: newWidth, height: newHeight, scale: newScale });
  }

  activateListeners(html) {
      super.activateListeners(html);

      // Use Foundry's tab system
      this._tabs[0].bind(html[0]);
      console.debug("LODActorSheet activateListeners: Tabs bound");

      // Add Recipe Row
      html.find(".add-recipe").click(async (event) => {
          event.preventDefault();
          console.debug("LODActorSheet: Add recipe clicked");
          const recipes = this.actor.system.recipes || [];
          recipes.push({
              name: "",
              component1: "",
              component2: "",
              component3: "",
              component4: ""
          });
          await this.actor.update({ "system.recipes": recipes });
          console.debug("LODActorSheet: Recipe added", recipes);
      });
  }
}

export { LODActorSheet };