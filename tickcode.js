var squadmanage = require('squadManager');
var tickcode = {
    createBlinkySQuad: function(flagname)
    {
        var squadflag = Game.flags[flagname];
        var squadname = flagname.substring(4, flagname.length);
        if(squadflag.color == COLOR_RED)
        {
            if(Memory.squadObject[squadname] == undefined)
            {
                squadmanage.initializeSquad(squadname, [
                    ["movetoRoom", Game.flags[flagname].pos.roomName],
                    ["flagAttack", Game.flags[flagname].pos.roomName]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                });
            }
        }
    },
    sendClaimSquad: function(targetRoom,HomeRoom)
    {
    
    var Path = [["forcemoveToRoom", targetRoom]];
               
                for(var c = 0; c < 3; c++)
        {
            Game.spawns[HomeRoom].spawnCreep( [MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY],
            'repair'+c,
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
        
        Path.push(["claim"]);
        
        
          Game.spawns[HomeRoom].spawnCreep([MOVE,MOVE,MOVE,CLAIM],
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
    flagQuadSquads: function()
    {
        var gameflags = Game.flags;
        var keys = Object.keys(gameflags);
        var values = Object.values(gameflags);
        for(var c = 0; c < keys.length; c++)
        {
            var flagname = keys[c].substring(0, 4);
            if(values[c].color == COLOR_RED && flagname == "quad")
            {
                this.createBlinkySQuad(keys[c]);
            }
        }
    },
    run: function()
    {
        // walkaround room is E21N5
        this.flagQuadSquads();
        ///////////////////////////////////////////////////////////
        var roomob2j = Game.flags["qwe"];
        if(roomob2j != undefined)
        {
            var roomObj = roomob2j.room;
            var constructionSitess = roomObj.find(FIND_CONSTRUCTION_SITES);
            for(var c = 0; c < constructionSitess.length; c++)
            {
                constructionSitess[c].remove();
            }
            Game.flags["qwe"].remove();
        }   
        ////////////////////////////////////////
        
       // this.sendClaimSquad(targetRoom,HomeRoom)
        this.sendClaimSquad("E21S1","E25N1");
        ////////////////////////////////////////
        if(1 == 2)
        {
            
             if(1 == 1)
        {
             Game.spawns["E24N3"].spawnCreep(
            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'attackroomtert' ,{memory:{role: 'guard', attackrole :"",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"]  ,["boosAllMax"], ["moveToRoom", "E23N4"],["moveToRoom", "E23N2"]], objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
        }
            
            
            
            
            
            
            if(Memory.squadObject.testQuad2 == undefined && 1 == 1)
            {
                squadmanage.initializeSquad("testQuad2", [
                    ["movetoRoom", "E23N4"],
                    ["GeneralAttack", "E23N2"]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                });
            }
            if(Memory.squadObject.testQuad1 == undefined && 1 == 1)
            {
                squadmanage.initializeSquad("testQuad1", [
                    ["movetoRoom", "E23N4"],
                    ["GeneralAttack", "E23N2"]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                });
            }
            if(Memory.squadObject.testQuad3 == undefined && 1 == 1)
            {
                squadmanage.initializeSquad("testQuad3", [
                    ["movetoRoom", "E23N4"],
                    ["GeneralAttack", "E23N2"]
                ], true, "quad", "E24N3",
                {
                    "head1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail1": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "head2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
                    "tail2": [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                });
            }
        }
        /*  
        
        
              
        if(Memory.squadObject.testQuad2 == undefined && 1 == 1)
        {
            squadmanage.initializeSquad("testQuad2", [
                ["movetoRoom", "E23N4"],
                ["GeneralAttack", "E23N2"]
            ], true, "quad", "E24N3",
            {
                "head1": ,
                "tail1": ,
                "head2": ,
                "tail2": 
            });
        }
        
        /
        
        
        
        
        
        
        
        
        /*
       Game.market.changeOrderPrice('6113c2914e9e2a2f06a8749d', 51.95);
              6113c2914e9e2a2f06a8749d
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: "metal",
    price: 50.00,
    totalAmount: 50000,
    roomName: "E24N3"   
});


      
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: "composite",
    price: 20.00,
    totalAmount: 50000,
    roomName: "E24N3"   
});
 
       
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: "power",
    price: 20.00,
    totalAmount: 50000,
    roomName: "E24N3"   
});


     
        Game.market.createOrder({
    type: ORDER_BUY,
    resourceType: "metal",
    price: 55.00,
    totalAmount: 50000,
    roomName: "E24N3"   
});



      
        
       
       
            Game.spawns["E24N3"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,HEAL],
            'PlunderCreep',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E24N3",
                        tasklist: [
                            ["forcemoveToRoom", "E24N3"],
                     
                            ["withdraw" , "6116b4dc4ddc44d24b22485b","microchip"],
                            ["withdraw" , "6116b4dc4ddc44d24b22485b","wire"],
                                ["withdraw" , "61155e0a6c13c32da96872e3","composite"],
                               ["forcemoveToRoom", "E24N3"],
                                  ["deposit"],
                            ["repeat", 6]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
           
            
       
        
        
        
            Game.spawns["E28N5"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CLAIM,HEAL],
            'claimer',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E28N5",
                        tasklist: [
                            ["forcemoveToRoom", "E27N4"],
                        ["forcemoveToRoom", "E26N4"],   ["forcemoveToRoom", "E26N3"],   ["forcemoveToRoom", "E26N1"],
                               ["forcemoveToRoom", "E25N1"],
                                  ["claim"] 
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
           
               
            Game.spawns["E28N5"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            'repair',
            {
                memory:
                {
                    role: 'repair',
                    memstruct:
                    {
                        spawnRoom: "E28N5",
                        tasklist: [
                            ["forcemoveToRoom", "E27N4"],
                        ["forcemoveToRoom", "E26N4"],   ["forcemoveToRoom", "E26N3"],   ["forcemoveToRoom", "E26N1"],
                               ["forcemoveToRoom", "E25N1"]
                            
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
           
        
         
                    Game.spawns["E28N5"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            'repair2',
            {
                memory:
                {
                    role: 'repair',
                    memstruct:
                    {
                        spawnRoom: "E28N5",
                        tasklist: [
                            ["forcemoveToRoom", "E27N4"],
                        ["forcemoveToRoom", "E26N4"],   ["forcemoveToRoom", "E26N3"],   ["forcemoveToRoom", "E26N1"],
                               ["forcemoveToRoom", "E25N1"]
                            
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
       
               
               
            Game.spawns["E28N5"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            'repair',
            {
                memory:
                {
                    role: 'repair',
                    memstruct:
                    {
                        spawnRoom: "E28N5",
                        tasklist: [
                            ["forcemoveToRoom", "E27N4"],
                        ["forcemoveToRoom", "E26N4"],   ["forcemoveToRoom", "E26N3"],   ["forcemoveToRoom", "E26N1"],
                               ["forcemoveToRoom", "E25N1"]
                            
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
       
       
       
        
         */
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
        if(Memory.fiveTimer == undefined)
        {
            Memory.fiveTimer = true;
        }
        // name target room, boosted,typeofsquad,homeroom
        if(Game.time % 5 == 0)
        {
            Memory.fiveTimer = true;
        }
        //console.log( Memory.fiveTimer);
        if(Memory.fiveTimer == true)
        {
            Memory.fiveTimer = false;
        }
        //     ["withdraw" , "5f4e3d6138522b1096393b7d","tissue",optional value]
        //  clearroom  movetoRoom   guardroom  attackroom  killCreeps
        if(Memory.squadObject.testQuad2 == undefined && 1 == 2)
        {
            squadmanage.initializeSquad("testQuad2", [
                ["moveToRoom", "E24N4"],
                ["moveToRoom", "E25N4"],
                ["moveToRoom", "E25N5"],
                ["moveToRoom", "E24N5"],
                ["repeat", 4]
            ], false, "quad", "E24N3",
            {
                "head1": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL],
                "tail1": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL],
                "head2": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL],
                "tail2": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL]
            });
        }
        //       Memory.squadObject["testQuad"].arrayOfSquadGoals =[ ["movetoRoom","E29N5"],["movetoRoom","E29N4"],["repeat",2]];
        if(Memory.squadObject.testQuad2 == undefined && 1 == 2)
        {
            squadmanage.initializeSquad("testQuad2", [
                ["guardroom", "E26N5"]
            ], false, "quad", "E28N5",
            {
                "head1": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
                "tail1": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
                "head2": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
                "tail2": [MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL]
            });
        }
        //    delete   Memory.squadObject["testQuad"];
        // delete   Memory.squadObject["testQuad2"];
        //  Game.rooms['E19N2'].terminal.send("energy", 10000, 'E25N2',    'trade contract #1');
        /*
        
        
             
        
        
        
        */
        /*
       
       
        
                   Game.spawns["E24N3" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'remoteDefence'+Game.time ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E21N5"],["moveToRoom",   "E19N2"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   
       
           
        
                   Game.spawns["E24N31" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'remoteDefence1'+Game.time ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E21N5"],["moveToRoom",   "E19N2"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
   
       
       
       
       
       
       
       
        
       
       
       
       
       
       
       
        
       
        
           
       
       
       
                   Game.spawns["E19S4" ].spawnCreep(
          [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E19S4", tasklist: [ ["moveToRoom",   "E14S3"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
       
       
       
       
       
       
                  Game.spawns["E19S1" ].spawnCreep(
          [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"ranger",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E12N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
       
       
       
       
             Game.spawns["E19S1" ].spawnCreep(
           [MOVE,MOVE,MOVE,WORK,WORK,WORK]
           , 'basicroomdis1' ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E24N3", tasklist: [ ["moveToRoom",   "E12N1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
       
                       Game.spawns["E24N31" ].spawnCreep(
           [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
           , 'defeceduo' ,{memory:{role: 'guard', attackrole :"chasedown",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"]  ,["boosAllMax"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
           



   
        // tripple
        
        
                  Game.spawns["E24N31" ].spawnCreep(
           [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
           , 'basicroomdis2' ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E24N3", tasklist: [["createslaveBOOST"] ,["createslaveBOOST2"] ,["boosAllMax"],["moveToRoom",   "E21N5"],["moveToRoom",   "E19N0"],["moveToRoom",   "E17S1"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

        
        
           





        
                    
       
       
       
            
            squadmanage.initializeSquad(  "testQuad", ["E19S0"], false, "quad", "E19S1", {
                                    "head1": [RANGED_ATTACK ,MOVE],                                
                                    "tail1": [HEAL, MOVE],
                                    "head2": [RANGED_ATTACK ,MOVE],
                                    "tail2": [HEAL, MOVE ]
                                    });
        
                               Game.spawns["E19S4"].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
            'E19S4theiftal2l',
            {
                memory:
                {
                    role: 'multi',
                    memstruct:
                    {
                        spawnRoom: "E19S4",
                        tasklist: [
                            ["moveToRoom", "E21S4"],
                            ["steal", "terminal"],
                            ["steal", "factory"],
                            ["steal", "storage"],
                            ["forcemoveToRoom", "E19S4"],
                            ["deposit"],
                            ["repeat", 6]
                        ],
                        objectIDStorage: "",
                        boosted: false,
                        moveToRenew: false,
                        opportuniticRenew: true,
                        hastask: false
                    }
                }
            });
            
            
            
            
            
                   Game.spawns["E19S4" ].spawnCreep(
                  [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL]
                   
                   , 
  'basicroomdis1' ,{memory:{role: 'guard', attackrole :"chasedown",  memstruct:{spawnRoom: "E19S4", tasklist: [["moveToRoom",   "E20S4"]   ],
  objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });

            
            
            
            
            
            */
        //          Game.spawns["E24N32" ].spawnCreep([MOVE,RANGED_ATTACK,ATTACK], 'basic2roomattack1'    ,{memory:{role: 'guard', attackrole :"basicRoomAttacker",  memstruct:{spawnRoom: "E24N3", tasklist: [["boosAllMax"]    ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
        // Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack1'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
        //       Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack2'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
        //   Game.spawns["E21S121" ].spawnCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'basicroomattack3'    ,{memory:{role: 'guard', attackrole :"basicRoomDIS",  memstruct:{spawnRoom: "E21S12", tasklist: [["boosAllMax"],["moveToRoom",   "E18S9"]   ],objectIDStorage: "",boosted: false, moveToRenew: false, opportuniticRenew: true, hastask: false}} });
    }
}
module.exports = tickcode;