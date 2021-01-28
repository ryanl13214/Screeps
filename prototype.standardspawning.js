var Standardspwan = {
    run: function(roomname, defconlevel, storagevalue, roomExits, creepsinroom, energyavailable, energycurrentlyavailable, jacks, repairers, towermover, harvesters, movers, upgraders, resourcemover, extractor, nextroomharvester, scouts, numberofguardingcreeps, memstruct) {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        var extractorneeded = false;
        if (spawnss.length != 0) {
            
            var minerals = Game.rooms[roomname].find(FIND_MINERALS)[0].mineralAmount; // will break spawns if there is no spawn in the room.
            if (minerals > 0) {
                extractorneeded = true;
            }
            
        } 
        var levelOfController = Game.rooms[roomname].controller.level;
        var moversneeded = 1;
        if (levelOfController < 6) {
            moversneeded = 4;
        }
        if (levelOfController == 6) {
            moversneeded = 2;
        }
        if (levelOfController == 7) {
            moversneeded = 2;
        }
        
        if (levelOfController > 7) {
            moversneeded = 1;
        }
        var multiplyrepairerrs = 1;
        var constructionsites = Game.rooms[roomname].find(FIND_CONSTRUCTION_SITES);
        if (constructionsites.length > 10) {
            multiplyrepairerrs += Math.floor(constructionsites.length / 20);
        }
        var ups = 0;
        if (roomname == "E24N3") {
        //    multiplyrepairerrs = 6;
        moversneeded++;
        moversneeded++;
            ups=3;
        }
        for (var i = 0; i < spawnss.length; i++) {
            if (towermover == 0 && spawnss[i].name == roomname && levelOfController >= 4 && storagevalue != 0) {
                var bpodyparts = [  CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE];
                if (storagevalue > 990000 && levelOfController > 4) {
                  
                    bpodyparts.push(WORK);
                    bpodyparts.push(WORK);
                }
   
                        if (roomname == "E24N3") {
               bpodyparts.push(WORK);
                    bpodyparts.push(WORK);
                            bpodyparts.push(WORK);
                    bpodyparts.push(WORK);
        }
                // spawnss[i].spawnCreep([WORK, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE], 'towermover' + roomname,
                spawnss[i].spawnCreep(bpodyparts, 'towermover' + roomname, {
                    memory: {
                        memstruct: memstruct,
                        role: 'towermover',
                        working: false
                    }
                });
            } else if (resourcemover == 0 && spawnss[i].name == roomname && levelOfController >= 6) {
                spawnss[i].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, WORK, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], 'resourcemover' + roomname, {
                    memory: {
                        role: 'resmover',
                        working: false,
                        neededBoost: "",
                        memstruct: memstruct
                    }
                });
            } else if (harvesters.length < 2) {
                var numberofparts = Math.floor((energyavailable - 350) / 150);
                var bodyparts = [CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                for (let j = 0; j < numberofparts; j++) {
                    bodyparts.push(WORK);
                }
                if (numberofparts > 8) {
                    bodyparts = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                }
                if (numberofparts > 12) {
                    bodyparts = [ WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
                }
                if (harvesters.length == 0) {
                    spawnss[i].spawnCreep(bodyparts, 'harvester1' + roomname, {
                        memory: {
                            role: 'harvester',
                            sourcetarget: 1,
                            memstruct: memstruct
                        }
                    });
                } else {
                    spawnss[i].spawnCreep(bodyparts, 'harvester' + (harvesters[0].memory.sourcetarget + 1) % 2 + roomname, {
                        memory: {
                            role: 'harvester',
                            sourcetarget: (harvesters[0].memory.sourcetarget + 1) % 2,
                            memstruct: memstruct
                        }
                    });
                }
            } else if (movers.length < moversneeded && levelOfController >= 3) {
                var bodyparts = Math.floor((energyavailable) / 100);
                if (levelOfController <= 6) {
                    bodyparts = Math.floor((energyavailable) / 200);
                }
                if (bodyparts > 25) {
                    bodyparts = 25;
                }
                var bodypartsMOVER = [];
                for (let j = 0; j < bodyparts; j++) {
                    bodypartsMOVER.push(MOVE);
                    bodypartsMOVER.push(CARRY);
                }
                spawnss[i].spawnCreep(bodypartsMOVER, 'mover' + Game.time, {
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
             
                
                
            } else if (repairers.length < 1 * multiplyrepairerrs && levelOfController > 2) {
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
            } else if (extractor.length < 1 && extractorneeded) {
                var numberofparts = Math.floor(energyavailable / 350);
           if (numberofparts > 8) {
                    numberofparts = 8;
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
            } else if (upgraders.length < 1 + ups) // add condition that ensures the source and controller are close together
            {
                var numberofparts = Math.floor((energyavailable - 600) / 100);
                var bodyparts = [];
                if (numberofparts > 5) {
                    numberofparts =5;
                }
                for (let i = 0; i < numberofparts; i++) {
                    bodyparts.push(WORK);
                }
                bodyparts.push(CARRY);
                bodyparts.push(CARRY);
                bodyparts.push(CARRY);
                bodyparts.push(CARRY);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                bodyparts.push(MOVE);
                
                if (roomname == "E24N3") {
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    bodyparts.push(WORK);
                                        bodyparts.push(WORK);
                    bodyparts.push(WORK);
                    
                    
                     memstruct.tasklist =[["boost", "GH2O", 20]];
                }
                
          
                
                
                
                
                spawnss[i].spawnCreep(bodyparts, 'upgrader' + Game.time, {
                    memory: {
                        role: 'upgrader',
                        cpuUsed: 0,
                        full: false,
                        memstruct: memstruct
                    }
                });
            }  
        }
        //   console.log(Game.time%200);
        // end of spawns loop
    }
}
module.exports = Standardspwan;