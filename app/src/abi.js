export const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_userId",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_description",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Dept",
				"name": "_dept",
				"type": "uint8"
			},
			{
				"internalType": "string",
				"name": "_hospitalName",
				"type": "string"
			},
			{
				"internalType": "string[]",
				"name": "_medicines",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "_documents",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "_allergies",
				"type": "string[]"
			}
		],
		"name": "createPrescription",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_prescriptionId",
				"type": "uint256"
			}
		],
		"name": "fulfillPrescription",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "prescriptionId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum Pec.Dept",
				"name": "dept",
				"type": "uint8"
			}
		],
		"name": "PrescriptionCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "prescriptionId",
				"type": "uint256"
			}
		],
		"name": "PrescriptionFulfilled",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_hospital",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_verificationHash",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Dept",
				"name": "_dept",
				"type": "uint8"
			}
		],
		"name": "registerDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_verificationHash",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerFields",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_verificationHash",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerReceptionist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "doctors",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hospital",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "verificationHash",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Dept",
				"name": "dept",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			}
		],
		"name": "getDoctorDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "hospital",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "doctorAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "verificationHash",
						"type": "string"
					},
					{
						"internalType": "enum Pec.Dept",
						"name": "dept",
						"type": "uint8"
					}
				],
				"internalType": "struct Pec.Doctor",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_prescriptionId",
				"type": "uint256"
			}
		],
		"name": "getPrescription",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "prescriptionId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "hospital",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "userId",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "description",
						"type": "string"
					},
					{
						"internalType": "enum Pec.Dept",
						"name": "dept",
						"type": "uint8"
					},
					{
						"internalType": "string[]",
						"name": "medicines",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "documents",
						"type": "string[]"
					},
					{
						"internalType": "string[]",
						"name": "allergies",
						"type": "string[]"
					},
					{
						"internalType": "bool",
						"name": "isFulfilled",
						"type": "bool"
					}
				],
				"internalType": "struct Pec.Prescription",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_userAddress",
				"type": "address"
			}
		],
		"name": "getUserDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "verificationHash",
						"type": "string"
					},
					{
						"internalType": "enum Pec.Role",
						"name": "role",
						"type": "uint8"
					}
				],
				"internalType": "struct Pec.User",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "prescriptionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "prescriptions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "prescriptionId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "hospital",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "userId",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Dept",
				"name": "dept",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isFulfilled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "verificationHash",
				"type": "string"
			},
			{
				"internalType": "enum Pec.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]