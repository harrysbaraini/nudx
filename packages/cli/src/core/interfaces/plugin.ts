import { CliInstance } from "../cli";

export interface Plugin {
  install?(cli: CliInstance): Promise<void> | void;
}
