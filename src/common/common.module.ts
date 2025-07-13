import { Module } from '@nestjs/common';
import { AuthGuard } from './guards/jwt-auth.guard';

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class CommonModule {}
