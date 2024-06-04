import { Controller, Post, Body } from '@nestjs/common';
import { ConferenceService } from './conference.service';

@Controller("/conference")
export class ConferenceController {
    constructor (
        private readonly conferenceService: ConferenceService
    ){}

    @Post("/create")
    async createConference(@Body() data: {token: string}){
        
    }
}
