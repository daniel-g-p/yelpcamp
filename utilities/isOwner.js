const isOwner = (userID, ownerID) => {
    if (userID === ownerID) {
        return true;
    } else {
        return false;
    };
};

module.exports = isOwner;