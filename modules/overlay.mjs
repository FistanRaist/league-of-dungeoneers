console.log("League of Dungeoneers | Loading overlay.mjs");

class PartyOverlay extends Application {
  constructor() {
    super();
    this._isLocked = true; // Start locked
    this._draggable = null;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "party-overlay",
      template: "systems/league-of-dungeoneers/templates/party-overlay.html",
      popOut: false,
      minimizable: false,
      resizable: false,
      width: 220,
      height: 160
    });
  }

  async getData() {
    console.log("League of Dungeoneers | Overlay getData called");
    const position = await game.settings.get("league-of-dungeoneers", "overlayPosition") || { top: 100, left: 300 }; // Near sidebar
    this._isLocked = await game.settings.get("league-of-dungeoneers", "overlayLocked") ?? true;
    return {
      partyMorale: game.settings.get("league-of-dungeoneers", "partyMorale") || 0,
      threatLevel: game.settings.get("league-of-dungeoneers", "threatLevel") || 0,
      top: position.top,
      left: position.left,
      isLocked: this._isLocked
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    console.log("League of Dungeoneers | Activating overlay listeners");

    // Control buttons
    html.find(".morale-minus").click(this._adjustValue.bind(this, "partyMorale", -1));
    html.find(".morale-plus").click(this._adjustValue.bind(this, "partyMorale", 1));
    html.find(".threat-minus").click(this._adjustValue.bind(this, "threatLevel", -1));
    html.find(".threat-plus").click(this._adjustValue.bind(this, "threatLevel", 1));
    html.find(".morale-d20").click(this._onRollD20.bind(this));
    html.find(".threat-d20").click(this._onRollD20.bind(this));

    // Lock toggle
    html.find(".lock-toggle").click(this._toggleLock.bind(this));

    // Initialize Draggable if unlocked
    if (!this._isLocked) {
      this._draggable = new Draggable(this, html, html[0], false);
      this._draggable._onDragMouseUp = this._onDragEnd.bind(this);
    }
  }

  async _adjustValue(key, delta) {
    const currentValue = game.settings.get("league-of-dungeoneers", key) || 0;
    const newValue = Math.max(0, currentValue + delta);
    await game.settings.set("league-of-dungeoneers", key, newValue);
    console.log(`League of Dungeoneers | Adjusted ${key} to ${newValue}`);
    this.render();
  }

  _onRollD20(event) {
    event.preventDefault();
    ui.notifications.info("Roll functionality to be implemented!");
  }

  async _toggleLock(event) {
    event.preventDefault();
    this._isLocked = !this._isLocked;
    await game.settings.set("league-of-dungeoneers", "overlayLocked", this._isLocked);
    const icon = this.element.find(".lock-toggle");
    icon.removeClass(this._isLocked ? "fa-unlock" : "fa-lock");
    icon.addClass(this._isLocked ? "fa-lock" : "fa-unlock");
    if (!this._isLocked) {
      this._draggable = new Draggable(this, this.element, this.element[0], false);
      this._draggable._onDragMouseUp = this._onDragEnd.bind(this);
    } else {
      this._draggable = null;
    }
    console.log(`League of Dungeoneers | Overlay ${this._isLocked ? "locked" : "unlocked"}`);
  }

  async _render(force = false, options = {}) {
    console.log("League of Dungeoneers | Overlay _render called, force:", force);
    await super._render(force, options);
    const board = document.getElementById("board");
    if (board && this.element[0]) {
      board.appendChild(this.element[0]);
      const position = await game.settings.get("league-of-dungeoneers", "overlayPosition") || { top: 100, left: 300 };
      Object.assign(this.element[0].style, {
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: "220px",
        height: "160px",
        zIndex: "150",
        visibility: "visible",
        opacity: "1"
      });
      const icon = this.element.find(".lock-toggle");
      icon.removeClass("fa-lock fa-unlock");
      icon.addClass(this._isLocked ? "fa-lock" : "fa-unlock");
      console.log("League of Dungeoneers | Overlay rendered on canvas, styles:", {
        display: this.element[0].style.display,
        opacity: this.element[0].style.opacity,
        zIndex: this.element[0].style.zIndex,
        position: this.element[0].style.position,
        top: this.element[0].style.top,
        left: this.element[0].style.left
      });
      const computed = window.getComputedStyle(this.element[0]);
      console.log("League of Dungeoneers | Overlay computed styles:", {
        display: computed.display,
        opacity: computed.opacity,
        zIndex: computed.zIndex,
        position: computed.position,
        top: computed.top,
        left: computed.left,
        background: computed.background,
        width: computed.width,
        height: computed.height
      });
      // Log DOM visibility
      console.log("League of Dungeoneers | Overlay DOM state:", {
        isConnected: this.element[0].isConnected,
        parentElement: this.element[0].parentElement ? this.element[0].parentElement.id : "none",
        offsetWidth: this.element[0].offsetWidth,
        offsetHeight: this.element[0].offsetHeight
      });
    } else {
      console.error("League of Dungeoneers | Failed to render overlay: #board not found or element missing", {
        boardExists: !!board,
        elementExists: !!this.element[0]
      });
    }
    return this;
  }

  async _onDragEnd(event) {
    const position = {
      top: parseInt(this.element[0].style.top) || 100,
      left: parseInt(this.element[0].style.left) || 300
    };
    await game.settings.set("league-of-dungeoneers", "overlayPosition", position);
    console.log("League of Dungeoneers | Overlay position saved:", position);
  }
}

Hooks.on("renderSceneControls", () => {
  console.log("League of Dungeoneers | renderSceneControls hook fired");
  const overlay = new PartyOverlay();
  overlay.render(true);
});

Hooks.on("canvasReady", () => {
  console.log("League of Dungeoneers | canvasReady hook fired");
  const overlay = new PartyOverlay();
  overlay.render(true);
});

Hooks.once("init", () => {
  console.log("League of Dungeoneers | Registering overlay settings");
  game.settings.register("league-of-dungeoneers", "partyMorale", {
    name: "Party Morale",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });

  game.settings.register("league-of-dungeoneers", "threatLevel", {
    name: "Threat Level",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });

  game.settings.register("league-of-dungeoneers", "overlayPosition", {
    name: "Overlay Position",
    scope: "world",
    config: false,
    type: Object,
    default: { top: 100, left: 300 }
  });

  game.settings.register("league-of-dungeoneers", "overlayLocked", {
    name: "Overlay Locked",
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });
});