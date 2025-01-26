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
        uploadedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // unique, required
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

const MapSchema = new mongoose.Schema(
    {
        id: {type: String, require: true},
        members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
        admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}] ,
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        zoom: Number,
        center: String,
        photos: [{type: mongoose.Schema.Types.ObjectId, ref: 'Photo'}],
        guests: Boolean
    }
)


const guestSchena = new mongoose.Schema(
    {
        id: {type: String, require: true},
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
        defaultMapId: {type: mongoose.Schema.Types.ObjectId, ref: 'Map'}
    }
)


const userSchema = new mongoose.Schema(
    {
        id: {type: String, require: true},
        photos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
        firstname: String,
        surname: String,
        email: {type: String, require: true, unique: true },
        pwd: {type: String, require: true},
        originTown: String,
        activated: Boolean,
        activation_token: String,
        maps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Map' }],
        defaultMapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Map' }
    }
)

export const dbPhoto = mongoose.model('Photo', photoSchema)
export const dbUser = mongoose.model('User', userSchema)
export const dbMap = mongoose.model('Map', MapSchema)
export const dbGuest = mongoose.model('Guest', guestSchena)