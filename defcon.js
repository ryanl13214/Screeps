// if an attack is happening it is given prioruty if they are fufilled then the next stage is also done ie in a siege then we will also harrase the mining opperations if they exist .   
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
            // dismantlers  
            if(numberOfworkParts > 15 && numberOfRangedParts < 5 && numberOfAttackParts < 5)
            {
                this.spawnRawAttacker(roomname);
            }
            else if(numberOfRangedParts == 0 && numberOfAttackParts == 0 && numberOfHealParts > 15)
            {
                this.spawnRawAttacker(roomname);
            }
            else if(totalBodyParts >= 50 && numberOfRangedParts > 20 && target.length < 4 && numberOfHealParts < 50 && numberOfAttackParts == 0)
            {
                this.spawnBasicsquad(roomname);
            }
            else if(totalBodyParts > 99)
            {
                this.boostedBasicDefenders(roomname); // basic groups
                defconstuct.defenceLevel = 0;
            }
            else if(totalBodyParts >= 50)
            {
                defconstuct.defenceLevel = 0;
                this.spawnBasicattacker(roomname);
                this.spawnBasicRanger(roomname);
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
    spawnRawAttacker: function(roomname)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            for(let o = 0; o < 4; o++)
            {
                spawnss[i].spawnCreep(
                    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'basicattacker' + roomname + o,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "attacker",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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
    },
    spawnBasicsquad: function(roomname)
    {
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            spawnss[i].spawnCreep(
                [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 
                'defenceduo'+roomname,
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
    spawnBasicRanger: function(roomname)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable) / 200);
        var bodyparts = [];
        if(numberofparts > 25)
        {
            numberofparts = 25;
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(RANGED_ATTACK);
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(MOVE);
        }
        numberOfRangersNeeded = 4;
        if(numberofparts < 16)
        {
            numberOfRangersNeeded = 30;
        }
        var spawnss = Game.rooms[roomname].find(FIND_MY_SPAWNS);
        for(let i = 0; i < spawnss.length; i++)
        {
            for(let o = 0; o < numberOfRangersNeeded; o++)
            {
                var q = spawnss[i].spawnCreep(bodyparts,
                    'guardranger' + o + roomname,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "archer",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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
    spawnBasicattacker: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 200) / 130);
        var bodyparts = [];
        if(numberofparts > 25)
        {
            numberofparts = 25;
        }
        for(let j = 0; j < numberofparts; j++)
        {
            bodyparts.push(ATTACK);
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
                    'guardcavalry' + o + roomname,
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "cavalry",
                            memstruct:
                            {
                                spawnRoom: roomname,
                                tasklist: [],
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
    spawnBoostedattacker: function(roomname, number)
    {
        var energyavailable = Game.rooms[roomname].energyCapacityAvailable;
        var numberofparts = Math.floor((energyavailable - 550) / 80);
        var bodyparts = [];
        if(numberofparts > 35)
        {
            numberofparts = 35;
        }
        for(let j = 0; j < 5; j++)
        {
            bodyparts.push(TOUGH);
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
        if(numberofparts > 35)
        {
            numberofparts = 35;
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
                    'cavalry' + roomname + o,
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