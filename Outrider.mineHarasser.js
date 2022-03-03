var roompathfind = require('roompathfinder');
var outriderRoomHarraser = {

    pickTargetRoom: function(creep)
    {

        //    todo. kill keeps with a valid path that are no0t under ramparts 

        //   if no creeps to target then attack ramparts outside of close tower range. 

        var targets = [];
        var warList = Object.keys(Memory.hostileempires);
        for (var i = 0; i < warList.length; i++)
        {
            if (Memory.hostileempires[warList[i]].currentRelationship == "war")
            {

                for (var ii = 0; ii < Memory.hostileempires[warList[i]].listOFminingRooms.length; ii++)
                {
                    if (Memory.hostileempires[warList[i]].listOFminingRooms[ii] != creep.room.name)
                    {
                        targets.push(Memory.hostileempires[warList[i]].listOFminingRooms[ii]) // add list of rooms with confirmed hositiles in them and 
                    }
                }

                for (var ii = 0; ii < Memory.hostileempires[warList[i]].listOfBases.length; ii++)
                {
                    if (Memory.hostileempires[warList[i]].listOfBases[ii] != creep.room.name)
                    {
                        targets.push(Memory.hostileempires[warList[i]].listOfBases[ii]) // add list of rooms with confirmed hositiles in them and 
                    }
                }

            }
        }
 
        if (targets.length != 0)
        {
            return targets[Game.time % targets.length]
        }
    },
    decideToRetreatFromRoomAnjdMoveToAnotherRoom: function(creep)
    {
    

        if (creep.memory.attackrole == "dis")
        {

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,
            {
                filter: function(object)
                {
                    return object.structureType != STRUCTURE_CONTROLLER;
                }
            });

            if (!target)
            {
creep.say("ntarg")
                return true
            }
        }

        if (creep.memory.attackrole == "ranger" || creep.memory.attackrole == "atk")
        {

            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if (!target)
            {

                return true
            }
        }

    },

    attacker: function(creep)
    {

        var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target)
        {
            if (creep.attack(target) == ERR_NOT_IN_RANGE)
            {
             
            }   
            creep.moveTo(target);
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            {
                filter: function(object)
                {
                    return object.structureType != STRUCTURE_CONTROLLER;
                }
            });

            if (!target)
            {
               var roomobj = Game.rooms[creep.room.name];

            if(roomobj && roomobj.controller != undefined && roomobj.controller.owner != undefined && roomobj.controller.owner.username === "Q13214")
            {
                var target;
            }
            else
            {
                  var target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: function(object)
                            {
                                return (object.structureType != STRUCTURE_CONTROLLER && !object.my);
                            }
                        });
             
            }
            }

            if (target)
            {
                if (creep.attack(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
            }

        }

    },
    ranger: function(creep)
    {

        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (target)
        {
            if (creep.rangedAttack(target) == ERR_NOT_IN_RANGE)
            {
              
            }
                creep.moveTo(target);
        }
        else
        {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            {
                filter: function(object)
                {
                    return object.structureType != STRUCTURE_CONTROLLER;
                }
            });

            if (!target)
            {
               var roomobj = Game.rooms[creep.room.name];

            if(roomobj && roomobj.controller != undefined && roomobj.controller.owner != undefined && roomobj.controller.owner.username === "Q13214")
            {
                var target;
            }
            else
            {
                  var target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: function(object)
                            {
                                return (object.structureType != STRUCTURE_CONTROLLER && !object.my);
                            }
                        });
             
            }
            }


            if (target)
            {
                var targetarr = creep.room.find(FIND_HOSTILE_CREEPS);
                var range = creep.pos.getRangeTo(target);
                if (range <= 1)
                {
                   creep.rangedAttack(target)
                   
                   this.combatMove(creep,targetarr,target) // flees from structures
                }
                  else if (range <= 2)
                {
                   creep.rangedAttack(target)
                     this.combatMove(creep,targetarr,target) // flees from structures
                }
                else if (range <= 3)
                {
                   creep.rangedAttack(target)
                }
                
                else
                {
                    creep.moveTo(target);
                }











        
            }

        }

    },
    
        combatMove: function(creep, avoidarray, avoidclosest) // check if creep has damage parts
    {
        let goals = _.map(avoidarray, function(host)
        {
            return {
                pos: host.pos,
                range: 3
            };
        });
        let patha = PathFinder.search(creep.pos, goals,
        {
            flee: true
        }).path;
        creep.moveByPath(patha);
    },
    
    
    
    
    
    
    
    worker: function(creep)
    {

        var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: function(object)
            {
                return (object.structureType != STRUCTURE_CONTROLLER &&  object.structureType != STRUCTURE_WALL   &&  object.structureType != STRUCTURE_RAMPART    );
            }
        });

        if (!target)
        {
            
            
                   var target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
        {
            filter: function(object)
            {
                return object.structureType != STRUCTURE_CONTROLLER;
            }
        });
            
            
            
            
            if (!target)
        {
            
            var roomobj = Game.rooms[creep.room.name];

            if(roomobj && roomobj.controller != undefined && roomobj.controller.owner != undefined && roomobj.controller.owner.username === "Q13214")
            {
                var target;
            }
            else
            {
                  var target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                        {
                            filter: function(object)
                            {
                                return (object.structureType != STRUCTURE_CONTROLLER && !object.my);
                            }
                        });
             
            }
        }


        }
        
        
        
        
        
        

        if (target)
        {
            if (creep.dismantle(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target);
            }
        }

    },

    run: function(creep)
    {

        if (creep.memory.roomtarg == undefined || creep.memory.roomtarg == "resetRoomtarg")
        {

            creep.memory.roomtarg = this.pickTargetRoom(creep)

        }
        var temp = this.decideToRetreatFromRoomAnjdMoveToAnotherRoom(creep);

        if (temp == true &&   creep.memory.roomtarg == creep.room.name )
        {
            creep.memory.roomtarg = "resetRoomtarg"

        }
       else     if (creep.room.name == creep.memory.roomtarg && creep.room.name != creep.memory.memstruct.spawnRoom)
        {

            if (creep.memory.attackrole == "ranger")
            {

                this.ranger(creep)
            }
            if (creep.memory.attackrole == "dis")
            {

                this.worker(creep)
            }
            if (creep.memory.attackrole == "atk")
            {
                this.attacker(creep)

            }
            if (creep.memory.attackrole == "drop")
            {

            }

        }
        else if (creep.memory.roomtarg != undefined && creep.memory.roomtarg != "resetRoomtarg")
        {

            var rawPath = roompathfind.run(creep.memory.roomtarg, creep.room.name, 9);
            var finalPath = [];
            for (var q = 0; q < rawPath.length; q++)
            {
                finalPath.push(["lowcpumoveToRoom", rawPath[q]])
            }
            creep.memory.memstruct.tasklist = finalPath

        }

    }

};
module.exports = outriderRoomHarraser;