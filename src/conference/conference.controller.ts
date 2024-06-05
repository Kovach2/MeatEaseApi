import { Controller, Post, Body } from '@nestjs/common';
import { ConferenceService } from './conference.service';

@Controller("/conference")
export class ConferenceController {
    constructor (
        private readonly conferenceService: ConferenceService
    ){}

    @Post("/create")
    async createConference(@Body() data: {token: string}){
        try {
            const conferenceData = await this.conferenceService.createConference({token: data.token})
            if(conferenceData.conference){
                return {code: 200, success: true, roomId: conferenceData.roomId, conference: conferenceData.conference}
            }else{
                return {code: 400, success: false}
            }
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    @Post("/find")
    async findConference(@Body() data: {token: string, conferenceId: string}){
        try {
            const { token, conferenceId } = data
            if(token && conferenceId){
                const conference = await this.conferenceService.findConference({conferenceId: conferenceId})
                console.log(conference)
                if(conference){
                    return {code: 200, success: true}
                }else{
                    return {code: 400, success: false}
                }
            }
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}
