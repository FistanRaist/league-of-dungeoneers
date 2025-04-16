export class LODActor extends Actor {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    console.log("LODActor _preCreate called, initial data:", data);

    const updateData = {};
    if (!data.type) {
      updateData.type = "character";
      console.log("LODActor _preCreate: Setting type to 'character'");
    }
    if (!data.system || typeof data.system.notes !== "string") {
      updateData.system = data.system || {};
      updateData.system.notes = "";
      console.log("LODActor _preCreate: Setting system.notes to empty string");
    }
    this.updateSource(updateData);
    console.log("LODActor _preCreate, final source:", this._source);
  }
}