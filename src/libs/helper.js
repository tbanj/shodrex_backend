module.exports = {
    lowerCaseObject: function lowerCaseObject(param) {
        console.warn('property', param);
        let userUpdate = {};
        let updates = Object.keys(param);
        updates.map(property => {

            userUpdate[property] = param[property].toLowerCase().trim();
        });
        return userUpdate;
    }
}