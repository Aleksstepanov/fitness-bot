import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateOrUpdateUserDto } from './dto/create-or-update-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { mapUserToResponse } from './users.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserResponseDto })
  @Post('debug-upsert')
  async upsert(@Body() dto: CreateOrUpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.getOrCreateByTelegramUser(dto);
    return mapUserToResponse(user);
  }
}
