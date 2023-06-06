import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import { App } from './App';

async function main() {
  const meta = require(path.resolve(__dirname, '..', 'package.json'));
  const options = await yargs(hideBin(process.argv))
    .version(meta.version)
    .option('host', {
      demandOption: true,
      type: 'string',
      desc: 'Mac remote host',
      alias: 'h',
    })
    .option('port', {
      demandOption: false,
      default: 6969,
      type: 'number',
      desc: 'Mac remote port',
      alias: 'p',
    })
    .option('project-dir', {
      default: '.',
      type: 'string',
      desc: 'React Native project root directory',
      alias: 'd',
    })
    .option('dev-team-id', {
      demandOption: true,
      type: 'string',
      desc: 'Apple Development Team ID',
    })
    .option('provisioning-profile-file', {
      desc: 'Provisioning Profile (*.mobileprovision) file to build the project with',
      type: 'string',
      conflicts: 'provisioning-profile-specifier',
    })
    .option('provisioning-profile-specifier', {
      desc: 'Provisioning Profile specifier (UUID format) to build the project with',
      type: 'string',
      conflicts: 'provisioning-profile-file',
    })
    .option('export-options-plist', {
      desc: 'ExportOptions.plist file to build the project with',
      type: 'string',
    })
    .option('release', {
      desc: 'Build Configuration, true for Release, false or omit for Debug',
      type: 'boolean',
    })
    .option('output-folder', {
      desc: 'Output folder for the iOS build result',
      alias: 'o',
      type: 'string',
      default: './ios',
    })
    .option('workspace', {
      alias: 'w',
      desc: 'Workspace folder to connect to for live updates',
      type: 'string',
    })
    .option('createWorkspaceIfNotExists', {
      desc: 'Create the specified workspace folder',
      type: 'boolean',
      implies: 'workspace',
    })
    .check((argv) => {
      if (
        !argv['provisioning-profile-file'] &&
        !argv['provisioning-profile-specifier']
      ) {
        throw new Error(
          'You must specify either --provisioning-profile-file or --provisioning-profile-specifier'
        );
      }
      return true;
    }).argv;
  console.log(options);

  const app = new App(
    options.host,
    options.port,
    options.projectDir,
    options.devTeamId,
    options.outputFolder,
    options.provisioningProfileFile,
    options.provisioningProfileSpecifier,
    options.exportOptionsPlist,
    options.release,
    options.workspace,
    options.createWorkspaceIfNotExists
  );
}

main();
