import { Idl, TemplateType } from "./types.js";
import { existsSync, mkdirSync, writeFileSync, readFileSync, realpathSync } from "fs";
import { PACKAGE_ROOT } from "./constants.js";
import Mustache from "mustache";
import IdlTransformer from "./transformer.js";

import { Paths } from './paths.js'
import { renderRootFiles } from './render-root.js'
import { renderSrcFiles } from './render-src.js'
import { renderParsersFiles } from './render-parsers.js'
import { renderGraphQLFiles } from './render-graphql.js'
import { renderDALFiles } from './render-dal.js'
import { renderDomainFiles } from './render-domain.js'
import { renderIndexersFiles } from './render-indexers.js'
import { renderLayoutsFiles } from './render-layouts.js'

export default function generate(fileName: string, toGenerate: TemplateType[]) {
  const paths = new Paths(`./`, fileName)
  const idl = parseIdl(paths.idlFile(fileName))

  if(!existsSync(paths.outputDir))
    mkdirSync(paths.outputDir)

  if(!existsSync(paths.projectDir))
    mkdirSync(paths.projectDir)

  if(!existsSync(paths.tsDir))
    mkdirSync(paths.tsDir)
  const { typesView, instructionsView, eventsView, accountsView } = generateFromTemplateType(idl, toGenerate, paths)
  console.log(typesView, instructionsView, eventsView, accountsView)

  if(!existsSync(paths.indexerDir))
    mkdirSync(paths.indexerDir)
  const { config, docker, pkg, readme, run, tsconfig, typesdts } = renderRootFiles(fileName)
  writeFileSync(paths.indexerFile('config.ts'), config);
  writeFileSync(paths.indexerFile('docker-compose.yaml'), docker);
  writeFileSync(paths.indexerFile('package.json'), pkg);
  writeFileSync(paths.indexerFile('README.md'), readme);
  writeFileSync(paths.indexerFile('run.ts'), run);
  writeFileSync(paths.indexerFile('tsconfig.json'), tsconfig);
  writeFileSync(paths.indexerFile('types.d.ts'), typesdts);

  if(!existsSync(paths.srcDir))
    mkdirSync(paths.srcDir)
  const { constants, solanarpc, types } = renderSrcFiles(fileName)
  writeFileSync(paths.srcFile('constants'), constants);
  writeFileSync(paths.srcFile('solanaRpc'), solanarpc);
  writeFileSync(paths.srcFile('types'), types);

  if(!existsSync(paths.dalDir))
    mkdirSync(paths.dalDir)
  const { main, common, eventDAL, fetcherPool, fetcherState } = renderDALFiles(fileName)
  writeFileSync(paths.dalFile('index'), main);
  writeFileSync(paths.dalFile('common'), common);
  writeFileSync(paths.dalFile('event'), eventDAL);
  writeFileSync(paths.dalFile('fetcherPool'), fetcherPool);
  writeFileSync(paths.dalFile('fetcherState'), fetcherState);

  if(!existsSync(paths.domainDir))
    mkdirSync(paths.domainDir)
  const { aggregator, processor, custom } = renderDomainFiles(fileName)
  writeFileSync(paths.domainFile('aggregator'), aggregator);
  writeFileSync(paths.domainFile('processor'), processor);
  writeFileSync(paths.domainFile(fileName), custom);
  
  if(!existsSync(paths.graphqlDir))
    mkdirSync(paths.graphqlDir)
  const { index, resolvers, schema, GQLtypes } = renderGraphQLFiles(fileName)
  writeFileSync(paths.graphqlFile('index'), index);
  writeFileSync(paths.graphqlFile('resolvers'), resolvers);
  writeFileSync(paths.graphqlFile('schema'), schema);
  writeFileSync(paths.graphqlFile('types'), GQLtypes);

  if(!existsSync(paths.indexersDir))
    mkdirSync(paths.indexersDir)
  const { aggregatorIndexers, customIndexer } = renderIndexersFiles(fileName)
  writeFileSync(paths.indexersFile('aggregator'), aggregatorIndexers);
  writeFileSync(paths.indexersFile(fileName), customIndexer);

  if(!existsSync(paths.layaoutsDir))
    mkdirSync(paths.layaoutsDir)
  const { accountLayouts, ixLayouts } = renderLayoutsFiles(instructionsView)
  writeFileSync(paths.layoutsFile('accounts'), accountLayouts);
  writeFileSync(paths.layoutsFile('instructions'), ixLayouts);

  if(!existsSync(paths.parsersDir))
    mkdirSync(paths.parsersDir)
  const { aggregatorParser, instructionParser } = renderParsersFiles(fileName, eventsView)
  writeFileSync(paths.parsersFile('aggregator'), aggregatorParser);
  writeFileSync(paths.parsersFile('instruction'), instructionParser);

  if(!existsSync(paths.utilsDir))
    mkdirSync(paths.utilsDir)
}

