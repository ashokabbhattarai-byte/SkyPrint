import { Injectable } from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";

@Injectable()
export class JsonStoreService {
  private readonly dataDir = path.resolve(process.cwd(), "data");

  private ensureDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  read<T>(filename: string, fallback: T): T {
    this.ensureDir();
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      this.write(filename, fallback);
      return fallback;
    }
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  write<T>(filename: string, data: T): T {
    this.ensureDir();
    const filePath = path.join(this.dataDir, filename);
    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmpPath, filePath);
    return data;
  }
}
