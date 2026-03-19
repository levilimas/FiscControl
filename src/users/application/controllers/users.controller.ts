import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../../infra/dtos/update-user.dto';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return current user profile.' })
  async getProfile(@CurrentUser() user: { userId: string }) {
    const fullUser = await this.userService.findById(user.userId);
    return {
      id: fullUser?.id,
      name: fullUser?.name,
      email: fullUser?.email,
      cpf: fullUser?.cpf,
      phone: fullUser?.phone,
      birthDate: fullUser?.birthDate,
      createdAt: fullUser?.createdAt,
    };
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated.' })
  async updateProfile(
    @CurrentUser() user: { userId: string },
    @Body() body: UpdateUserDto,
  ) {
    const currentUser = await this.userService.findById(user.userId);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    if (body.name) currentUser.name = body.name;
    if (body.cpf) currentUser.cpf = body.cpf;
    if (body.phone) currentUser.phone = body.phone;
    if (body.birthDate) currentUser.birthDate = new Date(body.birthDate);

    const updatedUser = await this.userService.updateUser(currentUser);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      cpf: updatedUser.cpf,
      phone: updatedUser.phone,
      birthDate: updatedUser.birthDate,
    };
  }
}
