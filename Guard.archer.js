 
var guardArcher = {
    /** @param {Creep} creep **/
    
       getFreeRamparts: function(creep,target)
    {
        var ramparts = target.pos.findInRange(FIND_STRUCTURES, 3,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });
            var freeRamparts = [];
            for (var i = 0; i < ramparts.length; i++)
            {
                var psotiontaken = false;
                var targets2 = ramparts[i].pos.findInRange(FIND_MY_CREEPS, 0);
                if (targets2.length == 0)
                {
                    freeRamparts.push(ramparts[i]);
                }

            } 
            
            return freeRamparts;
    },
    
      scoretarget: function(targ)
    {
        // positive numbers no creeps nearby attacking
        // next to a rampart
        
        
        var score = 0;
        var ramparts = targ.pos.findInRange(FIND_STRUCTURES, 3,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });
        if(ramparts.length > 1)
        {score++;
            
        }
           var myc = targ.pos.findInRange(FIND_MY_CREEPS, 3,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_RAMPART);
                }
            });
        if(ramparts.length ==0)
        {
            score++;
            
        }
        
     return score;  
        
    },
       gettarget: function(creep)
    {
          var target = creep.room.find(FIND_HOSTILE_CREEPS,
            {
                filter: (res) =>
                {
                    return (res.body.length > 1);
                }
            });
        var scores=[];
           for (var xx = 0; xx < target.length; xx++)
                        {
                scores.push(this.scoretarget(target[xx])); 
                        }
                        
                    var highscore=0;
                    var countere=0
         
           for (var xx = 0; xx < target.length; xx++)
                        {
         if(scores[xx] > highscore)
         {
              highscore=scores[xx] ;
                     countere=xx
         }
         
         
         
                        }
         return target[countere]
         
         
                        
    },
    
       run: function(creep)
    {
 
     
            var target   = this.gettarget(creep)
     

        //////////////////////////////// end of target selection 

        if (target)
        {
           
        var    freeRamparts = this.getFreeRamparts(creep,target)

           
          

             
if(freeRamparts.length != 0){
                    this.SafeMove(creep, freeRamparts[0].pos, 0)
}
        }
       this.recycleboost(creep)
        this.handleattacks(creep);
    },

       SafeMove: function(creep, target, prio)
    {
        var path = creep.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals = {
            pos: target,
            range: 0
        };
        let ret = PathFinder.search(
            creep.pos, target,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 5,
                swampCost: 15,
                roomCallback: function(roomName)
                {
                    let room = creep.room;
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;
                    var terrain = new Room.Terrain(roomName);

                    room.find(FIND_HOSTILE_CREEPS).forEach(function(cre)
                    {
                        for (var xx = -3; xx < 3; xx++)
                        {
                            for (var yy = -3; yy < 3; yy++)
                            {
                                costs.set(cre.pos.x + xx, cre.pos.y + yy, 200);
                            }
                        }
                    });

                    room.find(FIND_MY_STRUCTURES).forEach(function(struct)
                    {
                        if ((struct.structureType == STRUCTURE_RAMPART && struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        }
                    });
                    room.find(FIND_MY_POWER_CREEPS).forEach(function(cre)
                    {
                        costs.set(cre.pos.x, cre.pos.y, 0xff);
                    });

                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                        if (struct.structureType !== STRUCTURE_CONTAINER && struct.structureType !== STRUCTURE_ROAD && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });
                    room.find(FIND_MY_CREEPS).forEach(function(cre)
                    {
                        costs.set(cre.pos.x, cre.pos.y, 10);
                    });
                    return costs;
                },
            }
        );
        var pos = ret.path[0];
        creep.say("a");

        if (prio == 0)
        {
            var col = "blue"
        }
        else
        {
            var col = "red"
        }

        for (var xx = 0; xx < ret.path.length; xx++)
        {
            Game.rooms[creep.room.name].visual.circle(ret.path[xx].x, ret.path[xx].y,
            {
                fill: 'transparent',
                radius: 0.1,
                stroke: col
            });
        }
        if (prio == 1 && ret.path.length != 0)
        {
            if (ret.path[0].roomName == creep.room.name)
            {
                var found = ret.path[0].lookFor(LOOK_CREEPS);

                if (found.length != 0)
                {

                    found[0].moveTo(creep)
                }
            }

        }

        return creep.moveTo(pos);
    },
       decideMassAttack: function(creep)
    {
        var enemiesInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        var structuresInRange = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        var enemiesInRange2 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        var structuresInRange2 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 2);
        var enemiesInRange3 = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var structuresInRange3 = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);

        var counter = 0;
        counter += enemiesInRange.length * 10;
        counter += structuresInRange.length * 10;
        counter += enemiesInRange2.length * 4;
        counter += structuresInRange2.length * 4;
        counter += enemiesInRange3.length;
        counter += structuresInRange3.length;

        if (counter > 10)
        {
            creep.memory.damageThisTick = counter;
            return true;
        }
        else
        {
            creep.memory.damageThisTick = 10;
            return false;
        }

        return true;
    },
    handleattacks: function(creep)
    {
        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        var decideMassAttack = this.decideMassAttack(creep);
        if (decideMassAttack)
        {
            creep.rangedMassAttack();
        }
        else if (targets.length > 0)
        {
            creep.rangedAttack(targets[0]);
        }
    },
       recycleboost: function(creep)
    {
        if (creep.ticksToLive < 60)
        {
            var mainflag = creep.room.storage;
            if (mainflag)
            {
                var targpos = new RoomPosition(mainflag.pos.x - 4, mainflag.pos.y + 3, creep.room.name)

                var lab = targpos.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_LAB && res.cooldown < 10);
                    }
                });

                var targpos2 = new RoomPosition(mainflag.pos.x - 4, mainflag.pos.y - 1, creep.room.name)

                var lab2 = targpos2.findInRange(FIND_STRUCTURES, 1,
                {
                    filter: (res) =>
                    {
                        return (res.structureType == STRUCTURE_LAB && res.cooldown < 10);
                    }
                });

                if (lab.length != 0)
                {
                    if (targpos.x != creep.pos.x || targpos.y != creep.pos.y)
                    {
                        creep.moveTo(targpos);
                    }
                    else if (targpos.x == creep.pos.x && targpos.y == creep.pos.y)
                    {
                        lab[0].unboostCreep(creep);
                    }
                }
                else if (lab2.length != 0)
                {
                    if (targpos2.x != creep.pos.x || targpos2.y != creep.pos.y)
                    {
                        creep.moveTo(targpos2);
                    }
                    else if (targpos2.x == creep.pos.x && targpos2.y == creep.pos.y)
                    {
                        lab2[0].unboostCreep(creep);
                    }

                }

            }

        }
    },
    
    
};
module.exports = guardArcher;