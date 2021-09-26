var labs = {
    run: function(roomname)
    {
var allLabs= Game.rooms[roomname].find(FIND_MY_STRUCTURES, 
    {filter: {structureType: STRUCTURE_LAB}});
var CurrentMODE = "g";

 
 var mainFlag = Game.flags[roomname];


if(mainFlag != undefined){
    if(mainFlag.memory.boostNeeded == undefined || mainFlag.memory.CurrentMODE == undefined){
        mainFlag.memory.boostNeeded="";
        mainFlag.memory.CurrentMODE="g"
    }
    if(  mainFlag.memory.boostNeeded != "" && mainFlag.memory.CurrentMODE != "CleanLabs"){
        CurrentMODE = "endBoosts";
    }
    
}



var desiredBoosts ="";

if(CurrentMODE == "CleanLabs"){




}









if(CurrentMODE == "g"){
    
    // check that the labs are available
    var labsfree = true;
    
    if(allLabs.length != 10){
        labsfree = false;
    }
    
  //  var endlabs = 
    
     
 

    
    // 5 boost labs if needed
    
    
    
    // three labs draw from two int labs    
    
   // labs[0].runReaction(labs[1], labs[2]);
   // labs[0].runReaction(labs[1], labs[2]);
/// labs[0].runReaction(labs[1], labs[2]);
    
    
    
    // two int labs draw from main labs 
    
//    labs[0].runReaction(labs[1], labs[2]);
   // labs[0].runReaction(labs[1], labs[2]);
    
   // all labs check to stock up. 
}








if(CurrentMODE == "endBoosts"){
    






}













    }
}
module.exports = labs;