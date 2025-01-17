import mongoose, { mongo } from "mongoose"

const photoSchema  = new mongoose.Schema(
    {
        id: {type: String, require: true},
        lat: {type: Number},
        lng: {type: Number},
        title: String,
        description: String,
        uploadDate: {type: Date, require: true, default: Date.now},
        filename: String,
        author: String,
        hiden: {type: Boolean, default: false} ,
        deleted: {type: Boolean, default: false},

        shotTimeMode: String,
        shotDateMode: String,
        shotTimeBegin: String,
        shotTimeEnd: String,
        shotDateBegin: String,
        shotDateEnd: String,

    }
)

const userSchema = new mongoose.Schema(

    {
        id: {type: String, require: true},
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
        firstname: String,
        surname: String,
        email: {type: String, require: true},
        pwd: {type: String, require: true},
        originTown: String,


    }

)

export const dbPhoto = mongoose.model('Photo', photoSchema)
export const dbUser = mongoose.model('User', userSchema)