function generateFromTemplateType(idl: Idl, toGenerate: TemplateType[], paths: Paths) {
  let typesView, instructionsView, eventsView, accountsView = null

  for (const templateType of toGenerate) {
    switch (templateType) {
      case TemplateType.Types:
        if (idl.types && idl.instructions) {
          const { template, view } = generateTypes(idl)
          const text = Mustache.render(template, view);
          writeFileSync(paths.tsFile(templateType), text)
          typesView = view
        }
        else console.log("No IDL types detected")
        break
  
      case TemplateType.Instructions:
        if (idl.types && idl.instructions) {
          const { template, view } = generateInstructions(idl)
          const text = Mustache.render(template, view);
          // TODO: Modularize to enum.mustache
          writeFileSync(paths.tsFile(templateType), text.slice(0, text.length-2))
          instructionsView = view
        }
        else console.log("Missing IDL types or instructions")
        break
  
      case TemplateType.Events:
        if (idl.events && idl.instructions){
          const { template, view } = generateEvents(idl)
          const text = Mustache.render(template, view)
          // TODO: Modularize to enum.mustache
          writeFileSync(paths.tsFile(templateType), text.slice(0, text.length-2))
          eventsView = view
        }
        else console.log("Missing IDL events or instructions")
        break

        case TemplateType.Accounts:
          if (idl.accounts && idl.events){
            const { template, view } = generateAccounts(idl)
            const text = Mustache.render(template, view)
            // TODO: Modularize to enum.mustache
            writeFileSync(paths.tsFile(templateType), text.slice(0, text.length-2))
            accountsView = view
          }
          else console.log("Missing IDL accounts or events")
          break
  
      default:
        console.log(`template type ${templateType} not supported`)
    }
  }
  return { typesView, instructionsView, eventsView, accountsView }
}

function generateTypes(idl: Idl) {
  const trafo = new IdlTransformer(idl);
  let view = trafo.generateViewTypes();
  const template = readFileSync(
    `${PACKAGE_ROOT}/src/mustaches/types.mustache`, "utf8");
  return { template, view };
}

function generateInstructions(idl: Idl) {
  const trafo = new IdlTransformer(idl);
  const view = trafo.generateViewInstructions();
  const template = readFileSync(
    `${PACKAGE_ROOT}/src/mustaches/instructions.mustache`, "utf8");
  return { template, view };
}

function generateEvents(idl: Idl) {
  const trafo = new IdlTransformer(idl);
  const view = trafo.generateViewEvents();
  const template = readFileSync(
    `${PACKAGE_ROOT}/src/mustaches/events.mustache`, "utf8");
  return { template, view };
}

function generateAccounts(idl: Idl) {
  const trafo = new IdlTransformer(idl);
  const view = trafo.generateViewAccounts();
  const template = readFileSync(
    `${PACKAGE_ROOT}/src/mustaches/accounts.mustache`, "utf8");
  return { template, view };
}

function parseIdl(path: string): Idl {
  console.log(realpathSync(path))
  return JSON.parse(readFileSync(path, "utf8"))
}
