var Standardspwan = {
    run: function(roomname, defconlevel, storagevalue, roomExits, creepsinroom, energyavailable, energycurrentlyavailable, jacks, repairers, towermover, harvesters, movers, upgraders, resourcemover, extractor, nextroomharvester, scouts, numberofguardingcreeps, memstruct) {

        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);

        var extractorneeded = false;
        if (spawnss.length != 0) {
            var minerals = spawnss[0].room.MINERAL_REGEN_TIME; // will break spawns if there is no spawn in the room.
            if (minerals != 0) {
                extractorneeded = true;
            }
        }
        var levelOfController = Game.rooms[roomname].controller.level;
 
  
 var moversneeded =1;
 
 
 if(levelOfController<6){moversneeded=4;}
 
if(levelOfController==6){moversneeded=1;}
if(levelOfController>6){moversneeded=1;} 

var multiplyrepairerrs=1;
   var constructionsites = Game.rooms[roomname].find(FIND_CONSTRUCTION_SITES);
  
if(constructionsites.length > 10){
 
    multiplyrepairerrs += Math.floor(constructionsites.length /20);
} 
 
 
        for (var i = 0; i < spawnss.length; i++) {

            if (towermover == 0 && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue !=0) {
                // spawnss[i].spawnCreep([WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'towermover' + roomname,
                spawnss[i].spawnCreep([WORK,WORK, WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'towermover' + roomname, {
                    memory: {
                        memstruct: memstruct,
                        role: 'towermover',
                        working: false
                    }
                });
            } else if (resourcemover == 0 && spawnss[i].name == roomname && levelOfController >= 6) {
                spawnss[i].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], 'resourcemover' + roomname, {
                    memory: {
                        role: 'resmover',
                        working: false,
                        memstruct: memstruct
                    }
                });
            } else if (harvesters.length < 2) {

                var numberofparts = Math.floor((energyavailable - 350) / 100);
                var bodyparts = [CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                for (let j = 0; j < numberofparts; j++) {
                    bodyparts.push(WORK);

                }
                if (numberofparts > 8) {
                    bodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                }

                if (numberofparts > 12) {
                    bodyparts = [WORK,WORK, WORK,  WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                }

                if (harvesters.length == 0) {
                    spawnss[i].spawnCreep(bodyparts, 'harvester1' +
                        roomname, {
                            memory: {
                                role: 'harvester',
                                sourcetarget: 1,
                                memstruct: memstruct
                            }
                        });
                } else {

                    spawnss[i].spawnCreep(bodyparts, 'harvester' + (
                        harvesters[0].memory.sourcetarget + 1) % 2 + roomname, {
                        memory: {
                            role: 'harvester',
                            sourcetarget: (harvesters[0].memory.sourcetarget + 1) % 2,
                            memstruct: memstruct
                        }
                    });
                }
            } else if (movers.length < moversneeded  && levelOfController >= 3) {




                        var bodyparts  = Math.floor((energyavailable ) / 100);
                        if(levelOfController <= 6){
                            bodyparts  = Math.floor((energyavailable ) / 200);
                        }
                        if(bodyparts > 25){bodyparts  =25;}
                        var bodypartsMOVER = [];
                        for (let j = 0; j < bodyparts; j++) {
                            bodypartsMOVER.push(MOVE);
                            bodypartsMOVER.push(CARRY);
                        }

  
                spawnss[i].spawnCreep(bodypartsMOVER,
                    'mover' + Game.time, {
                        memory: {
                            role: 'mover',
                            cpuUsed: 0,
                            roomtarg: roomname,
                            target: "a",

                            full: false,
                            memstruct: memstruct
                        }
                    });
            } else if (scouts.length < 1 && levelOfController > 3) ///////////////////////////////////
            {
                spawnss[i].spawnCreep([MOVE], 'scout' + roomname, {
                    memory: {
                        memstruct: memstruct,
                        role: 'scout',
                        exitchosen: "a",
                        prevRoom: roomname
                    }
                });
            } else if (repairers.length <  1 * multiplyrepairerrs && levelOfController > 2 ){

                var bodyparts = [];

                var numberofparts = Math.floor(energyavailable / 350);
                if (numberofparts * 6 > 50) {
                    numberofparts = Math.floor(50 / 6);
                }
                var bodyparts = [];
                for (let i = 0; i < numberofparts; i++) {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }

                spawnss[i].spawnCreep(bodyparts, 'repair' + Game.time, {
                    memory: {
                        role: 'repair',
                        cpuUsed: 0,
                        roomtarg: roomname,
                        sourcetarget: Game.time % 2,

                        full: false,
                        memstruct: memstruct
                    }
                });
            } else if (extractor.length < 1 && extractorneeded && 1 == 2) //////////////////////////////////////////////
            {
                var numberofparts = Math.floor(energyavailable / 350);
                var bodyparts = [];
                for (let i = 0; i < numberofparts; i++) {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
                spawnss[i].spawnCreep(bodyparts, 'extractor' + Game.time, {
                    memory: {
                        role: 'extractor',
                        cpuUsed: 0,
                        depositId: false,
                        mineralType: "",
                        roomtarg: roomname,
                        sourcetarget: Game.time % 2,

                        full: false,
                        memstruct: memstruct
                    }
                });
            } else if (upgraders.length < 1) // add condition that ensures the source and controller are close together
            {

                var numberofparts = Math.floor((energyavailable - 400) / 100);
                var bodyparts = [];
                if (numberofparts > 5) {
                    numberofparts = 5;
                }
                for (let i = 0; i < numberofparts; i++) {
                    bodyparts.push(WORK);

                }
                bodyparts.push(CARRY);
                bodyparts.push(CARRY);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);

                spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time, {
                    memory: {
                        role: 'upgrader',
                        cpuUsed: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });
            } else if (nextroomharvester.length < roomExits.length && levelOfController > 5 && 1 == 2) ////////////////////////////////////////////////
            {
                var numberofparts = Math.floor(energyavailable / 350);
                if (numberofparts > 50) {
                    numberofparts = Math.floor(50 / 6);
                }
                var bodyparts = [];
                for (let i = 0; i < numberofparts; i++) {
                    bodyparts.push(WORK);
                    bodyparts.push(CARRY);
                    bodyparts.push(CARRY);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                    bodyparts.push(MOVE);
                }
                const roomExits = Game.map.describeExits(roomname);
                const roomnames = Object.values(roomExits);
                const resourcekeys = Object.keys(roomExits);
                if (nextroomharvester.length == 0 && levelOfController > 3) {
                    spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + roomnames[roomnames.length - 1], {
                        memory: {
                            role: 'nextroom',
                            cpuUsed: 0,
                            target: roomnames[roomnames.length - 1],
                            home: roomname,
                            sourcetarget: 0,

                            full: false,
                            memstruct: memstruct
                        }
                    });
                } else {
                    var takenrooms = []
                    for (var u = 0; u < nextroomharvester.length; u++) {
                        takenrooms += [nextroomharvester[u].memory.target];
                    }
                    for (var q = 0; q < roomnames.length; q++) {
                        var found = 0;
                        for (var u = 0; u < nextroomharvester.length; u++) {
                            if (roomnames[q] === String(nextroomharvester[u].memory.target)) {
                                found++;
                            }
                        }

                        if (found < 2 && levelOfController < 7 || found < 1) {

                            spawnss[i].spawnCreep(bodyparts, 'nextroom-' + roomname + "-" + roomnames[q] + " " + found, {
                                memory: {
                                    role: 'nextroom',
                                    cpuUsed: 0,
                                    target: roomnames[q],
                                    home: roomname,
                                    sourcetarget: 0,

                                    full: false,
                                    memstruct: memstruct
                                }
                            });
                        }
                    }
                }
            } else {
                /////////////// set squad spawnimng to true 

            }
        }
        //   console.log(Game.time%200);

        // end of spawns loop
    }
}
module.exports = Standardspwan;