import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdatePlanDto } from './dto/plan.dto';
import { PLAN_KEYS, PlanKey } from './plan.schema';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plans: PlansService) {}

  @Public()
  @Get()
  list() {
    return this.plans.list();
  }

  @Roles('admin')
  @Patch(':key')
  update(
    @Param('key', new ParseEnumPipe(PLAN_KEYS)) key: PlanKey,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.plans.update(key, dto);
  }
}
