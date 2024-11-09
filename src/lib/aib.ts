export const aib = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "issuer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "string",
        name: "userId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "documentType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "DocumentIssued",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userId",
        type: "string",
      },
      {
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "documentName",
        type: "string",
      },
      {
        internalType: "string",
        name: "documentType",
        type: "string",
      },
    ],
    name: "issueDocument",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userId",
        type: "string",
      },
    ],
    name: "getUserDocuments",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "documentHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "documentName",
            type: "string",
          },
          {
            internalType: "string",
            name: "documentType",
            type: "string",
          },
          {
            internalType: "address",
            name: "issuer",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct DocumentVerification.Document[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "userId",
        type: "string",
      },
      {
        internalType: "string",
        name: "documentHash",
        type: "string",
      },
    ],
    name: "verifyDocument",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
