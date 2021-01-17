var squadmanage = require('squadManager');
var squadgenerator = {
    run: function(roomname, redflags) {
        var mainflag = Game.flags[roomname];
        if (mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length != 0) {
            var squads = Memory.squadObject;
            var squadnames = Object.keys(squads);
            
            // creating damage squads
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            for (l = 0; l < mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length; l++) {
                var found = false;
                for (q = 0; q < squadnames.length; q++) {
                    if (squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerdamagesquad") || squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager")) {
                        found = true;
                    }
                }
                var centerxposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(1, 3);
                var centeryposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(4, 5);
                if (centerxposition == "25" && centeryposition == "5") {
                    found = true;
                }
                if (!found) {
                    var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                    squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "solocenterdamager", roomname, {
                        "solo": [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    });
                }
            }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // creating mineing squads  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            for (l = 0; l < mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange.length; l++) {
                var squadAlreadyExists = false;
                var damagesquadready = false;
                for (q = 0; q < squadnames.length; q++) {
                    if (squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad")) {
                        squadAlreadyExists = true;
                    }
                }
                for (q = 0; q < squadnames.length; q++) {
                    if ((squadnames[q] == (roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager") && Memory.squadObject[roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "solocenterdamager"].squadisready == true)) {
                        damagesquadready = true;
                    }
                }
                var centerxposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(1, 3);
                var centeryposition = mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l].substring(4, 5);
                if (centerxposition == "25" && centeryposition == "5") {
                    damagesquadready = true;
                }
                if (!squadAlreadyExists && damagesquadready) {
                    var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
                    var numberofparts = Math.floor((energyavailable - 200) / 150);
                    var bodypartsMINER = [CARRY, CARRY, MOVE, MOVE];
                    for (let j = 0; j < numberofparts; j++) {
                        bodypartsMINER.push(MOVE);
                        bodypartsMINER.push(WORK);
                    }
                    var bodypartsfixer = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL];
                    var numberofparts = Math.floor((energyavailable) / 100);
                    if (numberofparts > 25) {
                        numberofparts = 25;
                    }
                    var bodypartsMOVER = [];
                    for (let j = 0; j < numberofparts; j++) {
                        bodypartsMOVER.push(MOVE);
                        bodypartsMOVER.push(CARRY);
                    }
                    squadmanage.initializeSquad(roomname + mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l] + "centerMiningSquad", [mainflag.memory.flagstruct.claimedroomstuct.centerroomsinrange[l]], false, "centerMiningSquad", roomname, {
                        "mover1": bodypartsMOVER,
                        "mover2": bodypartsMOVER,
                        "mover3": bodypartsMOVER,
                        "mover4": bodypartsMOVER,
                        "mover5": bodypartsMOVER,
                        "miner0": bodypartsMINER,
                        "miner1": bodypartsMINER,
                        "miner2": bodypartsMINER,
                        "fixer": bodypartsfixer,
                    });
                }
            }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }
    }
}
module.exports = squadgenerator;