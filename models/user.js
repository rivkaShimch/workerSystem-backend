const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    id: { type: Number },
    role: [{ type: String }]
})


module.exports = mongoose.model("User", userSchema)