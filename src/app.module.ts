import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    RegisterModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
