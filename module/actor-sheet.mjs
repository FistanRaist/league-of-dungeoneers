class LODActorSheet extends ActorSheet {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["league-of-dungeoneers", "sheet", "actor"],
      template: "systems/league-of-dungeoneers/templates/actor/actor-sheet.html",
      tabs: [
        { navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }
      ],
      width: 800, // Fixed width
      height: 600, // Fixed height
      resizable: false // Disable resizing
    });
  }

  getData() {
    const context = super.getData();
    context.system = context.actor.system;
    console.log("LODActorSheet getData:", context);
    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Explicitly bind tabs to ensure proper initialization
    this._tabs.forEach(tab => {
      tab.bind(html[0]);
      console.log("LODActorSheet activateListeners: Tab bound", tab);
    });

    // Debug tab initialization
    console.log("LODActorSheet activateListeners: Tabs initialized", this._tabs);

    // Initialize Rich Text Editor for Notes tab when it's active
    const notesTab = html.find('.tab[data-tab="notes"]');
    const editorElement = notesTab.find('.editor');
    
    const initializeEditor = () => {
      if (editorElement.length && !editorElement.hasClass('editor-initialized')) {
        const content = this.actor.system.notes || "";
        const target = "system.notes";
        const owner = this.actor.isOwner;
        const editable = this.isEditable;

        // Render the editor
        const editor = new foundry.data.fields.HTMLField().createEditor({
          target,
          content,
          owner,
          editable,
          button: true,
          element: editorElement[0]
        });

        editorElement.addClass('editor-initialized');
        console.log("LODActorSheet: Rich Text Editor initialized for Notes tab");
      }
    };

    // Initialize editor if Notes tab is active on load
    if (html.find('.sheet-tabs .item.active').data('tab') === 'notes') {
      initializeEditor();
    }

    // Re-initialize editor when switching to Notes tab
    html.find('.sheet-tabs .item').click((event) => {
      const tabName = event.currentTarget.dataset.tab;
      if (tabName === 'notes') {
        initializeEditor();
      }
    });

    // Add Recipe Row
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

    // Delete Recipe Row
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

export { LODActorSheet };