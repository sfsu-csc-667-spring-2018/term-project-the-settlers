module.exports = db => {
    const buildingFunctions = {};

    const validateSettlementPlacement = (x,y,gameId) =>{
      return Promise.all([db.games.getVertexOwner(x,y,gameId)
                        ,db.games.getItemCount(gameId)
                        ,db.games.getPlayerLimit(gameId)])
    };

    const validateRoadPlacement = (xStart,yStart,xEnd,yEnd) => {

    };

    const subtractResource = (userId,gameId,type,amount) =>{
      return db.players.getResourceCount(userId,gameId,type)
        .then(({count}) => {
          console.log(count,amount,type,count<amount);
          if(count >= amount){
            return db.players.updateResources(userId,gameId,type,-amount);
          }else{
            throw "Not enough resources";
          }
        })
    };

    buildingFunctions.buildStructure = (userId,gameId,x,y,buildingType) => {
      //TODO finish validation;
      if(buildingType.toUpperCase() === "SETTLEMENT"){
        return db.players.buildBuilding(userId,gameId,x,y,buildingType)
        .then( () => Promise.all([subtractResource(userId,gameId,'BRICK',1)
                                  ,subtractResource(userId,gameId,'LUMBER',1)
                                  ,subtractResource(userId,gameId,'WOOL',1)
                                  ,subtractResource(userId,gameId,'WHEAT',1)]))
      }else{
        return db.players.buildBuilding(userId,gameId,x,y,buildingType)
        .then( () => Promise.all([subtractResource(userId,gameId,'ORE',3)
                                  ,subtractResource(userId,gameId,'WHEAT',2)]))
      }
    };

    buildingFunctions.buildRoad = (userId,gameId,xStart,yStart,xEnd,yEnd) => {
      //TODO finish validation
      return db.players.buildRoad(userId,gameId,xStart,yStart,xEnd,yEnd)
        .then( () => Promise.all([subtractResource(userId,gameId,'BRICK',1)
                                  ,subtractResource(userId,gameId,'LUMBER',1)]))
    };

    return buildingFunctions;
}
