/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category AddValidator
 * @category generated
 */
export type AddValidatorInstructionArgs = {
  score: number
}
/**
 * @category Instructions
 * @category AddValidator
 * @category generated
 */
export const addValidatorStruct = new beet.BeetArgsStruct<
  AddValidatorInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['score', beet.u32],
  ],
  'AddValidatorInstructionArgs',
)
/**
 * Accounts required by the _addValidator_ instruction
 *
 * @property [_writable_] state
 * @property [**signer**] managerAuthority
 * @property [_writable_] validatorList
 * @property [] validatorVote
 * @property [_writable_] duplicationFlag
 * @property [_writable_, **signer**] rentPayer
 * @property [] clock
 * @category Instructions
 * @category AddValidator
 * @category generated
 */
export type AddValidatorInstructionAccounts = {
  state: web3.PublicKey
  managerAuthority: web3.PublicKey
  validatorList: web3.PublicKey
  validatorVote: web3.PublicKey
  duplicationFlag: web3.PublicKey
  rentPayer: web3.PublicKey
  clock: web3.PublicKey
}

export const AddValidatorAccounts = [
  'state',
  'managerAuthority',
  'validatorList',
  'validatorVote',
  'duplicationFlag',
  'rentPayer',
  'clock',
]

export const addValidatorInstructionDiscriminator = [
  250, 113, 53, 54, 141, 117, 215, 185,
]

export type AddValidatorInstruction = {
  programId: web3.PublicKey
  keys: web3.AccountMeta[]
  data: Buffer
}

/**
 * Creates a _AddValidator_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category AddValidator
 * @category generated
 */
export function createAddValidatorInstruction(
  accounts: AddValidatorInstructionAccounts,
  args: AddValidatorInstructionArgs,
): AddValidatorInstruction {
  const {
    state,
    managerAuthority,
    validatorList,
    validatorVote,
    duplicationFlag,
    rentPayer,
    clock,
  } = accounts

  const [data] = addValidatorStruct.serialize({
    instructionDiscriminator: addValidatorInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: state,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: managerAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: validatorList,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: validatorVote,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: duplicationFlag,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: rentPayer,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: clock,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix: AddValidatorInstruction = new web3.TransactionInstruction({
    programId: new web3.PublicKey('NONE'),
    keys,
    data,
  })
  return ix
}