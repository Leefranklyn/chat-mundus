import { Schema, model } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["MALE", "FEMALE"]
    },
    profilePicture: {
        type: String,
        deafult: ""
    },
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    sentFriendRequests: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "denied"],
                default: "pending"
            }

        }
    ],
    receivedFriendRequests: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            status: {
                type: String,
                enum: ["pending", "accepted", "denied"],
                default: "pending"
            }

        }
    ]
}, {
    timestamps: true
});

export default model("User", userSchema);