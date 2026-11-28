import { Module } from "@nestjs/common";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { AdminAuthGuard } from "./auth/admin-auth.guard";
import { CmsController } from "./cms/cms.controller";
import { JsonStoreService } from "./store/json-store.service";

@Module({
  controllers: [AuthController, CmsController],
  providers: [AuthService, AdminAuthGuard, JsonStoreService],
})
export class AppModule {}
