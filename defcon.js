// if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
var squadmanage = require('squadManager');
var defcon = {
    run: function(roomname, creepsinroom)
    {
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
        var defconstuct = {
            defenceLevel: 10,
            attackLevel: 10
        };
        var mainflag = Game.flags[roomname];
        mainflag.memory.blocktranferIntoRoom = false;
        var numberofguardingcreeps = _.filter(creepsinroom, (creep) => creep.memory.role == 'guard');
        var numberOfHealParts = 0;
        var numberOfAttackParts = 0;
        var numberOfRangedParts = 0;
        var totalBodyParts = 0;
        var numberOfworkParts = 0;
        for(var i = 0; i < target.length; i++)
        {
            for(var j = 0; j < target[i].body.length; j++)
            {
                if(target[i].body[j].type == HEAL)
                {
                    numberOfHealParts++;
                }
                if(target[i].body[j].type == ATTACK)
                {
                    numberOfAttackParts++;
                }
                if(target[i].body[j].type == RANGED_ATTACK)
                {
                    numberOfRangedParts++;
                }
                if(target[i].body[j].type == WORK)
                {
                    numberOfworkParts++;
                }
                totalBodyParts++;
            }
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        var doretos = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS,
        {
            filter: (c) =>
            {
                return (c.owner.username == "Invader");
            }
        });
        if(spawnss.length != 0 && target != undefined && target.length != doretos.length)
        {
             var roomLevel = Game.rooms[roomname].controller.level;
        
          
            if(totalBodyParts >= 50 && totalBodyParts < 100)
            {
                  this.spawnBoostedarcher(roomname, 9 - roomLevel );
            }
              if(totalBodyParts ==   100)
            {
                  this.spawnBoostedarcher(roomname, 10 - roomLevel );
                     this.spawnBoostedattacker(roomname, 1);
            }
            
        
            else if(totalBodyParts > 100)
            {
                this.boostedBasicDefenders(roomname); 
                defconstuct.defenceLevel = 0;
            }
            if(totalBodyParts > 99 && roomLevel < 7)
            {
            this.CallForAid(roomname);
            
            }
                  if(totalBodyParts >= 300)
            {
             this.spawnBoostedattacker(roomname, 3);
        this.spawnBoostedarcher(roomname, 3);
            }
            
            
            
            if(spawnss[0].hits < 1000 && target.length != 0)
            {
                Game.rooms[roomname].controller.activateSafeMode()
            }
            mainflag.memory.blocktranferIntoRoom = false;
        }
        else
        {
            var mainflag = Game.flags[roomname];
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            if(spawnss.length == 0)
            {
                mainflag.memory.blocktranferIntoRoom = true;
                for(const id in Game.market.orders)
                {
                    //    console.log(JSON.stringify(Game.market.orders[id]));
                    if(Game.market.orders[id].roomName == roomname)
                    {
                        console.log("cancelling orders");
                        //         Game.market.cancelOrder(id);
                    }
                }
            }
        }
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
        if(target.length != 0)
        {
            defconstuct.defenceLevel = 1;
        }
        return defconstuct;
    },

CallForAid: function(roomname)
    {
  
  
  
  // find my rooms within 6 rooms and get a CloseCombatDuo 
  
  
  
  
  var targroom = "E24N3";
  
  
  
  
          var bodypartshead = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
         var bodypartstail = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
            if(Memory.squadObject['Gondor Calls For Aid'+roomname] == undefined)
            {
                squadmanage.initializeSquad('Gondor Calls For Aid'+roomname, [["forcemoveToRoom",roomname]], true, "duo", targroom,
                {
                    "head": bodypartshead,
                    "tail": bodypartstail,
                },"chasedown");
            }
  
  
   
  
  
  
  
  
  
   
  

},













    spawnBasicsquad: function(roomname)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            spawnss[i].spawnCreep(
                [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]
                ,'defenceduo'+roomname,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "chasedown",
                        memstruct:
                        {
                            spawnRoom: roomname,
                            tasklist: [
                                ["createslaveBOOST"],
                                ["boosAllMax"]
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
    },
    boostedBasicDefenders: function(roomname)
    {
        this.spawnBoostedattacker(roomname, 3);
        this.spawnBoostedarcher(roomname, 3);
    },
   
    spawnBoostedattacker: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 550) / 80);
        var bodyparts = [];
        if(numberofparts > 40)
        {
            numberofparts = 40;
        }
      
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(ATTACK);
        }
        for(let j = 0; j < 10; j++)
        {
            bodyparts.push(MOVE);
        }
        for(let o = 0; o < 2; o++)
        {
            var q = Game.spawns[roomname].spawnCreep(bodyparts,
                'cavalry' + roomname + number,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "cavalry",
                        memstruct:
                        {
                            spawnRoom: roomname,
                            tasklist: [
                                ["boosAllMax"],
                            ],
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: false,
                            hastask: false
                        }
                    }
                });
        }
    },
    spawnBoostedarcher: function(roomname,number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 500) / 150);
        var bodyparts = [];
        if(numberofparts > 40)
        {
            numberofparts = 40;
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(MOVE);
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            for(let o = 0; o < number; o++)
            {
                var q = spawnss[i].spawnCreep(bodyparts,
                    'archer' + roomname + o,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "archer",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [
                                    ["boosAllMax"],
                                ],
                                objectIDStorage: "",
                                boosted: false,
                                moveToRenew: false,
                                opportuniticRenew: false,
                                hastask: false
                            }
                        }
                    });
            }
        }
    },
}
module.exports = defcon;