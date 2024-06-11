import { Controller, Post, Body, Get } from '@nestjs/common';
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

    @Get("/allConference")
    async getAllConferences(){
        try {
            const conferences = await this.conferenceService.getAllConferences()
            if(conferences){
                return {code: 200, success: true, conferences}
            }else{
                return {code: 400, success: false, conferences}
            }
        }catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }

    @Post("/delConference")
    async delConference(@Body() data: {conferenceId: string}){
        try {
            const success = await this.conferenceService.delConference(data)
            if(success){
                return {code: 200, success: success, message: "Конференция успешно удалена"}
            }else{
                return {code: 400, success: success, message: "Не удалось удалить конференцию"}
            }
        }catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }
}
