import { CliInstance } from "../cli";

export interface Plugin {
  install?(cli: CliInstance): void;
}
