import { METHODS } from './communication/methods';
import { RPC_CALLS } from './eth/constants';
import { TXs } from './txs';
import { Eth } from './eth';
import { Safe } from './safe';

export interface Transaction {
  to: string;
  value: string;
  data: string;
}

export type RequestId = string;

export type GetTxBySafeTxHashParams = {
  safeTxHash: string;
};

export interface SendTransactionParams {
  safeTxGas?: number;
}

export interface SendTransactionsArgs {
  txs: Transaction[];
  params?: SendTransactionParams;
}

export type GetBalanceParams = { currency?: string };

export type SendTransactionsResponse = {
  safeTxHash: string;
};

export interface SdkInstance {
  txs: TXs;
  eth: Eth;
  safe: Safe;
}

export interface SafeInfo {
  safeAddress: string;
  chainId: number;
}

export type Methods = keyof typeof METHODS;

export type SDKRequestData<M extends Methods = Methods, P = unknown> = {
  id: RequestId;
  params: P;
  env: {
    sdkVersion: string;
  };
  method: M;
};

export type SDKMessageEvent = MessageEvent<SDKRequestData>;

export type ErrorResponse = {
  id: RequestId;
  success: false;
  error: string;
  version?: string;
};

export type SuccessResponse<T = MethodToResponse[Methods]> = {
  id: RequestId;
  data: T;
  version?: string;
  success: true;
};

export type Response<T = MethodToResponse[Methods]> = ErrorResponse | SuccessResponse<T>;

export type InterfaceMessageEvent = MessageEvent<Response>;

export interface MethodToResponse {
  [METHODS.sendTransactions]: Record<string, string>;
  [METHODS.rpcCall]: unknown;
  [METHODS.getSafeInfo]: SafeInfo;
  [METHODS.getTxBySafeTxHash]: TxServiceModel;
  [METHODS.getSafeBalances]: SafeBalances[];
}

export type RPCPayload<P = unknown[]> = {
  call: RpcCallNames;
  params: P;
};

// copy-pasting all the types below from safe-react makes me think we might want to export them to a package

export enum Operation {
  CALL,
  DELEGATE_CALL,
  CREATE,
}

// types comes from: https://github.com/gnosis/safe-client-gateway/blob/752e76b6d1d475791dbd7917b174bb41d2d9d8be/src/utils.rs
export enum TransferMethods {
  TRANSFER = 'transfer',
  TRANSFER_FROM = 'transferFrom',
  SAFE_TRANSFER_FROM = 'safeTransferFrom',
}

export enum SettingsChangeMethods {
  SETUP = 'setup',
  SET_FALLBACK_HANDLER = 'setFallbackHandler',
  ADD_OWNER_WITH_THRESHOLD = 'addOwnerWithThreshold',
  REMOVE_OWNER = 'removeOwner',
  REMOVE_OWNER_WITH_THRESHOLD = 'removeOwnerWithThreshold',
  SWAP_OWNER = 'swapOwner',
  CHANGE_THRESHOLD = 'changeThreshold',
  CHANGE_MASTER_COPY = 'changeMasterCopy',
  ENABLE_MODULE = 'enableModule',
  DISABLE_MODULE = 'disableModule',
  EXEC_TRANSACTION_FROM_MODULE = 'execTransactionFromModule',
  APPROVE_HASH = 'approveHash',
  EXEC_TRANSACTION = 'execTransaction',
}

// note: this extends SAFE_METHODS_NAMES in /logic/contracts/methodIds.ts, we need to figure out which one we are going to use
export type DataDecodedMethod = TransferMethods | SettingsChangeMethods | string;

export interface ValueDecoded {
  operation: Operation;
  to: string;
  value: number;
  data: string;
  dataDecoded: DataDecoded;
}

export interface SingleTransactionMethodParameter {
  name: string;
  type: string;
  value: string;
}

export interface MultiSendMethodParameter extends SingleTransactionMethodParameter {
  valueDecoded: ValueDecoded[];
}

export type Parameter = MultiSendMethodParameter | SingleTransactionMethodParameter;

export interface DataDecoded {
  method: DataDecodedMethod;
  parameters: Parameter[];
}

export type ConfirmationServiceModel = {
  confirmationType: string;
  owner: string;
  submissionDate: string;
  signature: string;
  signatureType: string;
  transactionHash: string;
};

export type TxServiceModel = {
  baseGas: number;
  blockNumber?: number | null;
  confirmations: ConfirmationServiceModel[];
  confirmationsRequired: number;
  creationTx?: boolean | null;
  data?: string | null;
  dataDecoded?: DataDecoded;
  ethGasPrice: string;
  executionDate?: string | null;
  executor: string;
  fee: string;
  gasPrice: string;
  gasToken: string;
  gasUsed: number;
  isExecuted: boolean;
  isSuccessful: boolean;
  modified: string;
  nonce?: number | null;
  operation: number;
  origin?: string | null;
  refundReceiver: string;
  safe: string;
  safeTxGas: number;
  safeTxHash: string;
  signatures: string;
  submissionDate?: string | null;
  to: string;
  transactionHash?: string | null;
  value: string;
};

export type TokenType = 'ERC721' | 'ERC20' | 'ETHER';

export type TokenProps = {
  address: string;
  name: string;
  symbol: string;
  decimals: number | string;
  logoUri: string;
  type?: TokenType;
};

export type TokenBalance = {
  tokenInfo: TokenProps;
  balance: string;
  fiatBalance: string;
  fiatConversion: string;
};

export type BalanceEndpoint = {
  fiatTotal: string;
  items: TokenBalance[];
};

export type SafeBalances = {
  fiatTotal: string;
  items: TokenBalance[];
};

export type RpcCallNames = keyof typeof RPC_CALLS;

export interface Communicator {
  send<M extends Methods, P = unknown, R = unknown>(method: M, params: P): Promise<Response<R>>;
}

export interface Log {
  address: string;
  data: string;
  topics: string[];
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
}

export interface BlockHeader {
  number: number;
  hash: string;
  parentHash: string;
  nonce: string;
  sha3Uncles: string;
  logsBloom: string;
  transactionRoot: string;
  stateRoot: string;
  receiptRoot: string;
  miner: string;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  timestamp: number | string;
}

export interface BlockTransactionBase extends BlockHeader {
  size: number;
  difficulty: number;
  totalDifficulty: number;
  uncles: string[];
}

export interface BlockTransactionObject extends BlockTransactionBase {
  transactions: Transaction[];
}

export interface BlockTransactionString extends BlockTransactionBase {
  transactions: string[];
}

export interface Web3TransactionObject {
  hash: string;
  nonce: number;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gas: number;
  input: string;
}

export interface Web3TransactionReceiptObject {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  from: string;
  to: string | null;
  cumulativeGasUsed: number;
  gasUsed: number;
  contractAddress: string;
  logs: Log[];
  logsBloom: string;
  status: number | undefined;
}

export type BlockNumberArg = number | 'earliest' | 'latest' | 'pending';

export interface TransactionConfig {
  from?: string | number;
  to?: string;
  value?: number | string;
  gas?: number | string;
  gasPrice?: number | string;
  data?: string;
  nonce?: number;
}

export interface PastLogsOptions {
  fromBlock?: BlockNumberArg;
  toBlock?: BlockNumberArg;
  address?: string;
  topics?: Array<string | string[] | null>;
}
