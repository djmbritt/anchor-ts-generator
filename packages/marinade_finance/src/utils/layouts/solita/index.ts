export * from './accounts/index.js'
export * from './errors/index.js'
export * from './instructions/index.js'
export * from './types/index.js'

import {
  AddLiquidityInstruction,
  AddValidatorInstruction,
  ChangeAuthorityInstruction,
  ClaimInstruction,
  ConfigLpInstruction,
  ConfigMarinadeInstruction,
  ConfigValidatorSystemInstruction,
  DeactivateStakeInstruction,
  DepositInstruction,
  DepositStakeAccountInstruction,
  EmergencyUnstakeInstruction,
  InitializeInstruction,
  LiquidUnstakeInstruction,
  MergeStakesInstruction,
  OrderUnstakeInstruction,
  PartialUnstakeInstruction,
  RemoveLiquidityInstruction,
  RemoveValidatorInstruction,
  SetValidatorScoreInstruction,
  StakeReserveInstruction,
  UpdateActiveInstruction,
  UpdateDeactivatedInstruction,
} from './instructions/index.js'

import {
  State,
  StateArgs,
  TicketAccountData,
  TicketAccountDataArgs,
} from './accounts/index.js'

import {
  ChangeAuthorityData,
  ConfigLpParams,
  ConfigMarinadeParams,
  Fee,
  InitializeData,
  LiqPool,
  LiqPoolInitializeData,
  List,
  StakeRecord,
  StakeSystem,
  ValidatorRecord,
  ValidatorSystem,
} from './types/index.js'

export type ParsedInstructions =
  | AddLiquidityInstruction
  | AddValidatorInstruction
  | ChangeAuthorityInstruction
  | ClaimInstruction
  | ConfigLpInstruction
  | ConfigMarinadeInstruction
  | ConfigValidatorSystemInstruction
  | DeactivateStakeInstruction
  | DepositInstruction
  | DepositStakeAccountInstruction
  | EmergencyUnstakeInstruction
  | InitializeInstruction
  | LiquidUnstakeInstruction
  | MergeStakesInstruction
  | OrderUnstakeInstruction
  | PartialUnstakeInstruction
  | RemoveLiquidityInstruction
  | RemoveValidatorInstruction
  | SetValidatorScoreInstruction
  | StakeReserveInstruction
  | UpdateActiveInstruction
  | UpdateDeactivatedInstruction

export type ParsedAccounts = State | TicketAccountData

export type ParsedAccountsData = StateArgs | TicketAccountDataArgs

export type ParsedTypes =
  | ChangeAuthorityData
  | ConfigLpParams
  | ConfigMarinadeParams
  | Fee
  | InitializeData
  | LiqPool
  | LiqPoolInitializeData
  | List
  | StakeRecord
  | StakeSystem
  | ValidatorRecord
  | ValidatorSystem