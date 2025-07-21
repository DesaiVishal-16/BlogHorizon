import mongoose, { Document, Schema } from "mongoose";

export interface UserType extends Document{
   username: string;
   email: string;
   password?: string;
   img?: string;
   createdAt: Date;
   updatedAt: Date;
   googleId?: string;
};

const userSchema = new Schema<UserType>(
    {
        username: { type: String, required: true, unique: true},
        email: { type: String, required: true, unique:true},
        password: { type: String, required: function(this:UserType){
          return !this.googleId;
        }},
        img: {type: String, required: false},
        googleId: {type: String}
   },{
    timestamps: true
   }
);

const User = mongoose.model<UserType>("User",userSchema);
export default User;