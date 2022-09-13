import { PathLike } from 'fs'
import path from 'path'

export class Paths {
  constructor(readonly root: PathLike, readonly project: string) {}

  get rootDir() {
    return this.root.toString()
  }

  get idlDir() {
    return path.join(this.rootDir.toString(), 'idl')
  }
  idlFile(name: string) {
    return path.join(this.idlDir, `${name}.json`)
  }

  get outputDir() {
   return path.join(this.rootDir.toString(), 'output')
  }

  get projectDir() {
    return path.join(this.outputDir.toString(), this.project)
  }
  projectFile(name: string) {
    return path.join(this.projectDir, name)
  }

  get srcDir() {
    return path.join(this.projectDir.toString(), 'src')
  }
  srcFile(name: string) {
    return path.join(this.srcDir, `${name}.ts`)
  }

  get apiDir() {
    return path.join(this.srcDir.toString(), 'api')
  }
  apiFile(name: string) {
    return path.join(this.apiDir, `${name}.ts`)
  }

  get dalDir() {
    return path.join(this.srcDir.toString(), 'dal')
  }
  get relDalDir() {
    return path.relative(process.cwd(), this.dalDir)
  }
  dalFile(name: string) {
    return path.join(this.dalDir, `${name}.ts`)
  }

  get domainDir() {
    return path.join(this.srcDir.toString(), 'domain')
  }
  get relDomainDir() {
    return path.relative(process.cwd(), this.domainDir)
  }
  domainFile(name: string) {
    return path.join(this.domainDir, `${name}.ts`)
  }

  get discovererDir() {
    return path.join(this.domainDir.toString(), 'discoverer')
  }
  get relDiscovererDir() {
    return path.relative(process.cwd(), this.discovererDir)
  }
  discovererFile(name: string) {
    return path.join(this.discovererDir, `${name}.ts`)
  }

  get statsDir() {
    return path.join(this.domainDir.toString(), 'stats')
  }
  get relStatsDir() {
    return path.relative(process.cwd(), this.statsDir)
  }
  statsFile(name: string) {
    return path.join(this.statsDir, `${name}.ts`)
  }

  get parsersDir() {
    return path.join(this.srcDir.toString(), 'parsers')
  }
  get relParsersDir() {
    return path.relative(process.cwd(), this.parsersDir)
  }
  parsersFile(name: string) {
    return path.join(this.parsersDir, `${name}.ts`)
  }

  get utilsDir() {
    return path.join(this.srcDir.toString(), 'utils')
  }
  get relUtilsDir() {
    return path.relative(process.cwd(), this.utilsDir)
  }
  utilsFile(name: string) {
    return path.join(this.utilsDir, `${name}.ts`)
  }

  get layaoutsDir() {
    return path.join(this.utilsDir.toString(), 'layouts')
  }
  get relLayaoutsDir() {
    return path.relative(process.cwd(), this.layaoutsDir)
  }
  layoutsFile(name: string) {
    return path.join(this.layaoutsDir, `${name}.ts`)
  }

  get tsDir() {
    return path.join(this.layaoutsDir.toString(), 'ts')
  }
  tsFile(name: string) {
    return path.join(this.tsDir, `${name}.ts`)
  }

  get tsSolitaDir() {
    return path.join(this.layaoutsDir.toString(), 'solita')
  }
}
