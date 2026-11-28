import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { IsIn, IsOptional, IsString, MinLength } from "class-validator";
import type {
  GalleryItem,
  PortfolioItem,
  QuoteRequest,
  QuoteStatus,
  ServiceCategory,
  SiteSettings,
} from "@skyprint/shared";
import { AdminAuthGuard } from "../auth/admin-auth.guard";
import { JsonStoreService } from "../store/json-store.service";

class CreateQuoteDto {
  @IsString()
  @MinLength(1)
  customerName!: string;

  @IsString()
  @MinLength(1)
  phone!: string;

  @IsString()
  @MinLength(1)
  service!: string;

  @IsString()
  details!: string;
}

class UpdateQuoteDto {
  @IsOptional()
  @IsIn(["New", "Quoted", "In Production", "Completed"])
  status?: QuoteStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}

@Controller()
export class CmsController {
  constructor(private readonly store: JsonStoreService) {}

  @Get("health")
  health() {
    return { status: "ok", service: "skyprint-api" };
  }

  /* ---------------- Quotes ---------------- */
  @Get("quotes")
  @UseGuards(AdminAuthGuard)
  getQuotes() {
    return this.store.read<QuoteRequest[]>("quotes.json", []);
  }

  @Post("quotes")
  createQuote(@Body() dto: CreateQuoteDto) {
    const items = this.store.read<QuoteRequest[]>("quotes.json", []);
    const created: QuoteRequest = {
      id: `q-${Date.now().toString().slice(-6)}`,
      customerName: dto.customerName,
      phone: dto.phone,
      service: dto.service,
      details: dto.details,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    this.store.write("quotes.json", [created, ...items]);
    return created;
  }

  @Patch("quotes/:id")
  @UseGuards(AdminAuthGuard)
  updateQuote(@Param("id") id: string, @Body() dto: UpdateQuoteDto) {
    const items = this.store.read<QuoteRequest[]>("quotes.json", []);
    const next = items.map((q) => (q.id === id ? { ...q, ...dto } : q));
    return this.store.write("quotes.json", next);
  }

  @Delete("quotes/:id")
  @UseGuards(AdminAuthGuard)
  deleteQuote(@Param("id") id: string) {
    const items = this.store.read<QuoteRequest[]>("quotes.json", []);
    const next = items.filter((q) => q.id !== id);
    return this.store.write("quotes.json", next);
  }

  /* ---------------- Services ---------------- */
  @Get("services")
  getServices() {
    return this.store.read<ServiceCategory[]>("services.json", []);
  }

  @Put("services")
  @UseGuards(AdminAuthGuard)
  saveServices(@Body() items: ServiceCategory[]) {
    return this.store.write("services.json", items);
  }

  /* ---------------- Portfolio / Showcase ---------------- */
  @Get("portfolio")
  getPortfolio() {
    return this.store.read<PortfolioItem[]>("portfolio.json", []);
  }

  @Put("portfolio")
  @UseGuards(AdminAuthGuard)
  savePortfolio(@Body() items: PortfolioItem[]) {
    return this.store.write("portfolio.json", items);
  }

  /* ---------------- Gallery ---------------- */
  @Get("gallery")
  getGallery() {
    return this.store.read<GalleryItem[]>("gallery.json", []);
  }

  @Put("gallery")
  @UseGuards(AdminAuthGuard)
  saveGallery(@Body() items: GalleryItem[]) {
    return this.store.write("gallery.json", items);
  }

  /* ---------------- Site Settings ---------------- */
  @Get("settings")
  getSettings() {
    return this.store.read<Partial<SiteSettings>>("settings.json", {});
  }

  @Put("settings")
  @UseGuards(AdminAuthGuard)
  saveSettings(@Body() settings: SiteSettings) {
    return this.store.write("settings.json", settings);
  }
}
