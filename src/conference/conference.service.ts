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

    createConference = async(data: {token: string}) => {
      const user : User = await this.authService.getUserData(data.token)
      await this.userModal.findOneAndUpdate({username: user.username}, {conferences: user.conferences += 1})
      const roomId = generateRoomId()

      const conferenceData : Conference = {
        conferenceId: roomId,
        users: [
          {
            username: user.username,
            avatar: user.avatar,
            isMicroOn: false,
            isVideoOn: false
          }
        ],
        chatMessage: []
      }

      const newConference : Conference = await this.conferenceModal.create(conferenceData)
      return {roomId: roomId, conference: newConference}
    }

    findConference = async(data: {conferenceId: string}) => {
      const { conferenceId } = data
      const conference : Conference = await this.conferenceModal.findOne({conferenceId: conferenceId})
      console.log(conference)
      return conference
    }

    addUser = async(data: { conferenceId: string, token: string }) => {
      const user: User = await this.authService.getUserData(data.token);
      const conference: Conference = await this.findConference({ conferenceId: data.conferenceId });
      if (user && conference) {
        const existingUserIndex = conference.users.findIndex(existingUser => existingUser.username === user.username);
        if (existingUserIndex === -1) {
          const newUser = { username: user.username, avatar: user.avatar, isMicroOn: false, isVideoOn: false };
          conference.users.push(newUser);
          const newConference : Conference = await this.conferenceModal.findOneAndUpdate({conferenceId: conference.conferenceId}, conference, { new: true });

          return newConference
        } else {
          return conference;
        }
      } else {
        return null;
      }
    }

    removeUser = async(data: { conferenceId: string, token: string }) =>{
      const user: User = await this.authService.getUserData(data.token)
      const conference: Conference = await this.findConference({ conferenceId: data.conferenceId })
      const users = conference.users.filter(existingUser => existingUser.username !== user.username);
      const newConference = await this.conferenceModal.findOneAndUpdate({conferenceId: data.conferenceId}, {users: users})
      return newConference
    }
}

