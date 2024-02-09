export default {
  V1: {
    template_name: "TariStableCoin",
    tari_version: "0.3.0",
    functions: [
      {
        name: "instantiate",
        arguments: [
          {
            name: "initial_token_supply",
            arg_type: {
              Other: {
                name: "Amount"
              }
            }
          },
          {
            name: "token_symbol",
            arg_type: "String"
          },
          {
            name: "token_metadata",
            arg_type: {
              Other: {
                name: "Metadata"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Bucket"
          }
        },
        is_mut: false
      },
      {
        name: "increase_supply",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "amount",
            arg_type: {
              Other: {
                name: "Amount"
              }
            }
          }
        ],
        output: "Unit",
        is_mut: true
      },
      {
        name: "decrease_supply",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "amount",
            arg_type: {
              Other: {
                name: "Amount"
              }
            }
          }
        ],
        output: "Unit",
        is_mut: true
      },
      {
        name: "total_supply",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&self"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Amount"
          }
        },
        is_mut: false
      },
      {
        name: "withdraw",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "amount",
            arg_type: {
              Other: {
                name: "Amount"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Bucket"
          }
        },
        is_mut: true
      },
      {
        name: "deposit",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "bucket",
            arg_type: {
              Other: {
                name: "Bucket"
              }
            }
          }
        ],
        output: "Unit",
        is_mut: true
      },
      {
        name: "create_new_admin",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Bucket"
          }
        },
        is_mut: true
      },
      {
        name: "create_new_user",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "user_id",
            arg_type: {
              Other: {
                name: "UserId"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Bucket"
          }
        },
        is_mut: true
      },
      {
        name: "blacklist_user",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "vault_id",
            arg_type: {
              Other: {
                name: "VaultId"
              }
            }
          },
          {
            name: "user_id",
            arg_type: {
              Other: {
                name: "UserId"
              }
            }
          }
        ],
        output: "Unit",
        is_mut: true
      },
      {
        name: "remove_from_blacklist",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "user_id",
            arg_type: {
              Other: {
                name: "UserId"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "Bucket"
          }
        },
        is_mut: true
      },
      {
        name: "get_user_data",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&self"
              }
            }
          },
          {
            name: "user_id",
            arg_type: {
              Other: {
                name: "UserId"
              }
            }
          }
        ],
        output: {
          Other: {
            name: "UserData"
          }
        },
        is_mut: false
      },
      {
        name: "set_user_data",
        arguments: [
          {
            name: "self",
            arg_type: {
              Other: {
                name: "&mut self"
              }
            }
          },
          {
            name: "user_id",
            arg_type: {
              Other: {
                name: "UserId"
              }
            }
          },
          {
            name: "data",
            arg_type: {
              Other: {
                name: "UserMutableData"
              }
            }
          }
        ],
        output: "Unit",
        is_mut: true
      }
    ]
  }
};

export interface FunctionDef {
  name: string;
  arguments: [ArgDef];
  output: Type;
  is_mut: boolean;
}

export interface ArgDef {
  name: string;
  type: Type;
}

export type Type =
  | "Unit"
  | "Bool"
  | "I8"
  | "I16"
  | "I32"
  | "I64"
  | "I128"
  | "U8"
  | "U16"
  | "U32"
  | "U64"
  | "U128"
  | "String"
  | { Vec: { type: Type } }
  | { Tuple: { types: [Type] } }
  | { Other: { name: string } };