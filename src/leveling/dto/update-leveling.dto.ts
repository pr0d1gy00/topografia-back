import { PartialType } from '@nestjs/mapped-types';
import { CreateLevelingReadingDto } from './create-leveling.dto';

export class UpdateLevelingReadingDto extends PartialType(CreateLevelingReadingDto) {}