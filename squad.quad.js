var serpentsquad = {
    getpositions: function(c, head)
    {
        if(c == 1)
        {
            var a = 0;
        }
        if(c == 0)
        {
            var a = 1;
        }
        var buddyX = head[a].pos.x;
        var buddyY = head[a].pos.y;
        var freepositions = []
        var prefered = false;
        // check for almost full squad
        if(this.positionPrefered(buddyX + 1, buddyY, head[a].room.name))
        {
            freepositions.push(new RoomPosition(buddyX + 1, buddyY, head[a].room.name));
            prefered = true;
        }
        if(this.positionPrefered(buddyX - 1, buddyY, head[a].room.name))
        {
            freepositions.push(new RoomPosition(buddyX - 1, buddyY, head[a].room.name));
            prefered = true;
        }
        if(this.positionPrefered(buddyX, buddyY + 1, head[a].room.name))
        {
            freepositions.push(new RoomPosition(buddyX, buddyY + 1, head[a].room.name));
            prefered = true;
        }
        if(this.positionPrefered(buddyX, buddyY - 1, head[a].room.name))
        {
            freepositions.push(new RoomPosition(buddyX, buddyY - 1, head[a].room.name));
            prefered = true;
        }
        head[c].say(prefered);
        if(prefered)
        {
            head[c].memory.movingcheck = true;
        }
        else
        {
            head[c].memory.movingcheck = false;
        }
        // else just fill in
        if(!prefered)
        {
            if(this.positionFree(buddyX + 1, buddyY, head[a].room.name))
            {
                freepositions.push(new RoomPosition(buddyX + 1, buddyY, head[a].room.name));
            }
            if(this.positionFree(buddyX - 1, buddyY, head[a].room.name))
            {
                freepositions.push(new RoomPosition(buddyX - 1, buddyY, head[a].room.name));
            }
            if(this.positionFree(buddyX, buddyY + 1, head[a].room.name))
            {
                freepositions.push(new RoomPosition(buddyX, buddyY + 1, head[a].room.name));
            }
            if(this.positionFree(buddyX, buddyY - 1, head[a].room.name))
            {
                freepositions.push(new RoomPosition(buddyX - 1, buddyY - 1, head[a].room.name));
            }
        }
        return freepositions;
    },
    positionFree: function(xx, yy, roomm)
    {
        var blocked = false;
        var position = new RoomPosition(xx, yy, roomm);
        var found = Game.rooms[roomm].lookForAt(LOOK_STRUCTURES, position);
        if(found.length != 0)
        {
            blocked = true;
        }
        var found = Game.rooms[roomm].lookForAt(LOOK_CREEPS, position);
        if(found.length != 0)
        {
            blocked = true;
        }
        if(blocked == false)
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    positionPrefered: function(xx, yy, roomm)
    {
        var position = new RoomPosition(xx, yy, roomm);
        var closeteams = position.findInRange(FIND_MY_CREEPS, 1);
        if(closeteams.length > 2 && this.positionFree(xx, yy, roomm))
        {
            Game.rooms[roomm].visual.circle(position,
            {
                fill: 'solid',
                radius: 1,
                stroke: 'green'
            });
            return true;
        }
        else
        {
            return false;
        }
    },
    run: function(squadID)
    {
        //    console.log("serpent control");
        var mainMemoryObject = Memory.squadObject[squadID];
        var head = [];
        var tail = [];
        var all = [];
        var inHome = false;
        for(var c = 0; c < mainMemoryObject.SquadMembersCurrent.length; c++)
        {
            var creepername = Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).name.substring(0, 4);
            if(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]).room.name == mainMemoryObject.squadHomeRoom)
            {
                inHome = true;
            }
            if(creepername == "head")
            {
                head.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
            else if(creepername == "tail")
            {
                tail.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
                all.push(Game.getObjectById(mainMemoryObject.SquadMembersCurrent[c]));
            }
        }
        var squadFullyInroom = false;
     
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////MOVEMENT to goal room///////////////////////////////////////////////////////////////    
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
        if(mainMemoryObject.arrayOfSquadGoals.length != 0)
        {
            
               var goalposition = new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]);
            
            for(var c = 0; c < all.length; c++)
            {   
                 var closeteams = all[c].pos.findInRange(FIND_MY_CREEPS, 3);
                if(closeteams.length == 4 && all[c].room.name == mainMemoryObject.arrayOfSquadGoals[0])
                {
                    squadFullyInroom = true;
                
                }
               
                var closeteams = all[c].pos.findInRange(FIND_MY_CREEPS, 1);
                if(closeteams.length != 0 || all[c].pos.x < 2 || all[c].pos.x > 48 || all[c].pos.y < 2 || all[c].pos.y > 48 && all[c].room.name != mainMemoryObject.arrayOfSquadGoals[0])
                {
                    all[c].moveTo(new RoomPosition(25, 25, mainMemoryObject.arrayOfSquadGoals[0]));
                }
            }
        
            if(squadFullyInroom)
            {
                mainMemoryObject.arrayOfSquadGoals.splice(0, 1);
            }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////build square////////////////////////////////////////////////////////////////////////    
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        if(head.length !=0){
        var allclose =head[0].pos.findInRange(FIND_MY_CREEPS, 1);
        if(allclose<4){
        
            for(var  c = 0; c < head.length; c++)
            {
                var closeteams = head[c].pos.findInRange(FIND_MY_CREEPS, 1);
                if(closeteams.length < 4)
                {
                    // check if the creep needs to move to its other head
                    if(c == 0)
                    {
                        var a = 1;
                    }
                    if(c == 1)
                    {
                        var a = 0;
                    }
                    var range = head[c].pos.getRangeTo(head[a]);
                    var BothMoveChecker = false;
                    if(c == 1 && range < 4)
                    {
                        if(head[0].memory.movingcheck != true)
                        {
                            BothMoveChecker = true;
                        }
                    }
                    if(range > 1 && BothMoveChecker)
                    {
                        head[c].moveTo(head[c].pos.findClosestByRange(this.getpositions(c, head)));
                        head[c].room.visual.line(head[c].pos, head[c].pos.findClosestByRange(this.getpositions(c, head)),
                        {
                            color: 'blue',
                            lineStyle: 'dashed'
                        });
                    }
                }
            }
            
            for(var c = 0; c < tail.length; c++)
            {
                  tail[c].say("closeteams");
                tail[c].memory.movingcheck = false;
                var closeteams = tail[c].pos.findInRange(FIND_MY_CREEPS, 1);
                  tail[c].say(closeteams);
                if(closeteams.length < 4)
                {
                    // check if the creep needs to move to its other head
                    if(c == 0)
                    {
                        var a = 1;
                    }
                    if(c == 1)
                    {
                        var a = 0;
                    }
                    var range = tail[c].pos.getRangeTo(tail[a]);
                    var BothMoveChecker = false;
                    if(c == 1 && range < 4)
                    {
                        if(tail[0].memory.movingcheck != true)
                        {
                            BothMoveChecker = true;
                        }
                    }
                    tail[c].say(range);
                    if(range > 1 && BothMoveChecker)
                    {
                        tail[c].moveTo(tail[c].pos.findClosestByRange(this.getpositions(c, tail)));
                        tail[c].room.visual.line(tail[c].pos, tail[c].pos.findClosestByRange(this.getpositions(c, tail)),
                        {
                            color: 'red',
                            lineStyle: 'dashed'
                        });
                    }
                }
            }
        }
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
        
        
        
        
        
        
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
    }
}
module.exports = serpentsquad;