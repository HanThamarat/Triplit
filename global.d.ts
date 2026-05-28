import { DataSource } from "typeorm";

declare global {
  // This extends the global environment type safety definition
  var typeormDS: DataSource | null | undefined;
}

export {};