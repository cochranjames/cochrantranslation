import * as fs from "fs";
import * as path from "path";
import * as yml from "js-yaml";

const config = yml.load(fs.readFileSync("config.yml", "utf8"));
console.log(config);

const toHTML = (src, data) => {
  const template = new Function("data", `return \`${src}\``);
  return template(data);
};

const copyFiles = (src, dest) => {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  fs.readdirSync(src, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach((file) => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      //check if the file is a directory and check if the directory exists
      if (fs.lstatSync(srcPath).isDirectory()) {
        copyFiles(srcPath, destPath);
        return;
      }
      fs.copyFileSync(srcPath, destPath, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Copied ${srcPath} to ${destPath}`);
      });
    });
  });
};
copyFiles("src", "docs");

const home = fs.readFileSync("src/index.html", "utf8");
const homeHTML = toHTML(home, config[0]);
fs.writeFileSync("docs/index.html", homeHTML);
