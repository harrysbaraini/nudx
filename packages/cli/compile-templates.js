import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import Listr from "listr"
import Handlebars from "handlebars"
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function getFiles(dir) {
  let files = [];

  const items = readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFiles(`${dir}/${item.name}`))];
    } else {
      if (item.name.endsWith('.handlebars')) {
        const path = `${dir}/${item.name}`;
        files.push({
          name: item.name.replace('.handlebars', ''),
          dir,
          path,
        });
      }
    }
  }

  return files;
}

async function execute() {
  const cliTemplates = await getFiles(join(__dirname, 'src', 'templates'));

  const tasks = new Listr(
    cliTemplates.map((templateFile) => {
      return {
        title: `Compiling ${templateFile.path}`,
        task: async () => {
          const content = readFileSync(templateFile.path).toString();

          const compiled = Handlebars.precompile(content);

          writeFileSync(
            `${templateFile.dir}/${templateFile.name}.tpl.js`,
            `export default ${compiled}`,
          );
        },
      };
    }),
  );

  await tasks.run();

  return 0;
}

execute();
