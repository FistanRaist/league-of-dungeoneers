import { LODActorSheet } from "./module/actor-sheet.mjs";

Hooks.once("init", async function () {
    console.log("League of Dungeoneers | Initializing system");

    // Register sheet
    console.log("LODActorSheet class:", LODActorSheet);
    Actors.registerSheet("league-of-dungeoneers", LODActorSheet, {
        makeDefault: true
    });
    console.log("Sheet registered successfully");
});

Hooks.once("ready", function () {
    console.log("League of Dungeoneers | System fully ready");
    console.log("Final registered sheets:", Object.keys(Actors.sheets));
});

Hooks.on("preCreateActor", (actor, data, options, userId) => {
    console.log("preCreateActor hook fired, data before:", data);
    const updateData = {};

    if (!data.img) {
        updateData.img = "systems/league-of-dungeoneers/assets/default-actor.png";
    }

    if (Object.keys(updateData).length > 0) {
        actor.updateSource(updateData);
    }

    console.log("preCreateActor, data after:", actor);
});