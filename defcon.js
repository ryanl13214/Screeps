// if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
var squadmanage = require('squadManager');
var defcon = {
    run: function(roomname, creepsinroom)
    {
        var defconstuct = {
            defenceLevel: 10,
            attackLevel: 10
        };
        
        
        
        
        
        
           var numberofpartsHARVESTER = Math.floor((Game.rooms[roomname].energyCapacityAvailable - 600) / 100);
           var fullbody=[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY]
                        if(numberofpartsHARVESTER > 38)
                    {
                        numberofpartsHARVESTER = 38;
                    }
                       for(let j = 0; j < numberofpartsHARVESTER; j++)
                    {
                        fullbody.push(WORK);
                    }
                
                
        
        
        
        
        
    
        
        
         
         for(let q = 0; q < 5; q++)
            {
      
             var flagsMain = Game.flags[roomname + "Rep"+q]
               
        
        
             
        
        var tasklistarr = [
                                    ["boost", "XLH2O", numberofpartsHARVESTER],
                                    ["moveToflag", roomname + "Rep"+q],
                                    ["holdrepair"]
                                ];
        
        
        
        
        
        
        
        if(flagsMain != undefined)
        {
            var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
            for(let i = 0; i < spawnss.length; i++)
            {
                spawnss[i].spawnCreep(
                    fullbody, roomname + "Rep"+q,
                    {
                        memory:
                        {
                            role: 'multi',
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: tasklistarr,
                                objectIDStorage: "",
                                boosted: false,
                                moveToRenew: false,
                                opportuniticRenew: true,
                                hastask: false
                            }
                        }
                    });
            }
        }
        
        
            }
        
        
        
        var target = Game.rooms[roomname].find(FIND_HOSTILE_CREEPS);
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
            Game.flags[roomname].memory.totalEnemyBodyParts = totalBodyParts;
       //     console.log(Game.rooms[roomname].controller.isPowerEnabled, "--", roomname);
            if(Game.rooms[roomname].controller.isPowerEnabled == true && totalBodyParts > 99)
            {
                var pwrspawn = Game.rooms[roomname].find(FIND_STRUCTURES,
                {
                    filter: (structure) =>
                    {
                        return (structure.structureType == STRUCTURE_POWER_SPAWN);
                    }
                });
                if(pwrspawn.length != 0)
                {
                    Game.powerCreeps["defender1"].spawn(pwrspawn[0]);
                }
            }
            
            
            
            var numberOfRangersNeeded = 0;
            var numberDamagePartsPerRanger=10;
            var enemyHealPtentail = 0;
            
            if(roomLevel == 6){
                numberDamagePartsPerRanger= numberDamagePartsPerRanger*12;
            }
            if(roomLevel == 7){
                 numberDamagePartsPerRanger= numberDamagePartsPerRanger*34;
            }
            if(roomLevel == 8){
                  numberDamagePartsPerRanger= numberDamagePartsPerRanger*40;  
            }
            enemyHealPtentail =   numberOfHealParts * 12;
            // - TOWERS HERE 
            
            numberOfRangersNeeded = Math.ceil(enemyHealPtentail / numberDamagePartsPerRanger);
       ///     console.log("numberOfRangersNeeded",numberOfRangersNeeded);
            
            if(numberOfRangersNeeded > 4 && roomLevel < 7)
            {
            //  console.log("aid");  
                numberOfRangersNeeded = 4;
                 this.CallForAid(roomname); 
                  this.spawnBoostedarcher(roomname,4);
            }
            else
            {
                       if(numberOfRangersNeeded > 2 )
            {
                numberOfRangersNeeded=2;
            }
                 this.spawnBoostedarcher(roomname,numberOfRangersNeeded);
            
            }
            
            
              
            
           if(numberOfAttackParts > 20){
                    this.spawnBoostedattacker(roomname, 1);
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
        
                        var roominrange = [];
                var roomsall = Object.keys(Game.rooms);
                var roomsobj = Game.rooms;
                for(var i = 0; i < roomsall.length; i++)
                {
                    if(roomsobj[roomsall[i]].controller != undefined)
                    {
                        if(roomsobj[roomsall[i]].controller.owner != undefined)
                        {
                            if( roomsobj[roomsall[i]].controller.owner.username === "Q13214" && roomsobj[roomsall[i]].controller.level == 8 )
                            {
                                if(Game.map.getRoomLinearDistance(roomname, roomsall[i]) < 6 && Game.map.getRoomLinearDistance(roomname, roomsall[i]) != 0)
                                {
                                    roominrange.push(roomsall[i]);
                                }
                            }
                        }
                    }
                }
        
        
        
        
        
        
        
        
        
        
        if(roominrange.length != 0 ){
                 // find my rooms within 6 rooms and get a CloseCombatDuo 
        var targroom = roominrange[0];
        var bodypartshead = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK];
        var bodypartstail =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];
        if(Memory.squadObject['Gondor Calls For Aid' + roomname] == undefined)
        {
            squadmanage.initializeSquad('Gondor Calls For Aid' + roomname, [
                ["forcemoveToRoom", roomname]
            ], true, "duo", targroom,
            {
                "head": bodypartshead,
                "tail": bodypartstail,
            }, "chasedown");
        }
        
        }else{
               this.spawnBoostedarcher(roomname,5);
        }
        
        
        
        
        
        
    
        
    },
    spawnBasicsquad: function(roomname)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            spawnss[i].spawnCreep(
                [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'defenceduo' + roomname,
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
    spawnBoostedarcher: function(roomname, number)
    { 
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 650) / 150);
        var bodyparts = [];
        if(numberofparts > 40)
        {
            numberofparts = 40;
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for(let j = 0; j < 10; j++)
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
   
    }
}
module.exports = defcon;