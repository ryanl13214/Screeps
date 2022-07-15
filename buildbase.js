 /*
0	  5 Containers
1     5 Containers, 1 Spawn
2	  5 Containers, 1 Spawn , 5  Extensions (50 capacity) , Ramparts (50K max hits), Walls
3     5 Containers, 1 Spawn , 10 Extensions (50 capacity) , Ramparts (1M max hits), Walls, 1 Tower
4	  5 Containers, 1 Spawn , -5 Extensions (50 capacity) , Ramparts (3M max hits), Walls, 1 Tower, Storage
5	  5 Containers, 1 Spawn , 5 Extensions (50 capacity) , Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
6	  5 Containers, 1 Spawn , 40 Extensions (50 capacity) , Ramparts (5M max hits), Walls, 2 Towers, Storage, 3 Links, Extractor, 3 Labs, Terminal
7	  5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, Storage, 4 Links, Extractor, 6 Labs, Terminal
8	  5 Containers, 3 Spawns, 60 Extensions (-50 capacity), Ramparts (50M max hits), Walls, 6 Towers, Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
*/
var basebuild = {
     run: function(roomname, storage_xpos, storage_ypos)
     {
        
        
var buildings ={
 
  
            
  "buildings": {
    "storage": {
      "pos": [
        {"x":1,"y":1}
      ]
    },
    "spawn": {
      "pos": [
        {"x":0,"y":-1},
        {"x":-2,"y":-2}
      ]
    },
    "lab": {
      "pos": [
        {"x":-1,"y":-1}
      ]
    },
    "link": {
      "pos": [
        {"x":0,"y":1}
      ]
    },
    "factory": {
      "pos": [
        {"x":1,"y":0}
      ]
    },
    "terminal": {
      "pos": [
        {"x":-1,"y":0}
      ]
    },
    "powerSpawn": {
      "pos": [
        {"x":-1,"y":1}
      ]
    },
    "tower": {
      "pos": [
        {"x":1,"y":-1}
      ]
    },
    "road": {
      "pos": [
        {"x":0,"y":4},
        {"x":0,"y":-3},
        {"x":0,"y":-4},
        {"x":-3,"y":0},
        {"x":0,"y":3},
        {"x":3,"y":0},
        {"x":-4,"y":0},
        {"x":4,"y":0},
        {"x":-2,"y":-1},
        {"x":-2,"y":0},
        {"x":-2,"y":1},
        {"x":-1,"y":2},
        {"x":0,"y":2},
        {"x":1,"y":2},
        {"x":2,"y":1},
        {"x":2,"y":-1},
        {"x":-1,"y":-2},
        {"x":0,"y":-2},
        {"x":1,"y":-2}
      ]
    },
    "extension": {
      "pos": [
        {"x":2,"y":3},
        {"x":2,"y":-3},
        {"x":-3,"y":-2},
        {"x":3,"y":-2},
        {"x":-3,"y":2},
        {"x":-2,"y":3},
        {"x":3,"y":2},
        {"x":-1,"y":-3},
        {"x":1,"y":-3},
        {"x":3,"y":-1},
        {"x":3,"y":1},
        {"x":1,"y":3},
        {"x":-1,"y":3},
        {"x":-3,"y":-1},
        {"x":-3,"y":1},
        {"x":-2,"y":-3},
        {"x":2,"y":2},
        {"x":2,"y":-2},
        {"x":2,"y":0}
      ]
    },
    "observer": {
      "pos": [
        {"x":-3,"y":-3}
      ]
    },
    "rampart": {
      "pos": [
        {"x":-3,"y":-2},
        {"x":-3,"y":2},
        {"x":-2,"y":3},
        {"x":2,"y":3},
        {"x":3,"y":2},
        {"x":3,"y":-2},
        {"x":2,"y":-3},
        {"x":-1,"y":-1},
        {"x":-1,"y":0},
        {"x":-1,"y":1},
        {"x":1,"y":1},
        {"x":1,"y":-1},
        {"x":1,"y":0},
        {"x":0,"y":1},
        {"x":0,"y":-1},
        {"x":-2,"y":2},
        {"x":-1,"y":-3},
        {"x":0,"y":-3},
        {"x":1,"y":-3},
        {"x":-3,"y":0},
        {"x":-3,"y":-1},
        {"x":-3,"y":1},
        {"x":-1,"y":3},
        {"x":1,"y":3},
        {"x":0,"y":3},
        {"x":3,"y":0},
        {"x":3,"y":-1},
        {"x":3,"y":1},
        {"x":-2,"y":-3},
        {"x":-2,"y":-2},
        {"x":2,"y":-2},
        {"x":2,"y":2},
        {"x":-1,"y":-2},
        {"x":0,"y":-2},
        {"x":2,"y":0},
        {"x":1,"y":-2},
        {"x":2,"y":-1},
        {"x":2,"y":1},
        {"x":1,"y":2},
        {"x":0,"y":2},
        {"x":0,"y":0},
        {"x":-1,"y":2},
        {"x":-2,"y":1},
        {"x":-2,"y":0},
        {"x":-2,"y":-1}
      ]
    },
    "nuker": {
      "pos": [
        {"x":-2,"y":2}
      ]
    }
  }
    
}
var goalroom = Game.rooms[roomname]
  var terrain = goalroom.getTerrain();
      
      var extLocationsbunker =   Object.values(buildings.buildings.extension["pos"]);
         
     goalroom.createConstructionSite(storage_xpos + 1, storage_ypos + 1, STRUCTURE_STORAGE);
 //   console.log(roomname, "-roomname",goalroom.createConstructionSite(storage_xpos + 1, storage_ypos + 1, STRUCTURE_STORAGE))
         for(var i = 0; i < extLocationsbunker.length; i++)
         {
            
                 if(terrain.get(storage_xpos + extLocationsbunker[i].x, storage_ypos + extLocationsbunker[i].y) != 1)
                 {
                     goalroom.createConstructionSite(storage_xpos + extLocationsbunker[i].x, storage_ypos + extLocationsbunker[i].y, STRUCTURE_EXTENSION);
                 }
             
           
         }
         
         
         
         
               var roadLocationsbunker =   Object.values(buildings.buildings.road["pos"]);
         
         if(goalroom.controller.level > 3){
             for(var i = 0; i < roadLocationsbunker.length; i++)
             {
                
                     if(terrain.get(storage_xpos + roadLocationsbunker[i].x, storage_ypos + roadLocationsbunker[i].y) != 1)
                     {
                       //  goalroom.createConstructionSite(storage_xpos + roadLocationsbunker[i].x, storage_ypos + roadLocationsbunker[i].y, STRUCTURE_ROAD);
                     }
                 
               
             }
         
         }
         
       
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         if(goalroom.storage == undefined)
         {
             goalroom.createConstructionSite(storage_xpos, storage_ypos, STRUCTURE_STORAGE);
         }
   
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
         
               
         ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     }
 }
 module.exports = basebuild;