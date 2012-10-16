module.exports = function (alpha, beta, gamma) {
    return {
        alpha: alpha || 0,    //Rotation about the 'z' axis expressed in degrees [0, 360].    (Number)
        beta: beta || 0,      //Rotation about the 'x' axis expressed in degrees [-180, 180]. (Number)
        gamma: gamma || 0     //Rotation about the 'y' axis expressed in degrees [-90, 90].   (Number)
    };
};
