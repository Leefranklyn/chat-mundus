import User from "../../models/user/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import bcrypt, { hash } from "bcrypt";

export const signUpUser = async (req, res) => {
    try {
        const { fullName, email, password, gender } = req.body;

        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: "User already exists"
            });
        };

        const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = bcrypt.hashSync(password, salt);

        const boyProfilePicture = `https://avatar.iran.liara.run/public/boy/?username=${fullName}`;
        const girlProfilePicture = `https://avatar.iran.liara.run/public/girl/?username=${fullName}`;

        const profilePicture = gender === "MALE" ? boyProfilePicture : girlProfilePicture;

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            gender: gender,
            profilePicture: profilePicture
        });

        await newUser.save();
        res.status(200).json({
            success: true,
            message: "User Registered Successfully",
        });
    } catch (error) {
        console.log(error),
            res.status(500).json({
                success: false,
                error: "An Error Occured, Failed to Register User"
            });
    };
};

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User doesn't exist"
            });
        };
    
        if(user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: "24h"
            }); 

            const data = {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePicture: user.profilePicture
            };
    
            return res.status(200).json({
                success: true,
                message: "User Login Successful",
                user: data,
                token: token
            });
        }else {
            return res.status(400).json({
                success: false,
                error: "Invalid Password",
            });
        }

    } catch (error) {
        console.log(error),
        res.status(500).json({
            success: false,
            error: "An Error Occured, Failed to Login User"
        });
    }
}