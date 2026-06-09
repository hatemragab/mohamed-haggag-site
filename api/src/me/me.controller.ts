import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';
import {
  CurrentUser,
  JwtUser,
} from '../common/decorators/current-user.decorator';
import { MeService } from './me.service';

class ContinueDto {
  @IsMongoId()
  lessonId: string;
}

@ApiTags('me')
@Controller('me')
export class MeController {
  constructor(private readonly me: MeService) {}

  @Get('summary')
  summary(@CurrentUser() user: JwtUser) {
    return this.me.summary(user.sub);
  }

  @Post('progress/:lessonId')
  toggleProgress(
    @CurrentUser() user: JwtUser,
    @Param('lessonId') lessonId: string,
  ) {
    return this.me.toggleProgress(user.sub, lessonId);
  }

  @Post('continue')
  pushContinue(@CurrentUser() user: JwtUser, @Body() dto: ContinueDto) {
    return this.me.pushContinue(user.sub, dto.lessonId);
  }
}
