 /*
0	  5 Containers
1     5 Containers, 1 Spawn
2	  5 Containers, 1 Spawn , 5  Extensions (50 capacity) , Ramparts (300K max hits), Walls
3     5 Containers, 1 Spawn , 10 Extensions (50 capacity) , Ramparts (1M max hits), Walls, 1 Tower
4	  5 Containers, 1 Spawn , 20 Extensions (50 capacity) , Ramparts (3M max hits), Walls, 1 Tower, Storage
5	  5 Containers, 1 Spawn , 30 Extensions (50 capacity) , Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
6	  5 Containers, 1 Spawn , 40 Extensions (50 capacity) , Ramparts (30M max hits), Walls, 2 Towers, Storage, 3 Links, Extractor, 3 Labs, Terminal
7	  5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, Storage, 4 Links, Extractor, 6 Labs, Terminal
8	  5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
*/
 //total structures = 3 60 6 2 10 1 1 1 1 =85
 // all positions are from storage
 var core = [
     [0, -5],
     [-1, -4],
     [0, -4],
     [1, -4],
     [-1, -3],
     [-2, -3],
     [0, -3],
     [1, -3],
     [2, -3],
     [3, -2],
     [2, -2],
     [1, -2],
     [0, -2],
     [-1, -2],
     [-2, -2],
     [-3, -2],
     [-4, -1],
     [-3, -1],
     [-2, -1],
     [-1, -1],
     [0, -1],
     [1, -1],
     [2, -1],
     [3, -1],
     [4, -1],
     [-5, 0],
     [-4, 0],
     [-3, 0],
     [-2, 0],
     [-1, 0],
     [0, 0],
     [1, 0],
     [2, 0],
     [3, 0],
     [4, 0],
     [5, 0],
     [-4, 1],
     [-3, 1],
     [-2, 1],
     [-1, 1],
     [0, 1],
     [1, 1],
     [2, 1],
     [3, 1],
     [4, 1],
     [-3, 2],
     [-2, 2],
     [-1, 2],
     [0, 2],
     [1, 2],
     [2, 2],
     [3, 2],
     [-2, 3],
     [-1, 3],
     [0, 3],
     [1, 3],
     [2, 3],
     [-1, 4],
     [0, 4],
     [1, 4],
     [0, 5]
 ];
 var arrayofextensionpositions = [
     [1, 3],
     [3, 1],
     [3, 0],
     [4, 0],
     [2, -1],
     [3, -1],
     [0, 3],
     [0, 4],
     [-1, 3],
     [-1, 2],
     [-2, 1],
     [1, -2],
     [1, -3],
     [0, -3],
     [0, -4],
     [5, 1],
     [5, 2],
     [5, 3],
     [5, 4],
     [4, 2],
     [4, 3],
     [2, 4],
     [3, 4],
     [1, 5],
     [2, 5],
     [3, 5],
     [4, 5],
     [-5, 4],
     [-5, 5],
     [-4, 5],
     [-3, 4],
     [-2, 4],
     [-3, 5],
     [-2, 5],
     [-1, 5],
     [-5, -1],
     [-5, -2],
     [-5, -3],
     [-5, -4],
     [-4, -2],
     [-4, -3],
     [-4, -5],
     [-3, -5],
     [-2, -5],
     [-1, -5],
     [-3, -4],
     [-2, -4],
     [1, -5],
     [2, -5],
     [3, -5],
     [0, -6],
     [2, -4],
     [3, -4],
     [4, -5],
     [4, -3],
     [4, -2],
     [4, -4],
     [5, -3],
     [5, -2],
     [5, -1]
 ];
 var arrayoftowers = [
     [1, 0],
     [2, 0],
     [2, 1],
     [2, 2],
     [0, 2],
     [0, 1]
 ];
 var containers = [];
 var observer = [6, 0];
 var powerspawn = [-2, 0];
 var nuker = [-3, 0];
 var arrayoflabs = [
     [-2, -2],
     [-3, -1],
     [-4, 0],
     [-3, 1],
     [-5, 1],
     [-5, 2],
     [-4, 2],
     [-5, 3],
     [-4, 3]
 ];
 var roads = [
     [-1, 1],
   //  [-2, 2],
     [-3, 2],
     [-2, 3],
     [-3, 3],
     [-4, 4],
     [-1, 4],
     [0, 5],
     [1, 4],
     [2, 3],
     [3, 3],
     [4, 4],
     [5, 5],
     [3, 2],
     [4, 1],
     [5, 0],
     [1, -1],
   //  [2, -2],
     [3, -2],
     [3, -3],
     [2, -3],
     [4, -4],
     [5, -5],
     [1, -4],
     [0, -5],
     [-1, -4],
     [-2, -3],
     [-3, -3],
     [-3, -2],
     [-4, -4],
     [-5, -5],
     [-4, -1],
     [-5, 0],
     [-4, 1],
     [4, -1]
 ];
 var basebuild = {
     run: function(roomname, storage_xpos, storage_ypos)
     {
         var goalroom = Game.rooms[roomname];
         var terrain = goalroom.getTerrain();
         for(var i = 0; i < roads.length; i++)
         {
             try
             {
                 if(terrain.get(storage_xpos + roads[i][0], storage_ypos + roads[i][1]) != 1)
                 {
                     goalroom.createConstructionSite(storage_xpos + roads[i][0], storage_ypos + roads[i][1], STRUCTURE_ROAD);
                 }
             }
             catch (e)
             {}
         }
         for(var i = 0; i < arrayofextensionpositions.length; i++)
         {
             try
             {
                 goalroom.createConstructionSite(storage_xpos + arrayofextensionpositions[i][0], storage_ypos + arrayofextensionpositions[i][1], STRUCTURE_EXTENSION);
             }
             catch (e)
             {}
         }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         for(var i = 0; i < arrayoftowers.length; i++)
         {
             try
             {
                 goalroom.createConstructionSite(storage_xpos + arrayoftowers[i][0], storage_ypos + arrayoftowers[i][1], STRUCTURE_TOWER);
                 if(goalroom.controller.level > 4)
                 {
                     goalroom.createConstructionSite(storage_xpos + arrayoftowers[i][0], storage_ypos + arrayoftowers[i][1], STRUCTURE_RAMPART);
                 }
             }
             catch (e)
             {}
         }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(goalroom.storage == undefined)
         {
             goalroom.createConstructionSite(storage_xpos, storage_ypos, STRUCTURE_STORAGE);
         }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(goalroom.controller.level >= 3 && goalroom.controller.level < 6)
         {
             var flag1 = Game.flags[roomname + "container1"];
             var flag0 = Game.flags[roomname + "container0"];
             var flag2 = Game.flags[roomname + "controllercontainer"];
             goalroom.createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_CONTAINER);
             goalroom.createConstructionSite(flag0.pos.x, flag0.pos.y, STRUCTURE_CONTAINER);
             goalroom.createConstructionSite(flag2.pos.x, flag2.pos.y, STRUCTURE_CONTAINER);
         }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(goalroom.controller.level > 4)
         {
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             goalroom.createConstructionSite(storage_xpos - 1, storage_ypos, STRUCTURE_LINK);
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             for(var i = 0; i < arrayoflabs.length; i++)
             {
                 Game.rooms[roomname].createConstructionSite(storage_xpos + arrayoflabs[i][0], storage_ypos + arrayoflabs[i][1], STRUCTURE_LAB);
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             if(goalroom.terminal == undefined)
             {
                 Game.rooms[roomname].createConstructionSite(storage_xpos - 2, storage_ypos - 1, STRUCTURE_TERMINAL);
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             var temp = Game.rooms[roomname].find(FIND_MINERALS)[0].pos;
             Game.rooms[roomname].createConstructionSite(temp.x, temp.y, STRUCTURE_EXTRACTOR);
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             var flgmain1 = Game.flags[roomname];
             if(Game.rooms[roomname].controller.level > 6 && flgmain1.memory.flagstruct.claimedroomstuct.roomIsStronghold == true)
             {
                 for(var i = 0; i < core.length; i++)
                 {
                     try
                     {
                         //                     Game.rooms[roomname].createConstructionSite(storage_xpos + core[i][0], storage_ypos + core[i][1], STRUCTURE_RAMPART);////////core
                     }
                     catch (e)
                     {}
                 }
             }
             ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
             var flag1 = Game.flags[roomname + "container1"];
             var flag0 = Game.flags[roomname + "container0"];
             const found = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, flag1.pos,
             {
                 filter: (structure) =>
                 {
                     return (structure.structureType == STRUCTURE_CONTAINER);
                 }
             });
             const found1 = Game.rooms[roomname].lookForAt(LOOK_STRUCTURES, flag0.pos,
             {
                 filter: (structure) =>
                 {
                     return (structure.structureType == STRUCTURE_CONTAINER);
                 }
             });
             if(Game.rooms[roomname].controller.level > 6)
             {
                 if(found1.length != 0)
                 {
                     if(found1[0].structureType == STRUCTURE_CONTAINER)
                     {
                         found1[0].destroy();
                     }
                 }
                 if(found.length != 0)
                 {
                     if(found[0].structureType == STRUCTURE_CONTAINER)
                     {
                         found[0].destroy();
                     }
                 }
             }
             Game.rooms[roomname].createConstructionSite(flag1.pos.x, flag1.pos.y, STRUCTURE_LINK);
             Game.rooms[roomname].createConstructionSite(flag0.pos.x, flag0.pos.y, STRUCTURE_LINK);
             /////////////////////////////////////////////////////////////////////////////////////////////////////////                   
             //                                  walls
             /////////////////////////////////////////////////////////////////////////////////////////////////////////          
            if(1==2)
            {
             for(var i = 0; i < 18; i++)
             {
                 if(i % 3 == 0)
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos - i) + 9, (storage_ypos) - 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos - 9, STRUCTURE_RAMPART);
                     }
                 }
                 else
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos - i) + 9, (storage_ypos) - 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos - 9, STRUCTURE_WALL);
                     }
                 }
             }
             for(var i = 0; i < 18; i++)
             {
                 if(i % 3 == 0)
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos - i) + 9, (storage_ypos) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos + 9, STRUCTURE_RAMPART);
                     }
                 }
                 else
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos - i) + 9, (storage_ypos) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos - i) + 9, storage_ypos + 9, STRUCTURE_WALL);
                     }
                 }
             }
             for(var i = 0; i < 18; i++)
             {
                 if(i % 3 == 0)
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos) + 9, (storage_ypos - i) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos) + 9, (storage_ypos - i) + 9, STRUCTURE_RAMPART);
                     }
                 }
                 else
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos) + 9, (storage_ypos - i) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 10)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos) + 9, (storage_ypos - i) + 9, STRUCTURE_WALL);
                     }
                 }
             }
             for(var i = 0; i < 19; i++)
             {
                 if(i % 3 == 0)
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos) - 9, (storage_ypos - i) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 9)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos) - 9, (storage_ypos - i) + 9, STRUCTURE_RAMPART);
                     }
                 }
                 else
                 {
                     var pathDistance = Game.rooms[roomname].room.findPath(new RoomPosition((storage_xpos) - 9, (storage_ypos - i) + 9, roomname), new RoomPosition(storage_xpos, storage_ypos, roomname)).length;
                     if(pathDistance < 9)
                     {
                         Game.rooms[roomname].createConstructionSite((storage_xpos) - 9, (storage_ypos - i) + 9, STRUCTURE_WALL);
                     }
                 }
             }
            }
             /////////////////////////////////////////////////////////////////////////////////////////////////////////              
         }
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     }
 }
 module.exports = basebuild;