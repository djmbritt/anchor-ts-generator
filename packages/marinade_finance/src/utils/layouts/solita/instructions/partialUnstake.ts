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
 * @category PartialUnstake
 * @category generated
 */
export type PartialUnstakeInstructionArgs = {
  stakeIndex: number
  validatorIndex: number
  desiredUnstakeAmount: beet.bignum
}
/**
 * @category Instructions
 * @category PartialUnstake
 * @category generated
 */
export const partialUnstakeStruct = new beet.BeetArgsStruct<
  PartialUnstakeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['stakeIndex', beet.u32],
    ['validatorIndex', beet.u32],
    ['desiredUnstakeAmount', beet.u64],
  ],
  'PartialUnstakeInstructionArgs',
)
/**
 * Accounts required by the _partialUnstake_ instruction
 *
 * @property [_writable_] state
 * @property [**signer**] validatorManagerAuthority
 * @property [_writable_] validatorList
 * @property [_writable_] stakeList
 * @property [_writable_] stakeAccount
 * @property [] stakeDepositAuthority
 * @property [] reservePda
 * @property [_writable_, **signer**] splitStakeAccount
 * @property [_writable_, **signer**] splitStakeRentPayer
 * @property [] clock
 * @property [] stakeHistory
 * @property [] stakeProgram
 * @category Instructions
 * @category PartialUnstake
 * @category generated
 */
export type PartialUnstakeInstructionAccounts = {
  state: web3.PublicKey
  validatorManagerAuthority: web3.PublicKey
  validatorList: web3.PublicKey
  stakeList: web3.PublicKey
  stakeAccount: web3.PublicKey
  stakeDepositAuthority: web3.PublicKey
  reservePda: web3.PublicKey
  splitStakeAccount: web3.PublicKey
  splitStakeRentPayer: web3.PublicKey
  clock: web3.PublicKey
  stakeHistory: web3.PublicKey
  stakeProgram: web3.PublicKey
}

export const PartialUnstakeAccounts = [
  'state',
  'validatorManagerAuthority',
  'validatorList',
  'stakeList',
  'stakeAccount',
  'stakeDepositAuthority',
  'reservePda',
  'splitStakeAccount',
  'splitStakeRentPayer',
  'clock',
  'stakeHistory',
  'stakeProgram',
]

export const partialUnstakeInstructionDiscriminator = [
  55, 241, 205, 221, 45, 114, 205, 163,
]

export type PartialUnstakeInstruction = {
  programId: web3.PublicKey
  keys: web3.AccountMeta[]
  data: Buffer
}

/**
 * Creates a _PartialUnstake_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category PartialUnstake
 * @category generated
 */
export function createPartialUnstakeInstruction(
  accounts: PartialUnstakeInstructionAccounts,
  args: PartialUnstakeInstructionArgs,
): PartialUnstakeInstruction {
  const {
    state,
    validatorManagerAuthority,
    validatorList,
    stakeList,
    stakeAccount,
    stakeDepositAuthority,
    reservePda,
    splitStakeAccount,
    splitStakeRentPayer,
    clock,
    stakeHistory,
    stakeProgram,
  } = accounts

  const [data] = partialUnstakeStruct.serialize({
    instructionDiscriminator: partialUnstakeInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: state,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: validatorManagerAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: validatorList,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: stakeList,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: stakeAccount,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: stakeDepositAuthority,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: reservePda,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: splitStakeAccount,
      isWritable: true,
      isSigner: true,
    },
    {
      pubkey: splitStakeRentPayer,
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
      pubkey: stakeHistory,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: web3.SystemProgram.programId,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: stakeProgram,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix: PartialUnstakeInstruction = new web3.TransactionInstruction({
    programId: new web3.PublicKey('NONE'),
    keys,
    data,
  })
  return ix
}