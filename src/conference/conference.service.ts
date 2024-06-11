import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Conference, IConferenceUsers } from 'src/schemas/conference.schema';
import { AuthService } from 'src/auth/auth.service';


function generateRoomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

@Injectable()
export class ConferenceService {
    constructor(
        @InjectModel(User.name) private userModal: Model<User>,
        @InjectModel(Conference.name) private conferenceModal: Model<Conference>,
        private readonly authService: AuthService
    ){}

    private getUser = async({token} : {token: string}) =>{
      const user : User = await this.authService.getUserData(token)
      return user
    }

    createConference = async(data: {token: string}) => {
      const { token } = data
      const user = await this.getUser({token})
      await this.userModal.findOneAndUpdate({username: user.username}, {conferences: user.conferences += 1})
      const roomId = generateRoomId()

      const conferenceData : Conference = {
        conferenceId: roomId,
        users: [],
      }

      const newConference : Conference = await this.conferenceModal.create(conferenceData)
      return {roomId: roomId, conference: newConference}
    }

    findConference = async(data: {conferenceId: string}) => {
      const { conferenceId } = data
      const conference : Conference = await this.conferenceModal.findOne({conferenceId: conferenceId})
      return conference
    }

    addUser = async(data: { userId: string, conferenceId: string, token: string }) => {
      const { userId, conferenceId, token } = data
      const user = await this.getUser({token})
      const existConference: Conference = await this.findConference({ conferenceId: conferenceId });
      if (user && existConference) {
        const existingUserIndex = existConference.users.findIndex(existingUser => existingUser.username === user.username);
        if (existingUserIndex === -1) {
          const newUser = { 
            userId: userId,
            username: user.username,
            avatar: user.avatar, 
            isMicroOn: false, 
            isVideoOn: false 
          };
          existConference.users.push(newUser);
          await this.conferenceModal.findOneAndUpdate({conferenceId: existConference.conferenceId}, existConference, { new: true });

          return newUser
        } else {
          return existConference;
        }
      } else {
        return null;
      }
    }

    removeUser = async(data: { conferenceId: string, token: string }) =>{
      try{
        const { conferenceId, token } = data
        const user = await this.getUser({token})
        const conference: Conference = await this.findConference({ conferenceId: conferenceId})

        const users = conference.users.filter(existingUser => existingUser.username !== user.username);
        const newConference = await this.conferenceModal.findOneAndUpdate({conferenceId: conferenceId}, {users: users})
        return newConference
      }catch(e){
        console.log(e)
      }

    }

    updateUserState = async (data: { conferenceId: string, token: string, micOn: boolean, camOn: boolean }) => {
      const { conferenceId, token, micOn, camOn } = data;

      const user = await this.getUser({token});

      const existConference = await this.conferenceModal.findOne({ conferenceId });
      if(existConference){
        const currentUser = existConference.users.find(u => u.username === user.username);
        if (currentUser) {
          currentUser.isMicroOn = micOn;
          currentUser.isVideoOn = camOn;
        }
        const conference = await existConference.save();
        return conference;
      }
    }

    getAllConferences = async() =>{
      const conferences = await this.conferenceModal.find({},{chatMessage: 0})
      return conferences
    }

    delConference = async(props: {conferenceId: string}) =>{
      const { conferenceId } = props
      try{
        await this.conferenceModal.findOneAndDelete({conferenceId: conferenceId})
        return true
      }catch{
        return false
      }

    }
}

