import { EventEmitter } from 'eventemitter3';
export interface MinimalEventSourceInterface {
    addEventListener(eventType: 'message', handler: (message: MessageEvent) => void): void;
}
export interface MinimalEventTargetInterface {
    postMessage(message: any, targetOrigin?: string): void;
}
/**
 * Options for constructing the iframe ethereum provider.
 */
export interface IFrameEthereumProviderOptions {
    targetOrigin?: string;
    timeoutMilliseconds?: number;
    eventSource?: MinimalEventSourceInterface;
    eventTarget?: MinimalEventTargetInterface;
}
declare type MessageId = number | string | null;
export declare type IFrameEthereumProviderEventTypes = 'connect' | 'close' | 'notification' | 'chainChanged' | 'networkChanged' | 'accountsChanged';
/**
 * Export the type information about the different events that are emitted.
 */
export interface IFrameEthereumProvider {
    on(event: 'connect', handler: () => void): this;
    on(event: 'close', handler: (code: number, reason: string) => void): this;
    on(event: 'notification', handler: (result: any) => void): this;
    on(event: 'chainChanged', handler: (chainId: string) => void): this;
    on(event: 'networkChanged', handler: (networkId: string) => void): this;
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): this;
}
/**
 * Represents an error in an RPC returned from the event source. Always contains a code and a reason. The message
 * is constructed from both.
 */
export declare class RpcError extends Error {
    readonly isRpcError: true;
    readonly code: number;
    readonly reason: string;
    constructor(code: number, reason: string);
}
/**
 * This is the primary artifact of this library.
 */
export declare class IFrameEthereumProvider extends EventEmitter<IFrameEthereumProviderEventTypes> {
    /**
     * Differentiate this provider from other providers by providing an isIFrame property that always returns true.
     */
    get isIFrame(): true;
    /**
     * Always return this for currentProvider.
     */
    get currentProvider(): IFrameEthereumProvider;
    private enabled;
    private readonly targetOrigin;
    private readonly timeoutMilliseconds;
    private readonly eventSource;
    private readonly eventTarget;
    private readonly completers;
    constructor({ targetOrigin, timeoutMilliseconds, eventSource, eventTarget, }?: IFrameEthereumProviderOptions);
    /**
     * Helper method that handles transport and request wrapping
     * @param method method to execute
     * @param params params to pass the method
     * @param requestId jsonrpc request id
     */
    private execute;
    /**
     * EIP-1193 request interface to send request.
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
     * @param args request arguments
     * @param args.method method to send to the parent provider
     * @param args.params parameters to send
     */
    request<TParams = any[], TResult = any>({ method, params, }: {
        method: string;
        params?: TParams;
    }): Promise<TResult>;
    /**
     * Depreciated. Backwards compatibility method for web3.
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#appendix-iii-legacy-provider-api
     * Send the JSON RPC and return the result.
     * @param method method to send to the parent provider
     * @param params parameters to send
     */
    send<TParams = any[], TResult = any>(method: string, params?: TParams): Promise<TResult>;
    /**
     * Request the parent window to enable access to the user's web3 provider. Return accounts list immediately if already enabled.
     */
    enable(): Promise<string[]>;
    /**
     * Depreciated. Backwards compatibility method for web3.
     * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#appendix-iii-legacy-provider-api
     * @param payload payload to send to the provider
     * @param callback callback to be called when the provider resolves
     */
    sendAsync(payload: {
        method: string;
        params?: any[];
        id?: MessageId;
    }, callback: (error: string | null, result: {
        method: string;
        params?: any[];
        result: any;
    } | any) => void): Promise<void>;
    /**
     * Handle a message on the event source.
     * @param event message event that will be processed by the provider
     */
    private handleEventSourceMessage;
    private emitNotification;
    private emitConnect;
    private emitClose;
    private emitChainChanged;
    private emitNetworkChanged;
    private emitAccountsChanged;
}
export {};
