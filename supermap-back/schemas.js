import mongoose, { mongo, Mongoose, Types } from "mongoose"
import { type } from "os"

const rideSchema = new mongoose.Schema(
    {
        id: String,
        startPoint:{ type: Array },
        middlePoints:[],
        endPoint: [],
        state: String,
        creationDate: {type: Date},
        startDate:  {type: Date},
        endDate:  {type: Date},
        creator:  {type: String},
        vehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}
    }
)

const carModelSchema = new mongoose.Schema(
    {
        manufacturer: {type: String},
        modelName: {type: String},
        year: {type: Number },
        bodytype: {type: String}
    }
)

const userSchema = new mongoose.Schema(
    {
        id: {type: String, require: true},
       firstname: String,
       surname: String,
       originTown: String,
       activated: Boolean,
       email: String,
       phoneNums: [String],
       activation_token: String,
       login: {type: String, require: true, unique: true },
       pwd: {type: String, require: true},
       RTCOffers: [{type: String}]
    }
)


const supervisorSchema = new mongoose.Schema(
    {
        ... userSchema.obj
    }
)

const driverSchema = new mongoose.Schema(
    {
        ... userSchema.obj,
        lat: {type: Number},
        lng: {type: Number},
        defaultVehicle: {type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'},
        vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}],
        rideHistory: {type: mongoose.Schema.Types.ObjectId, ref: 'Ride'}
    }
)


const managerSchema = new mongoose.Schema(
    {
        ...userSchema.obj,
        vehicles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}],
        drivers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Driver'}]
    }
)

const vehicleSchema  = new mongoose.Schema(
    {
        ...userSchema.obj,
        lat: {type: Number},
        lng: {type: Number},
        color: {type: String},
        countryOfReg: {type: String},
        regNum: {type: String},
        currentActiveDriver: {type: mongoose.Schema.Types.ObjectId, ref: 'Driver'},
        drivers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Driver'}],
        managers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Manager'}],
        owners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
            { type: mongoose.Schema.Types.ObjectId, ref: 'Manager' },
            { type: mongoose.Schema.Types.ObjectId, ref: 'Supervisor' }
        ],
        carModel: {type: mongoose.Schema.Types.ObjectId, ref: 'CarModel'},   
        currentRide: {type: mongoose.Schema.Types.ObjectId, ref: 'Ride'},
        rideHistory: [{type: mongoose.Schema.Types.ObjectId, ref: 'Ride'}]
    }
)

// export const dbPhoto = mongoose.model('Photo', photoSchema)
// export const dbUser = mongoose.model('User', userSchema)
export const vehicle = mongoose.model('Vehicle', vehicleSchema)
export const manager = mongoose.model('Manager', managerSchema)
export const ride = mongoose.model('Ride', rideSchema) 
export const driver = mongoose.model('Driver', driverSchema )
export const supervisoк = mongoose.model('Supervisor', supervisorSchema)
export const carModel = mongoose.model('carModel', carModelSchema)
// export const dbGuest = mongoose.model('Guest', guestSchena)