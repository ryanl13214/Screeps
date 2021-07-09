 var GlobalFunctions = require('GlobalCreepFuntions');
var quadsquad = {
    createCostmatric: function(posision, creep, combatRange) {},
    getProperPositionForQuadSquad: function(posision, creep, combatRange)
    {
        var posx = posision.x;
        var posy = posision.y;
        var posroom = posision.roomName;
        // close combat ranges
        var posArray = [
            [-1, 0],
            [-1, -1],
            [0, -2],
            [1, -2],
            [0, 1],
            [1, 1],
            [2, 0],
            [2, -1]
        ];
        // rangerd attack
        var posArray2 = [
            [-2, -2],
            [-2, -1],
            [-2, 0],
            [-2, 1],
            [3, -2],
            [3, -1],
            [3, 0],
            [3, 1],
            [-1, -3],
            [0, -3],
            [1, -3],
            [2, -3],
            [-1, 2],
            [0, 2],
            [1, 2],
            [2, 2]
        ];
        if(combatRange = 1)
        {
            var array = posArray;
        }
        else
        {
            var array = posArray2;
        }
        var returnPos =  new RoomPosition(24,25 ,creep.room.name);
        for(var c = 0; c < array.length; c++)
        {
            var skip = false;
            try{
            var newpos = new RoomPosition(posx + array[c][0], posy + array[c][1], posroom);
            }catch(e){
               skip = true;
            }
            if(skip == false){
              
            var path = creep.room.findPath(creep.pos, newpos);
             
            if( path[path.length - 1].x ==newpos.x && path[path.length - 1].y ==  newpos.y      )
            {  
                   Game.rooms[creep.room.name].visual.circle(newpos.x ,newpos.y,    {fill: 'solid', radius: 0.55, stroke: 'red'});
     
                returnPos= newpos;
            }else{
                 Game.rooms[creep.room.name].visual.circle(newpos.x ,newpos.y,    {fill: 'solid', radius: 0.55, stroke: 'blue'});
     
            }
            
            
            
            }
        }
        
        
        return returnPos;
    },
    moveIntoFormation: function(leaderid, squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            if(mainMemoryObject.SquadMembersCurrent[c] != leaderid)
            {
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var leader = Game.getObjectById(leaderid);
        var found1 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name));
        var found2 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name));
        var found3 = leader.room.lookForAt(LOOK_CREEPS, new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name));
        for(var c = 0; c < all.length; c++)
        {
            var alreadyInCube = false;
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                all[c].say("tl");
                alreadyInCube = true;
            }
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("bl");
                alreadyInCube = true;
            }
            if(all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                all[c].say("br");
                alreadyInCube = true;
            }
            if(!alreadyInCube)
            {
                all[c].say("ftr");
                if(found1.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if(found2.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x - 1, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
                else if(found3.length == 0)
                {
                    var targpos = new RoomPosition(leader.pos.x, leader.pos.y + 1, leader.room.name);
                    all[c].moveTo(targpos);
                }
            }
        }
    },
    checkIfInCube: function(squadID, leaderid)
    {
        var InCube = 0;
        var mainMemoryObject = Memory.squadObject[squadID];
        var leader = Game.getObjectById(leaderid);
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for(var c = 0; c < all.length; c++)
        {
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y)
            {
                InCube++;
            }
            if(all[c].pos.x == leader.pos.x - 1 && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
            if(all[c].pos.x == leader.pos.x && all[c].pos.y == leader.pos.y + 1)
            {
                InCube++;
            }
        }
        if(InCube == 3)
        {
            return true;
        }
        return false;
    },
    decideLeader: function(squadID)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var allSpacesFree = false;
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        for(var c = 0; c < all.length; c++)
        {
            var squadNearBorder = false;
            if(all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47)
            {
                squadNearBorder = true;
            }
            if(!squadNearBorder)
            {
                var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y, all[c].room.name));
                if(foundS.length == 0)
                {
                    var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x - 1, all[c].pos.y + 1, all[c].room.name));
                    if(foundS.length == 0)
                    {
                        var foundS = all[c].room.lookForAt(LOOK_STRUCTURES, new RoomPosition(all[c].pos.x, all[c].pos.y + 1, all[c].room.name));
                        if(foundS.length == 0)
                        {
                            allSpacesFree = true;
                            return all[c].id;
                        }
                    }
                }
            }
        }
        return all[0].id; // leader is blocked
    },
    moveAsOne: function(squadID, diretion)
    {
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
      var fatigueAll =0;
         for(var c = 0; c < all.length; c++)
        {fatigueAll+= all[c].fatigue;
             
             
        }
        
        if(fatigueAll==0){
        
        for(var c = 0; c < all.length; c++)
        {
            all[c].move(diretion);
        }}
    },
    CheckIfLeaderIsDead: function(squadID)
    {
        return false;
    },
    leaderBlocked: function(squadID)
    {
        return false;
    },
    getDirectionToTarget: function(squadID, leaderid, target)
    {
        var leader = Game.getObjectById(leaderid); // pathfinding here
        var path = leader.pos.findPathTo(target);
        // use the target finder for the displaced targets
        let goals  = {
                pos: target,
                range: 0
            };
            
        let ret = PathFinder.search(
            leader.pos, target,
            {
                // We need to set the defaults costs higher so that we
                // can set the road cost lower in `roomCallback`
                plainCost: 1,
                swampCost: 10,
                roomCallback: function(roomName)
                {
                    let room = Game.rooms[roomName];
                    // In this example `room` will always exist, but since 
                    // PathFinder supports searches which span multiple rooms 
                    // you should be careful!
                    if(!room) return;
                    let costs = new PathFinder.CostMatrix;
                    room.find(FIND_STRUCTURES).forEach(function(struct)
                    {
                          if(struct.structureType !== STRUCTURE_CONTAINER && (struct.structureType !== STRUCTURE_RAMPART || !struct.my))
                        {
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                            costs.set(struct.pos.x, struct.pos.y - 1, 0xff);
                            costs.set(struct.pos.x + 1, struct.pos.y - 1, 0xff);
                            costs.set(struct.pos.x + 1, struct.pos.y, 0xff);
                        }
                    });
                    var terrain = new Room.Terrain(roomName);
                     for(var xx = 1; xx < 49; xx++)
                    {
                        for(var yy = 1; yy < 49; yy++)
                        {
                            if(terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                            {
                                costs.set(xx,   yy, 0xff);
                            }
                            if(terrain.get(xx, yy) == TERRAIN_MASK_WALL)
                            {
                             costs.set(xx,   yy, 0xff);
                            }
                            if(terrain.get(xx - 1, yy) == TERRAIN_MASK_WALL)
                            {
                             costs.set(xx,   yy, 0xff);
                            }
                            if(terrain.get(xx, yy + 1) == TERRAIN_MASK_WALL)
                            {
                               costs.set(xx,   yy, 0xff);
                            }
                            if(terrain.get(xx - 1, yy + 1) == TERRAIN_MASK_WALL)
                            {
                              costs.set(xx,   yy, 0xff);
                            }
                        }
                    }
                    return costs;
                },
            }
        );
        let pos = ret.path[0];
   //     creep.move(leader.pos.getDirectionTo(pos));
        return leader.pos.getDirectionTo(pos);
    },
    targetAquisitionPURECOMBAT: function(squadID, leaderid)
    {
        // depending on squad type 
        // deconstruct ----------------- pure structure targeting maybe avoid defencive creeps
        // blinky      ----------------- mainly creep vs creep combat 
        // attack      ----------------- squad hunter and structure 
         var mainMemoryObject = Memory.squadObject[squadID];
        
          var leader = Game.getObjectById( mainMemoryObject.leader);
          
       
        
          var target = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(target != undefined){
            return new RoomPosition(target.pos.x,target.pos.y,leader.room.name   );
        }else{
            return 0; 
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    },
    loopTasks: function(squadID, tasklist)
    {
        //     console.log(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
        if(tasklist[tasklist.length - 1][0] == "repeat")
        {
            //   creep.say(creep.memory.memstruct.tasklist[creep.memory.memstruct.tasklist.length - 1][0]);
            if(tasklist[tasklist.length - 1][1] + 1 == tasklist.length)
            {
                var tmpstore = tasklist[tasklist.length - 1]
                var back = tasklist.splice(0, 1);
                tasklist[tasklist.length - 1] = back[0];
                tasklist.push(tmpstore);
            }
            else
            {
                tasklist.splice(0, 1);
            }
        }
        else
        {
            tasklist.splice(0, 1);
        }
        Memory.squadObject[squadID].arrayOfSquadGoals = tasklist;
    },
    TaskList: function(squadID)
    {
        //tasks 
        //clear room (kill all hostiles)
        //guard room
        // attack room
        // kill creep(Also used for squads so provide list of targety creeps)
        //arrayOfSquadGoals
        var mainMemoryObject = Memory.squadObject[squadID];
        var tasklist = mainMemoryObject.arrayOfSquadGoals;
        var leaderid = Memory.squadObject[squadID].leader;
        if(tasklist.length != 0 && tasklist[0] != undefined)
        {
            if(tasklist[0][0] == "clearroom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if(range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            
                            if(targetTmp == 000)
                            {
                                this.loopTasks(squadID, tasklist);
                            }else{
                             return     this.getProperPositionForQuadSquad(targetTmp, leader, 3);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if(tasklist[0][0] == "movetoRoom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                    if(range < 23)
                    {
                        this.loopTasks(squadID, tasklist);
                    }
                    else
                    {
                        return new RoomPosition(25, 25, tasklist[0][1]);
                    }
                }
            }
            if(tasklist[0][0] == "guardroom")
            {
                if(Memory.squadObject[squadID].leader != undefined)
                {
                    // deteck hostile creeps and room match 
                    var leader = Game.getObjectById(leaderid);
                    if(Memory.squadObject[squadID].leader != undefined)
                    {
                        // deteck hostile creeps and room match 
                        var leader = Game.getObjectById(leaderid);
                        var range = leader.pos.getRangeTo(new RoomPosition(25, 25, tasklist[0][1]));
                        if(range < 23)
                        {
                            var targetTmp = this.targetAquisitionPURECOMBAT(squadID, leaderid);
                            
                            if(targetTmp == 0)
                            {
                                return new RoomPosition(25, 25, tasklist[0][1]); // stay in room and move to mid
                            }else{
                              return     this.getProperPositionForQuadSquad(targetTmp, leader, 3);
                            }
                        }
                        else
                        {
                            return new RoomPosition(25, 25, tasklist[0][1]);
                        }
                    }
                }
            }
            if(tasklist[0][0] == "attackroom")
            {}
            if(tasklist[0][0] == "killCreeps")
            {}
        }
    },
    run: function(squadID)
    {
   // delete Memory.squadObject["testQuad2"];
        //    console.log("serpent control");
        var mainMemoryObject = Memory.squadObject[squadID];
        var all = [];
        var target;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            // cound how many have rsanged
            all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
        }
        if(Memory.squadObject[squadID].leader == undefined || this.CheckIfLeaderIsDead(squadID) || this.leaderBlocked(squadID))
        {
            Memory.squadObject[squadID].leader = this.decideLeader(squadID);
        }
        var leader = Game.getObjectById(Memory.squadObject[squadID].leader);
        /////////////////////////////////////////////////      
        //                   decide targets 
        target = this.TaskList(squadID);
        Memory.squadObject[squadID].target = target;
        ////////////////////////////////////////////////////        
        // border edge
        var squadNearBorder = false;
        for(var c = 0; c < all.length; c++)
        {
            if(all[c].pos.x < 2 || all[c].pos.x > 47 || all[c].pos.y < 2 || all[c].pos.y > 47)
            {
                squadNearBorder = true;
            }
        }
        if(leader.pos.x < 2 || leader.pos.x > 47 || leader.pos.y < 2 || leader.pos.y > 47)
        {
            Memory.squadObject[squadID].squadCrossingBorder = true;
        }
        else
        {
            Memory.squadObject[squadID].squadCrossingBorder = false;
        }
        /////////////major break fixer//////////
        for(var c = 0; c < all.length; c++)
        {
            var range = leader.pos.getRangeTo(all[c]);
            if(range > 5 && Memory.squadObject[squadID].squadCrossingBorder != true)
            {
                all[c].say("severe break");
                all[c].moveTo(leader);
            }
        }
        ///////////////////////
        // decicde if quad is vital
        var QuadVital = true;
        var targs = leader.room.find(FIND_HOSTILE_CREEPS);
        var targsclose = leader.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var rangeToClosestCreep = leader.pos.getRangeTo(targsclose);
        if(leader.room.name == mainMemoryObject.squadHomeRoom && targs.length < 2) // add another condition for flag distance
        {
            QuadVital = false;
        }
        //////////////
     //   vistials
       console.log("target quad",JSON.stringify(target));
      
   //    Game.rooms[target.roomName].visual.circle(target.x ,target.y,    {fill: 'transparent', radius: 0.55, stroke: 'red'});
        
        
        ///////////////////////
        // move 
        leader.say(this.checkIfInCube(squadID, Memory.squadObject[squadID].leader));
        var SquadIsInFormation = this.checkIfInCube(squadID, Memory.squadObject[squadID].leader) ;
         if(  ( !QuadVital || squadNearBorder == true )   && !SquadIsInFormation)
        {
              leader.say( "moveTo(target)");
              
          
            for(var c = 0; c < all.length; c++)
            {
                if(target != undefined)
                {
                    all[c].moveTo(target);
                }
            }
             
            
        }
        else  if(QuadVital && !SquadIsInFormation  && (squadNearBorder == false && Memory.squadObject[squadID].squadCrossingBorder == false) || (!this.checkIfInCube(squadID, Memory.squadObject[squadID].leader) && Game.time % 7 == 0 && leader.pos.x != 0 && leader.pos.y != 50)) // creeps not in cube
        {
            leader.say( "moveIntoFormation");
            if(Memory.squadObject[squadID].leader != undefined)
            {
                this.moveIntoFormation(Memory.squadObject[squadID].leader, squadID);
            }
        }
      
        else if(SquadIsInFormation)
        {
            if(target != undefined)
            {
                  leader.say( "moveAsOne");
        
                var Direction = this.getDirectionToTarget(squadID, Memory.squadObject[squadID].leader, target);
                this.moveAsOne(squadID, Direction);
            }
        }
        /////////////////////////////////////////////////////
        //                  deal damage
        /////////////////////////////////////////
        
        
                    for(var c = 0; c < all.length; c++)
            {
               creep = all[c];
                 const target = all[c].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        const targetArr = all[c].room.find(FIND_HOSTILE_CREEPS);
        const targets = all[c].pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 0)
        {
            all[c].rangedAttack(targets[0]);
        }
       
        
        
            all[c].heal(all[c]);
       
               
               
            }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        /////
    }
}
module.exports = quadsquad;