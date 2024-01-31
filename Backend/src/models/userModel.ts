import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';
import joi from 'joi'


interface IUser extends Document {
    Name: string;
    Email: string;
    Password: string;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    PhoneNumber: string;
    Address?: string;
    ProfilePhoto?: string;
    Customers: Array<{ type: mongoose.Types.ObjectId; ref: 'Customer' }>;
    Orders: Array<{ type: mongoose.Types.ObjectId; ref: 'Order' }>;
    isVerified: boolean;
    GoogleID?: string;
}

const UserValidationSchema = joi.object({
    Name: joi.string().required(),
    Email: joi.string().email().required(),
    Password: joi.string().min(6).required(),
    PhoneNumber: joi.string().required().pattern(/^\d{11}$/)

});


const UserSchema = new Schema<IUser>(
    {
        Name: {
            type: String,
            required: true,
            trim: true
        },

        Email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        Password: {
            type: String,
            required: true
        },

        PhoneNumber: {
            type: String,
            required: true,
            trim: true
        },
        Address: {
            type: String,
            trim: true
        },

        ProfilePhoto: {
            type: String,
            default:
                'https://res.cloudinary.com/dw88d3vwv/image/upload/v1696446296/user-images/user-64fb90a339d50a81f563128d-1696446294369.jpeg.jpg',
            trim: true,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false
        },

        GoogleID: {
            type: String
        },

    },
    { timestamps: true },
);

UserSchema.methods.matchPassword = async function matchPassword(enteredPassword: string,
): Promise<boolean> {
    return bcrypt.compare(enteredPassword, this.Password);
};



UserSchema.pre<IUser>('save', async function hashPassword(next) {
    if (!this.isModified('Password')) {
        next();

    }
    try {
        this.Password = await bcrypt.hash(
            this.Password,
            Number(process.env.SALT_ROUNDS!),
        );
        next();
    } catch (error: any) {
        next(error);
    }
})

UserSchema.pre<IUser>('validate', async function validate(next) {
    try {
        const { Name, Email, Password, PhoneNumber } = this;
        const validatorUser = await UserValidationSchema.validateAsync(
            { Name, Email, Password, PhoneNumber },
            { abortEarly: false },
        );
        this.set(validatorUser);
        next();

    } catch (error: any) {
        next(error);
    }
})

const User = mongoose.model<IUser>('User', UserSchema);

export default User;