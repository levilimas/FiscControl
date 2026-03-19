import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infra/guards/jwt-auth.guard';
import { CurrentUser } from '../../../auth/infra/decorators/current-user.decorator';
import { ImportsService } from '../services/imports.service';

@ApiTags('Imports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('imports')
export class ImportsController {
  constructor(private readonly importsService: ImportsService) {}

  @Post('ofx')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiQuery({ name: 'accountId', required: true, type: String })
  async uploadOfx(
    @CurrentUser() user: { userId: string },
    @Query('accountId') accountId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!accountId) {
      throw new BadRequestException('Account ID is required');
    }

    return this.importsService.importOfx(user.userId, accountId, file.buffer);
  }
}
