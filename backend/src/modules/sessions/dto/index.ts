import { IsNumber, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateSessionDto {
  @IsNumber()
  @Min(1)
  duration_min: number;

  @IsNumber()
  @Min(0)
  @Max(10)
  sRPE: number;

  @IsString()
  @IsOptional()
  session_type?: 'drilling' | 'open_mat' | 'competition' | 'class' | 'other';

  @IsBoolean()
  @IsOptional()
  gi?: boolean;

  @IsString()
  @IsOptional()
  device_id?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateSessionDto {
  @IsNumber()
  @IsOptional()
  duration_min?: number;

  @IsNumber()
  @IsOptional()
  sRPE?: number;

  @IsString()
  @IsOptional()
  session_type?: string;

  @IsBoolean()
  @IsOptional()
  gi?: boolean;

  @IsOptional()
  metadata?: Record<string, any>;
}
