module.exports = function (x, y, z) {
    return {
        x: x || 0,    //Acceleration in the 'x' expressed in m/s^2. (Number)
        y: y || 0,    //Acceleration in the 'y' expressed in m/s^2. (Number)
        z: z || 0     //Acceleration in the 'z' expressed in m/s^2. (Number)
    };
};
