/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category OrderUnstake
 * @category generated
 */
export type OrderUnstakeInstructionArgs = {
  msolAmount: beet.bignum
}
/**
 * @category Instructions
 * @category OrderUnstake
 * @category generated
 */
export const orderUnstakeStruct = new beet.BeetArgsStruct<
  OrderUnstakeInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['msolAmount', beet.u64],
  ],
  'OrderUnstakeInstructionArgs',
)
/**
 * Accounts required by the _orderUnstake_ instruction
 *
 * @property [_writable_] state
 * @property [_writable_] msolMint
 * @property [_writable_] burnMsolFrom
 * @property [**signer**] burnMsolAuthority
 * @property [_writable_] newTicketAccount
 * @property [] clock
 * @category Instructions
 * @category OrderUnstake
 * @category generated
 */
export type OrderUnstakeInstructionAccounts = {
  state: web3.PublicKey
  msolMint: web3.PublicKey
  burnMsolFrom: web3.PublicKey
  burnMsolAuthority: web3.PublicKey
  newTicketAccount: web3.PublicKey
  clock: web3.PublicKey
}

export const OrderUnstakeAccounts = [
  'state',
  'msolMint',
  'burnMsolFrom',
  'burnMsolAuthority',
  'newTicketAccount',
  'clock',
]

export const orderUnstakeInstructionDiscriminator = [
  97, 167, 144, 107, 117, 190, 128, 36,
]

export type OrderUnstakeInstruction = {
  programId: web3.PublicKey
  keys: web3.AccountMeta[]
  data: Buffer
}

/**
 * Creates a _OrderUnstake_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category OrderUnstake
 * @category generated
 */
export function createOrderUnstakeInstruction(
  accounts: OrderUnstakeInstructionAccounts,
  args: OrderUnstakeInstructionArgs,
): OrderUnstakeInstruction {
  const {
    state,
    msolMint,
    burnMsolFrom,
    burnMsolAuthority,
    newTicketAccount,
    clock,
  } = accounts

  const [data] = orderUnstakeStruct.serialize({
    instructionDiscriminator: orderUnstakeInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: state,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: msolMint,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: burnMsolFrom,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: burnMsolAuthority,
      isWritable: false,
      isSigner: true,
    },
    {
      pubkey: newTicketAccount,
      isWritable: true,
      isSigner: false,
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
      pubkey: splToken.TOKEN_PROGRAM_ID,
      isWritable: false,
      isSigner: false,
    },
  ]

  const ix: OrderUnstakeInstruction = new web3.TransactionInstruction({
    programId: new web3.PublicKey('NONE'),
    keys,
    data,
  })
  return ix
}