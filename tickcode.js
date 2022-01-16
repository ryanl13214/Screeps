/// red + begin with quadf spawns a flag attack squad
// yellow dismantle flags
// blue ranged targets
// brown stronghold Attack
var roompathfind = require('roompathfinder');
var squadmanage = require('squadManager');
var tickcode = {
    run: function()
    {
           // anti creep   var deathBlinker = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

        // generic 10 tougbht 30 heal 
        //     var bodypartstail =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        //   10 tought 15 heal 15 ranged 
        //         var bodypartshead =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        // 12 tough 14 range 14 heal 
        // var bodyp = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL];

        if (Game.time % 5000 == 0 || 1 == 2)
        {
            this.resetIntershardMemory();
        }

        if (Game.shard.name == "shard2")
        {
            this.flagControl();
            var squadname = "TEST"

            for (var name in Game.creeps)
            {
                if (Game.creeps[name])
                {
                    if (Game.creeps[name].memory.role == "mover")
                    {
                        //   Game.creeps[name].suicide()
                    }

                }
            }
            
            
             
             
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            ////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////
            
            
            // attack red idiot 
            
            
            
            
                 var squadname = "attacktest24"

            if (Memory.squadObject[squadname] == undefined && 1==2)
            {

                var finalPath = [];
var deathBlinker =   [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
var deathBlinker2 = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
         
                var rawPath = roompathfind.run("E23S4", "E25N1", 5);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["flagattack", "E23S4"]);
 
                squadmanage.initializeSquad(squadname, finalPath, true, "quad", "E25N1",
                {
                    "head1": deathBlinker,
                    "tail1": deathBlinker2,
                    "head2": deathBlinker,
                    "tail2": deathBlinker2
                }, "blinky");
 
            }
            
            
                 var squadname = "attacktest"

            if (Memory.squadObject[squadname] == undefined  && 1==2)
            {

                var finalPath = [];
var deathBlinker =  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
                var rawPath = roompathfind.run("E23S4", "E25N1", 5);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["flagattack", "E23S4"]);
 
                squadmanage.initializeSquad(squadname, finalPath, true, "quad", "E25N1",
                {
                    "head1": deathBlinker,
                    "tail1": deathBlinker,
                    "head2": deathBlinker,
                    "tail2": deathBlinker
                }, "blinky");
            
            }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
/* 
            var squadname = "blocker"

            if (Memory.squadObject[squadname] == undefined)
            {

                var finalPath = [];

                var deathBlinker = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

                var rawPath = roompathfind.run("E31N7", "E28N5", 0);
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["killcreeps", "E31N7"]);

                squadmanage.initializeSquad(squadname, finalPath, true, "quad", "E28N5",
                {
                    "head1": deathBlinker,
                    "tail1": deathBlinker,
                    "head2": deathBlinker,
                    "tail2": deathBlinker
                }, "blinky");

            }
            
            
            
            /////////////////////////////// renew safe 
            
                          var finalPath = [];
    finalPath.push(["boosAllMax"])
          finalPath.push(["withdraw", "storage", "G", 3000])
                var rawPath = roompathfind.run("E33N8", "E28N5", 0);
                
                for (var q = 0; q < rawPath.length; q++)
                {
                    finalPath.push(["forcemoveToRoom", rawPath[q]])
                }
                finalPath.push(["renewsafemode" ]);

            
            
            
               Game.spawns["E28N51"].spawnCreep( [TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
                    'dddd'  ,
                    {
                        memory:
                        {
                            role: 'multi',
                            memstruct:
                            {
                                spawnRoom: "E28N5",
                                tasklist: finalPath,
                                objectIDStorage: "",
                                boosted: false,
                                moveToRenew: false,
                                opportuniticRenew: true,
                                hastask: false
                            }
                        }
                    });

            
          */  
            
            
            
            
            
            /*
            const source = Game.getObjectById(creep.memory.sourceId);
    E25N1        6179ff29f80f54491c09b9b4
    E24N3        605688241132db6d0a6622b2
    E28N5        611c20ddff5d6464f2d084f1
            nuker.launchNuke(new RoomPosition(20,30, 'W1N1'));
            */
            
            
            
            
             
/////////////////////////////////////////////////////////////////////////////////////////////////////

   this.launchNukea();

        }
    },
    createBlinkySQuad: function(flagname)
    {
        var squadflag = Game.flags[flagname];
        var squadname = flagname.substring(4, flagname.length);
        if (squadflag.color == COLOR_RED)
        {
            if (Memory.squadObject[squadname] == undefined && squadflag.memory.bodyparts != undefined)
            {
                squadmanage.initializeSquad(squadname, [
                    ["movetoRoom", Game.flags[flagname].pos.roomName],
                    ["flagAttack", Game.flags[flagname].pos.roomName]
                ], true, "quad", "E24N3",
                {
                    "head1": squadflag.memory.bodyparts,
                    "tail1": squadflag.memory.bodyparts,
                    "head2": squadflag.memory.bodyparts,
                    "tail2": squadflag.memory.bodyparts
                }, "blinky");
            }
        }
    },
     launchNukea: function()
    {
         var manNukeFlag = Game.flags["nuke"];
       
         if(manNukeFlag == undefined)
         {
             return 0
         }else{
         var   roomname = manNukeFlag.pos.roomName;
         
                var roominrange = [];
                var roomsall = Object.keys(Game.rooms);
                var roomsobj = Game.rooms;
                for (var i = 0; i < roomsall.length; i++)
                {
               
                                if (Game.map.getRoomLinearDistance(roomname, roomsall[i]) < 10 &&  Game.flags["nuke"] != undefined)
                                {
                                    
                                    
                                    
                                    
                                            var nuker = Game.rooms[ roomsall[i]].find(FIND_MY_STRUCTURES,
                                        {
                                            filter:
                                            {
                                                structureType: STRUCTURE_NUKER
                                            }
                                        });
                                        if(nuker.length == 1){
                                    var a = nuker[0].launchNuke(Game.flags["nuke"].pos);
                                    if(a == 0 )
                                    {
                                         Game.flags["nuke"].remove()
                                        
                                        
                                          return 0
                                    }
                                            
                                        }
                                    
                                    
                                }
                    
                } 
                
                
                
                
         }
                
    },
    
    
    clearStronghold: function(roomname)
    {
        if (Memory.squadObject.testQuad2 == undefined && 3 == 1)
        {
            squadmanage.initializeSquad("testQuad2", [
                ["GeneralAttack", "E24N4"]
            ], true, "quad", "E24N3",
            {
                "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
            }, "blinky");
        }

        if (1 == 2)
        {
            Game.spawns["E24N3"].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
                'repdfghfff',
                {
                    memory:
                    {
                        role: 'multi',
                        memstruct:
                        {
                            spawnRoom: "E24N3",
                            tasklist: [
                                ["forcemoveToRoom", "E24N4"],
                                ["gatherstoredResources"],
                                ["forcemoveToRoom", "E24N3"],
                                ["deposit"],
                                ["repeat", 4]
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
    sendClaimSquad: function(targetRoom, HomeRoom)
    {
        var Path = [
            ["forcemoveToRoom", targetRoom]
        ];
        for (var c = 0; c < 3; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY],
                targetRoom + 'repair' + c,
                {
                    memory:
                    {
                        role: 'repair',
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        for (var c = 0; c < 3; c++)
        {
            Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, MOVE, ATTACK, RANGED_ATTACK, HEAL],
                targetRoom + 'chasedown' + c,
                {
                    memory:
                    {
                        role: 'guard',
                        attackrole: "chasedown",
                        memstruct:
                        {
                            spawnRoom: HomeRoom,
                            tasklist: Path,
                            objectIDStorage: "",
                            boosted: false,
                            moveToRenew: false,
                            opportuniticRenew: true,
                            hastask: false
                        }
                    }
                });
        }
        Path.push(["claim"]);
        Game.spawns[HomeRoom].spawnCreep([MOVE, MOVE, CLAIM, CLAIM],
            'claimer',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: HomeRoom,
                        tasklist: Path,
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
    },
    resetIntershardMemory: function()
    {
        InterShardMemory.setLocal("{}");
    },
    preventRebuild: function(homeroom, roomname)
    {
        Game.spawns[homeroom].spawnCreep(
            [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL], 'clear',
            {
                memory:
                {
                    role: 'guard',
                    attackrole: "ranger",
                    memstruct:
                    {
                        spawnRoom: homeroom,
                        tasklist: [
                            ["forcemoveToRoom", roomname]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: false,
                        hastask: false
                    }
                }
            });
        Game.spawns[homeroom].spawnCreep(
            [CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL], 'clear2',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: homeroom,
                        tasklist: [
                            ["forcemoveToRoom", roomname],
                            ["downgrade", roomname]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: false,
                        hastask: false
                    }
                }
            });
    },
    genrealPowerattack: function()
    {
        if (1 == 2) // if room is still active
        {
            if (1 == 1)
            {
                Game.spawns["E24N3"].spawnCreep(
                    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'attackroomtert',
                    {
                        memory:
                        {
                            role: 'guard',
                            attackrole: "roomDismantleOuterBunker",
                            memstruct:
                            {
                                spawnRoom: "E24N3",
                                tasklist: [
                                    ["createslaveBOOST"],
                                    ["boosAllMax"],
                                    ["moveToRoom", "E23N4"],
                                    ["moveToRoom", "E23N2"]
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
            if (Memory.squadObject.testQuad1 == undefined)
            {
                squadmanage.initializeSquad("testQuad1", [
                    ["movetoRoom", "E23N4"],
                    ["GeneralAttack", "E23N2"]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                }, "blinky");
            }
            if (Memory.squadObject.testQuad3 == undefined)
            {
                squadmanage.initializeSquad("testQuad3", [
                    ["movetoRoom", "E23N4"],
                    ["GeneralAttack", "E23N2"]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                }, "blinky");
            }
        }
    },
    flagControl: function()
    {
        var gameflags = Game.flags;
        var keys = Object.keys(gameflags);
        var values = Object.values(gameflags);
        var roomob2j = Game.flags["qwe"];
        if (roomob2j != undefined)
        {
            var roomObj = roomob2j.room;
            if (roomObj != undefined)
            {
                var constructionSitess = roomObj.find(FIND_CONSTRUCTION_SITES);
                for (var c = 0; c < constructionSitess.length; c++)
                {
                    constructionSitess[c].remove();
                }
                Game.flags["qwe"].remove();
            }
        }
        for (var c = 0; c < keys.length; c++)
        {
            if (values[c].color == COLOR_RED && keys[c].substring(0, 4) == "quad")
            {
                this.createBlinkySQuad(keys[c]);
            }
            if (values[c].color == COLOR_BROWN && keys[c].substring(0, 4) == "strong")
            {
                var roomname = values[c].memory.room;
                this.clearStronghold(roomname);
            }
        }
    }
}
module.exports = tickcode;