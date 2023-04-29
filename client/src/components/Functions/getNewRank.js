export const getNewRank = (prevRank, newRank, playerToIncrementRank) => {
    let incrementedRank = playerToIncrementRank


    if (playerToIncrementRank > prevRank && playerToIncrementRank < 999) {
        incrementedRank = parseInt(playerToIncrementRank) - 1
    }
    if (incrementedRank >= newRank && playerToIncrementRank < 999) {
        incrementedRank = parseInt(incrementedRank) + 1
    }

    return incrementedRank
}