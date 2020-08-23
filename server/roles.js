// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

const types = [
    "pofile",
    "session_notes",
    "goal",
    "session",
    "meeting",
    "session_form"
];
 
exports.roles = (function() {
ac.grant("basic") // user type
 .readOwn("profile")
 .updateOwn("profile")
 
ac.grant("supervisor") // user type
 .extend("basic")
 .readAny("profile")
 
ac.grant("admin") // user type
 .extend("basic")
 .extend("supervisor")
 .updateAny("profile")
 .deleteAny("profile")
 
return ac;
})();