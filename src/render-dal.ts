export function renderDALFiles(name: string){
    const dollar = '$'
    const com = '`'
    const Name = name.charAt(0).toUpperCase().concat(name.slice(1))
    const main: string = 
`export * from './common'
export * from './fetcherState'`
  
    const common: string =
`import { config } from '@aleph-indexer/core'
import { ProgramName } from '../constants'

export enum InstructionDAL {
  Instruction = 'instruction',
}

export const dbPath = ${com}${dollar}{config.DB_FOLDER}/${dollar}{ProgramName.${Name}}${com}`

const instruction: string = 
`import { EntityStorage } from '@aleph-indexer/core'
import { InstructionEvent } from '../types'
import { dbPath as path, InstructionDAL } from './common'

export type InstructionStorage = EntityStorage<InstructionEvent>

export const instructionEventDAL = new EntityStorage<InstructionEvent>({
  name: InstructionDAL.Instruction,
  path,
  primaryKey: [{ get: (e) => e.id, length: EntityStorage.VariableLength }],
  indexes: [
    {
      name: 'timestamp',
      key: [{ get: (e) => e.timestamp, length: EntityStorage.TimestampLength }],
    },
    {
      name: 'account_timestamp',
      key: [
        { get: (e) => e.account, length: EntityStorage.AddressLength },
        { get: (e) => e.timestamp, length: EntityStorage.TimestampLength },
      ],
    }
  ],
})`

    const fetcherState: string = 
`import { FetcherStateLevelStorage } from '@aleph-indexer/core'
import { dbPath as path } from './common'

export const fetcherStateLevelStorage = new FetcherStateLevelStorage({ path })`
  
    return { main, common, instruction, fetcherState }
  }