import {Settings} from "./routes/home/SettingsForm.tsx";
import {
    FunctionDef,
    Instruction,
    SubstateType,
    Arg,
} from "@tari-project/wallet_jrpc_client";

import { TariProvider, MetamaskTariProvider, WalletDaemonTariProvider, TransactionStatus, SubmitTransactionRequest, WalletConnectTariProvider } from "@tari-project/tarijs";

export async function getTemplateDefinition<T extends TariProvider>(
    provider: T,
    template_address: string
) {
    const resp = await provider.getTemplateDefinition(template_address);
    return resp.template_definition;
}

export async function listSubstates<T extends TariProvider>(
    provider: T | null,
    template: string | null,
    substateType: SubstateType | null
) {
    if (provider === null) {
        throw new Error('Provider is not initialized');
    }
    const substates = await provider.listSubstates(
        template,
        substateType,
        null,
        null
    );
    return substates;
}

export async function createFreeTestCoins<T extends TariProvider>(provider: T) {
    console.log("createFreeTestCoins", provider.providerName);
    switch (provider.providerName) {
        case "WalletDaemon":
            const walletProvider = provider as unknown as WalletDaemonTariProvider;
            await walletProvider.createFreeTestCoins();
            break;
        case "WalletConnect":
            const wcProvider = provider as unknown as WalletConnectTariProvider;
            await wcProvider.createFreeTestCoins();
            break;
        case "Metamask":
            const metamaskProvider = provider as unknown as MetamaskTariProvider;
            await metamaskProvider.createFreeTestCoins(0);
            break;
        default:
            throw new Error(`Unsupported provider: ${provider.providerName}`);
    }
}

export async function getSubstate<T extends TariProvider>(provider: T, substateId: string) {
    const resp = await provider.getSubstate(substateId);
    return resp;
}

export async function buildInstructionsAndSubmit(
    provider: TariProvider,
    settings: Settings,
    selectedBadge: string | null,
    selectedComponent: string | null,
    func: FunctionDef,
    args: object
) {
    const req = await createTransactionRequest(
        provider,
        settings,
        selectedBadge,
        selectedComponent,
        func,
        args
    );

    const resp = await provider.submitTransaction(req);

    let result = await waitForTransactionResult(provider, resp.transaction_id);

    return result;
}

async function waitForTransactionResult(provider: TariProvider, transactionId: string) {
    while (true) {
        const resp = await provider.getTransactionResult(transactionId);
        const FINALIZED_STATUSES = [
            TransactionStatus.Accepted,
            TransactionStatus.Rejected,
            TransactionStatus.InvalidTransaction,
            TransactionStatus.OnlyFeeAccepted,
            TransactionStatus.DryRun
        ];

        if (resp.status == TransactionStatus.Rejected) {
            throw new Error(`Transaction rejected: ${JSON.stringify(resp.result)}`);
        }

        if (FINALIZED_STATUSES.includes(resp.status)) {
            return resp;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

export async function createTransactionRequest(
    provider: TariProvider,
    settings: Settings,
    selectedBadge: string | null,
    selectedComponent: string | null,
    func: FunctionDef,
    formValues: object
): Promise<SubmitTransactionRequest> {
    const fee = 2000;
    const account = await provider.getAccount();

    const fee_instructions = [
        {
            CallMethod: {
                component_address: account.address,
                method: "pay_fee",
                args: [`Amount(${fee})`]
            }
        }
    ];

    const args = Object.values(formValues) as Arg[];
    const isMethod =
        func.arguments.length > 0 && func.arguments[0].name === "self";

    if (!isMethod && !settings.template) {
        throw new Error("Template not set");
    }

    if (isMethod && !selectedComponent) {
        throw new Error("This call requires a component to be selected");
    }

    let bucketId = 0;

    const proofInstructions =
        isMethod && selectedBadge
            ? [
                {
                    CallMethod: {
                        component_address: account.address,
                        method: "create_proof_for_resource",
                        args: [selectedBadge]
                    }
                },
                {
                    PutLastInstructionOutputOnWorkspace: {key: [bucketId++]}
                }
            ] : [];

    const callInstruction = isMethod
        ? {
            CallMethod: {
                component_address: selectedComponent,
                method: func.name,
                args: args
            }
        }
        : {
            CallFunction: {
                template_address: settings.template,
                function: func.name,
                args: args
            }
        };

    func.output

    let nextInstructions: Instruction[] = [];
    if (typeof func.output === 'object' && "Other" in func.output && func.output.Other.name === "Bucket") {
        nextInstructions = [
            {
                PutLastInstructionOutputOnWorkspace: {key: [bucketId]}
            },
            {
                CallMethod: {
                    component_address: account.address,
                    method: "deposit",
                    args: [`Workspace(${bucketId})`],
                }
            }
        ];
    }

    const instructions = [
        ...proofInstructions,
        callInstruction,
        ...nextInstructions,
        "DropAllProofsInWorkspace" as Instruction
    ];

    const required_substates = [
        {substate_id: account.address, version: null}
    ]

    if (selectedComponent) {
        required_substates.push({substate_id: selectedComponent, version: null});
    }

    return {
        account_id: account.account_id,
        fee_instructions,
        instructions: instructions as object[],
        inputs: [],
        input_refs: [],
        required_substates,
        is_dry_run: false,
        min_epoch: null,
        max_epoch: null
    };
}
