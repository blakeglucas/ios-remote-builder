import { connect, Socket } from 'socket.io-client';
import { Readable, Writable } from 'stream';
import chokidar from 'chokidar';
import fsx from 'fs-extra';
import ignore from 'ignore';
import path from 'path';
import tar from 'tar-fs';
import { tarPack } from './utils/tarPack';

export type BuildPayload = {
  files: Buffer;
  developmentTeamId: string;
  exportOptionsPlist?: Buffer;
  provisioningProfile?: Buffer;
  provisioningSpecifier?: string;
  release?: boolean;
};

export class App {
  private socket: Socket;
  constructor(
    private host: string,
    private port: number,
    private projectDir: string,
    private devTeamId: string,
    private outputPath: string,
    private provProfileFile?: string,
    private provProfileSpec?: string,
    private exportOptionPlist?: string,
    private release?: boolean,
    private workspace?: string,
    private shouldCreateWorkspace?: boolean
  ) {
    this.onConnect = this.onConnect.bind(this);
    this.socket = connect(`${this.host}:${this.port}`, {
      reconnectionAttempts: 10,
      reconnectionDelay: 250,
    });
    this.socket.on('connect', this.onConnect);
    this.socket.on('log/stdout', this.onStdOut);
    this.socket.on('log/stderr', this.onStdErr);
    this.socket.on('log/msg', this.onStdOut);
    this.socket.on('log/error', this.onStdErr);
    this.projectDir = path.isAbsolute(this.projectDir)
      ? this.projectDir
      : path.resolve(process.cwd(), this.projectDir);
  }

  private onConnect() {
    if (!this.workspace) {
      this.build();
    } else {
      this.attachWorkspace();
    }
  }

  private async build() {
    try {
      const { files, eopFile, provisioningProfileFile } =
        await this.prepBuildContents();
      this.socket.emit('build/start', {
        files,
        developmentTeamId: this.devTeamId,
        exportOptionsPlist: eopFile,
        provisioningProfile: provisioningProfileFile,
        provisioningSpecifier: this.provProfileSpec,
        release: this.release,
      } as BuildPayload);

      const iosBuffer = await new Promise<Buffer | undefined>((resolve) => {
        this.socket.once('build/finish', (iosTar?: Buffer) => resolve(iosTar));
      });
      if (iosBuffer) {
        new Readable({
          read() {
            this.push(iosBuffer);
            this.push(null);
          },
        }).pipe(
          tar.extract(path.join(process.cwd(), this.outputPath), {
            readable: true,
            writable: true,
          })
        );
      } else {
        console.error('BUILD FAILED');
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.socket.disconnect();
    }
  }

  private async attachWorkspace() {
    const success = await new Promise((resolve) => {
      this.socket.once('workspace/activate/fail', () => resolve(false));
      this.socket.once('workspace/activate/success', () => resolve(true));
      this.socket.emit('workspace/activate', this.workspace!);
    });
    if (success) {
      console.log('attach success');
      const workspacesIgnores = ignore()
        .add('Pods/')
        .add('node_modules/')
        .add('.git/')
        .add('.vscode/')
        .add('.expo/')
        .add('android/')
        .add('ios/');
      const sourceContent = await tarPack(this.projectDir, workspacesIgnores);
      this.socket.emit('workspace/syncFiles', sourceContent);
      chokidar
        .watch(this.projectDir, {
          ignored: (absPath) => {
            const relPath = path.relative(
              this.projectDir,
              absPath.split(path.sep).join(path.posix.sep)
            );
            if (relPath) {
              return workspacesIgnores.ignores(relPath);
            } else {
              return false;
            }
          },
        })
        .on('add', async (absPath) => {
          const fileContent = await fsx.readFile(absPath);
          const relPath = path
            .relative(this.projectDir, absPath)
            .split(path.sep)
            .join(path.posix.sep);
          this.socket.emit('workspace/file/create', relPath, fileContent);
        })
        .on('change', async (absPath) => {
          const fileContent = await fsx.readFile(absPath);
          const relPath = path
            .relative(this.projectDir, absPath)
            .split(path.sep)
            .join(path.posix.sep);
          this.socket.emit('workspace/file/change', relPath, fileContent);
        })
        .on('unlink', (absPath) => {
          const relPath = path
            .relative(this.projectDir, absPath)
            .split(path.sep)
            .join(path.posix.sep);
          this.socket.emit('workspace/file/delete', relPath);
        });
      process.on('SIGINT', () => {
        this.socket.emit('workspace/deactivate');
        process.exit();
      });
    } else {
      if (this.shouldCreateWorkspace) {
        const didCreate = await this.createWorkspace();
        if (didCreate) {
          this.attachWorkspace();
        } else {
          console.error('Failed to create workspace. Exiting...');
          this.socket.disconnect();
        }
      } else {
        console.error(
          'Workspace does not exist and create is not specified. Exiting...'
        );
        this.socket.disconnect();
      }
    }
  }

  private async createWorkspace() {
    const { files, eopFile, provisioningProfileFile } =
      await this.prepBuildContents();
    const buildPayload = {
      files,
      developmentTeamId: this.devTeamId,
      exportOptionsPlist: eopFile,
      provisioningProfile: provisioningProfileFile,
      provisioningSpecifier: this.provProfileSpec,
      release: this.release,
    };
    const success = await new Promise<boolean>((resolve, reject) => {
      this.socket.once('workspace/create/finish', () => resolve(true));
      this.socket.once('workspace/create/error', () => resolve(false));
      this.socket.emit(
        'workspace/create',
        this.workspace,
        undefined,
        buildPayload
      );
    });
    if (success) {
      console.log('Create workspace success');
    } else {
      console.error('Create workspace failed');
    }
    return success;
  }

  private async prepBuildContents() {
    const ignoreRules = ignore().add('.git/');
    if (await fsx.exists(path.join(this.projectDir, '.gitignore'))) {
      const ignoreContent = await fsx.readFile(
        path.join(this.projectDir, '.gitignore')
      );
      ignoreRules.add(ignoreContent.toString());
    }
    if (await fsx.exists(path.join(this.projectDir, '.vscodeignore'))) {
      const ignoreContent = await fsx.readFile(
        path.join(this.projectDir, '.vscodeignore')
      );
      ignoreRules.add(ignoreContent.toString());
    }
    const chunks: Buffer[] = [];
    const ws = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });
    tar
      .pack(this.projectDir, {
        ignore: (name) => {
          const relName = path
            .relative(this.projectDir, name)
            .split(path.sep)
            .join(path.posix.sep);
          return ignoreRules.ignores(relName);
        },
      })
      .pipe(ws);
    await new Promise((resolve) => {
      ws.on('finish', resolve);
    });
    const files = Buffer.concat(chunks);

    let provisioningProfileFile: Buffer | undefined;
    if (this.provProfileFile) {
      provisioningProfileFile = await fsx.readFile(this.provProfileFile);
    }

    let eopFile: Buffer | undefined;
    if (this.exportOptionPlist) {
      eopFile = await fsx.readFile(this.exportOptionPlist);
    }

    return { files, provisioningProfileFile, eopFile };
  }

  private onStdOut(msg: string) {
    console.log(msg);
  }

  private onStdErr(msg: string) {
    console.log(msg);
  }
}
