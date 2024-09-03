const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
const { open } = require("sqlite");
let db = null;
//database and server connection
const initialiseDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running Successfully...");
    });
  } catch (e) {
    console.log(`Error in database${e.message}`);
    process.exit(1);
  }
};
initialiseDatabase();
const convertDbObjectTOCamelcase = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

// API GET METHOD
app.get("/players/", async (request, response) => {
  let databaseCommand = `SELECT * FROM cricket_team;`;
  let playersList = await db.all(databaseCommand);
  response.send(
    playersList.map((eachPlayer) => {
      convertDbObjectTOCamelcase(eachPlayer);
    })
  );
});
//API POST METHOD
app.post("/players/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  let databaseCommand = `INSERT INTO circket_team 
    (player_name,jersey_number,role)
    VALUES (${playerName},${jerseyNumber},${role});`;
  await db.run(databaseCommand);
  response.send("Player Added to Team");
});
//API GET METHOD
app.get("/players/:playerId", async (request, response) => {
  const playerId = request.params;
  let databaseCommand = `SELECT * FROM 
    cricket_team WHERE player_id = ${playerId};`;
  let playerDetails = await db.get(databaseCommand);
  response.send(
    playerDetails.map((eachPlayer) => {
      convertDbObjectTOCamelcase(eachPlayer);
    })
  );
});
//API PUT METHOD
app.put("/players/:playerId", async (request, response) => {
  let playerId = request.params;
  let { playerName, jerseyNumber, role } = request.body;
  let databaseCommand = `UPDATE cricket_team 
    SET player_name = ${playerName},jersey_number=${jerseyNumber},role = ${role}
    WHERE player_id = ${playerId};`;
  await db.run(databaseCommand);
  response.send("Player Details Updated");
});

//API DELETE METHOD
app.delete("/players/:playerId", async (request, response) => {
  let playerId = request.params;
  let databaseCommand = `DELETE  FROM cricket_team 
  WHERE player_id = ${playerId};
  `;
  await db.run(databaseCommand);
  response.send("Player Removed");
});

module.exports = app;
