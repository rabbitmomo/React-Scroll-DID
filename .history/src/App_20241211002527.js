import React, { useState } from 'react';
import Web3 from 'web3';

const App = () => {
  const [hashedPassword, setHashedPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userData, setUserData] = useState({
    hashedPassword: '',
    salt: '',
    rsaPublicKey: '',
  });
  const [status, setStatus] = useState('');

  // Contract details (replace with your contract ABI and address)
  const contractABI = [{
    "contractName": "UserAuth",
    "abi": [
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
            "name": "hashedPassword",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "salt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "publicKey",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_hashedPassword",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_salt",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_publicKey",
            "type": "string"
          }
        ],
        "name": "registerUser",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getUser",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    "metadata": "{\"compiler\":{\"version\":\"0.8.21+commit.d9974bed\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"inputs\":[],\"name\":\"getUser\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"_hashedPassword\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_salt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"_publicKey\",\"type\":\"string\"}],\"name\":\"registerUser\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"name\":\"users\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"hashedPassword\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"salt\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"publicKey\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"}],\"devdoc\":{\"kind\":\"dev\",\"methods\":{},\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"project:/contracts/UserAuth.sol\":\"UserAuth\"},\"evmVersion\":\"shanghai\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":false,\"runs\":200},\"remappings\":[]},\"sources\":{\"project:/contracts/UserAuth.sol\":{\"keccak256\":\"0xc576a91cbd37e2b1f17a14cac220e1b04caaac5e52a7e806d38436a955f57f4a\",\"license\":\"MIT\",\"urls\":[\"bzz-raw://931830d0d6cdf5e099056351c32c650b2faf6b11b67348f8f684c5288ab3bfbd\",\"dweb:/ipfs/QmYXGfcmHSHXKRYNXaYzmcjYJYFGZGZ9id4rxxcHpumjGt\"]}},\"version\":1}",
    "bytecode": "0x608060405234801561000f575f80fd5b50610b618061001d5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c8063832880e714610043578063a87430ba14610063578063d637dcfa14610095575b5f80fd5b61004b6100b1565b60405161005a939291906105a9565b60405180910390f35b61007d6004803603810190610078919061065e565b6102c9565b60405161008c939291906105a9565b60405180910390f35b6100af60048036038101906100aa91906107b5565b610480565b005b60608060605f805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206040518060600160405290815f8201805461010d90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461013990610886565b80156101845780601f1061015b57610100808354040283529160200191610184565b820191905f5260205f20905b81548152906001019060200180831161016757829003601f168201915b5050505050815260200160018201805461019d90610886565b80601f01602080910402602001604051908101604052809291908181526020018280546101c990610886565b80156102145780601f106101eb57610100808354040283529160200191610214565b820191905f5260205f20905b8154815290600101906020018083116101f757829003601f168201915b5050505050815260200160028201805461022d90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461025990610886565b80156102a45780601f1061027b576101008083540402835291602001916102a4565b820191905f5260205f20905b81548152906001019060200180831161028757829003601f168201915b5050505050815250509050805f01518160200151826040015193509350935050909192565b5f602052805f5260405f205f91509050805f0180546102e790610886565b80601f016020809104026020016040519081016040528092919081815260200182805461031390610886565b801561035e5780601f106103355761010080835404028352916020019161035e565b820191905f5260205f20905b81548152906001019060200180831161034157829003601f168201915b50505050509080600101805461037390610886565b80601f016020809104026020016040519081016040528092919081815260200182805461039f90610886565b80156103ea5780601f106103c1576101008083540402835291602001916103ea565b820191905f5260205f20905b8154815290600101906020018083116103cd57829003601f168201915b5050505050908060020180546103ff90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461042b90610886565b80156104765780601f1061044d57610100808354040283529160200191610476565b820191905f5260205f20905b81548152906001019060200180831161045957829003601f168201915b5050505050905083565b6040518060600160405280848152602001838152602001828152505f803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f0190816104ea9190610a5c565b5060208201518160010190816105009190610a5c565b5060408201518160020190816105169190610a5c565b50905050505050565b5f81519050919050565b5f82825260208201905092915050565b5f5b8381101561055657808201518184015260208101905061053b565b5f8484015250505050565b5f601f19601f8301169050919050565b5f61057b8261051f565b6105858185610529565b9350610595818560208601610539565b61059e81610561565b840191505092915050565b5f6060820190508181035f8301526105c18186610571565b905081810360208301526105d58185610571565b905081810360408301526105e98184610571565b9050949350505050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61062d82610604565b9050919050565b61063d81610623565b8114610647575f80fd5b50565b5f8135905061065881610634565b92915050565b5f60208284031215610673576106726105fc565b5b5f6106808482850161064a565b91505092915050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6106c782610561565b810181811067ffffffffffffffff821117156106e6576106e5610691565b5b80604052505050565b5f6106f86105f3565b905061070482826106be565b919050565b5f67ffffffffffffffff82111561072357610722610691565b5b61072c82610561565b9050602081019050919050565b828183375f83830152505050565b5f61075961075484610709565b6106ef565b9050828152602081018484840111156107755761077461068d565b5b610780848285610739565b509392505050565b5f82601f83011261079c5761079b610689565b5b81356107ac848260208601610747565b91505092915050565b5f805f606084860312156107cc576107cb6105fc565b5b5f84013567ffffffffffffffff8111156107e9576107e8610600565b5b6107f586828701610788565b935050602084013567ffffffffffffffff81111561081657610815610600565b5b61082286828701610788565b925050604084013567ffffffffffffffff81111561084357610842610600565b5b61084f86828701610788565b9150509250925092565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061089d57607f821691505b6020821081036108b0576108af610859565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026109127fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826108d7565b61091c86836108d7565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61096061095b61095684610934565b61093d565b610934565b9050919050565b5f819050919050565b61097983610946565b61098d61098582610967565b8484546108e3565b825550505050565b5f90565b6109a1610995565b6109ac818484610970565b505050565b5b818110156109cf576109c45f82610999565b6001810190506109b2565b5050565b601f821115610a14576109e5816108b6565b6109ee846108c8565b810160208510156109fd578190505b610a11610a09856108c8565b8301826109b1565b50505b505050565b5f82821c905092915050565b5f610a345f1984600802610a19565b1980831691505092915050565b5f610a4c8383610a25565b9150826002028217905092915050565b610a658261051f565b67ffffffffffffffff811115610a7e57610a7d610691565b5b610a888254610886565b610a938282856109d3565b5f60209050601f831160018114610ac4575f8415610ab2578287015190505b610abc8582610a41565b865550610b23565b601f198416610ad2866108b6565b5f5b82811015610af957848901518255600182019150602085019450602081019050610ad4565b86831015610b165784890151610b12601f891682610a25565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220dd612f1a49d38da1f745757356afcae90345cdfe8f5896e41d8b1c7c0c2a9ac364736f6c63430008150033",
    "deployedBytecode": "0x608060405234801561000f575f80fd5b506004361061003f575f3560e01c8063832880e714610043578063a87430ba14610063578063d637dcfa14610095575b5f80fd5b61004b6100b1565b60405161005a939291906105a9565b60405180910390f35b61007d6004803603810190610078919061065e565b6102c9565b60405161008c939291906105a9565b60405180910390f35b6100af60048036038101906100aa91906107b5565b610480565b005b60608060605f805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206040518060600160405290815f8201805461010d90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461013990610886565b80156101845780601f1061015b57610100808354040283529160200191610184565b820191905f5260205f20905b81548152906001019060200180831161016757829003601f168201915b5050505050815260200160018201805461019d90610886565b80601f01602080910402602001604051908101604052809291908181526020018280546101c990610886565b80156102145780601f106101eb57610100808354040283529160200191610214565b820191905f5260205f20905b8154815290600101906020018083116101f757829003601f168201915b5050505050815260200160028201805461022d90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461025990610886565b80156102a45780601f1061027b576101008083540402835291602001916102a4565b820191905f5260205f20905b81548152906001019060200180831161028757829003601f168201915b5050505050815250509050805f01518160200151826040015193509350935050909192565b5f602052805f5260405f205f91509050805f0180546102e790610886565b80601f016020809104026020016040519081016040528092919081815260200182805461031390610886565b801561035e5780601f106103355761010080835404028352916020019161035e565b820191905f5260205f20905b81548152906001019060200180831161034157829003601f168201915b50505050509080600101805461037390610886565b80601f016020809104026020016040519081016040528092919081815260200182805461039f90610886565b80156103ea5780601f106103c1576101008083540402835291602001916103ea565b820191905f5260205f20905b8154815290600101906020018083116103cd57829003601f168201915b5050505050908060020180546103ff90610886565b80601f016020809104026020016040519081016040528092919081815260200182805461042b90610886565b80156104765780601f1061044d57610100808354040283529160200191610476565b820191905f5260205f20905b81548152906001019060200180831161045957829003601f168201915b5050505050905083565b6040518060600160405280848152602001838152602001828152505f803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f0190816104ea9190610a5c565b5060208201518160010190816105009190610a5c565b5060408201518160020190816105169190610a5c565b50905050505050565b5f81519050919050565b5f82825260208201905092915050565b5f5b8381101561055657808201518184015260208101905061053b565b5f8484015250505050565b5f601f19601f8301169050919050565b5f61057b8261051f565b6105858185610529565b9350610595818560208601610539565b61059e81610561565b840191505092915050565b5f6060820190508181035f8301526105c18186610571565b905081810360208301526105d58185610571565b905081810360408301526105e98184610571565b9050949350505050565b5f604051905090565b5f80fd5b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61062d82610604565b9050919050565b61063d81610623565b8114610647575f80fd5b50565b5f8135905061065881610634565b92915050565b5f60208284031215610673576106726105fc565b5b5f6106808482850161064a565b91505092915050565b5f80fd5b5f80fd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6106c782610561565b810181811067ffffffffffffffff821117156106e6576106e5610691565b5b80604052505050565b5f6106f86105f3565b905061070482826106be565b919050565b5f67ffffffffffffffff82111561072357610722610691565b5b61072c82610561565b9050602081019050919050565b828183375f83830152505050565b5f61075961075484610709565b6106ef565b9050828152602081018484840111156107755761077461068d565b5b610780848285610739565b509392505050565b5f82601f83011261079c5761079b610689565b5b81356107ac848260208601610747565b91505092915050565b5f805f606084860312156107cc576107cb6105fc565b5b5f84013567ffffffffffffffff8111156107e9576107e8610600565b5b6107f586828701610788565b935050602084013567ffffffffffffffff81111561081657610815610600565b5b61082286828701610788565b925050604084013567ffffffffffffffff81111561084357610842610600565b5b61084f86828701610788565b9150509250925092565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061089d57607f821691505b6020821081036108b0576108af610859565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026109127fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826108d7565b61091c86836108d7565b95508019841693508086168417925050509392505050565b5f819050919050565b5f819050919050565b5f61096061095b61095684610934565b61093d565b610934565b9050919050565b5f819050919050565b61097983610946565b61098d61098582610967565b8484546108e3565b825550505050565b5f90565b6109a1610995565b6109ac818484610970565b505050565b5b818110156109cf576109c45f82610999565b6001810190506109b2565b5050565b601f821115610a14576109e5816108b6565b6109ee846108c8565b810160208510156109fd578190505b610a11610a09856108c8565b8301826109b1565b50505b505050565b5f82821c905092915050565b5f610a345f1984600802610a19565b1980831691505092915050565b5f610a4c8383610a25565b9150826002028217905092915050565b610a658261051f565b67ffffffffffffffff811115610a7e57610a7d610691565b5b610a888254610886565b610a938282856109d3565b5f60209050601f831160018114610ac4575f8415610ab2578287015190505b610abc8582610a41565b865550610b23565b601f198416610ad2866108b6565b5f5b82811015610af957848901518255600182019150602085019450602081019050610ad4565b86831015610b165784890151610b12601f891682610a25565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220dd612f1a49d38da1f745757356afcae90345cdfe8f5896e41d8b1c7c0c2a9ac364736f6c63430008150033",
    "immutableReferences": {},
    "generatedSources": [],
    "deployedGeneratedSources": [
      {
        "ast": {
          "nativeSrc": "0:11129:1",
          "nodeType": "YulBlock",
          "src": "0:11129:1",
          "statements": [
            {
              "body": {
                "nativeSrc": "66:40:1",
                "nodeType": "YulBlock",
                "src": "66:40:1",
                "statements": [
                  {
                    "nativeSrc": "77:22:1",
                    "nodeType": "YulAssignment",
                    "src": "77:22:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "93:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "93:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "mload",
                        "nativeSrc": "87:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "87:5:1"
                      },
                      "nativeSrc": "87:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "87:12:1"
                    },
                    "variableNames": [
                      {
                        "name": "length",
                        "nativeSrc": "77:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "77:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "array_length_t_string_memory_ptr",
              "nativeSrc": "7:99:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "49:5:1",
                  "nodeType": "YulTypedName",
                  "src": "49:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "length",
                  "nativeSrc": "59:6:1",
                  "nodeType": "YulTypedName",
                  "src": "59:6:1",
                  "type": ""
                }
              ],
              "src": "7:99:1"
            },
            {
              "body": {
                "nativeSrc": "208:73:1",
                "nodeType": "YulBlock",
                "src": "208:73:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "pos",
                          "nativeSrc": "225:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "225:3:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "230:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "230:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "218:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "218:6:1"
                      },
                      "nativeSrc": "218:19:1",
                      "nodeType": "YulFunctionCall",
                      "src": "218:19:1"
                    },
                    "nativeSrc": "218:19:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "218:19:1"
                  },
                  {
                    "nativeSrc": "246:29:1",
                    "nodeType": "YulAssignment",
                    "src": "246:29:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "pos",
                          "nativeSrc": "265:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "265:3:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "270:4:1",
                          "nodeType": "YulLiteral",
                          "src": "270:4:1",
                          "type": "",
                          "value": "0x20"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "261:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "261:3:1"
                      },
                      "nativeSrc": "261:14:1",
                      "nodeType": "YulFunctionCall",
                      "src": "261:14:1"
                    },
                    "variableNames": [
                      {
                        "name": "updated_pos",
                        "nativeSrc": "246:11:1",
                        "nodeType": "YulIdentifier",
                        "src": "246:11:1"
                      }
                    ]
                  }
                ]
              },
              "name": "array_storeLengthForEncoding_t_string_memory_ptr_fromStack",
              "nativeSrc": "112:169:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "pos",
                  "nativeSrc": "180:3:1",
                  "nodeType": "YulTypedName",
                  "src": "180:3:1",
                  "type": ""
                },
                {
                  "name": "length",
                  "nativeSrc": "185:6:1",
                  "nodeType": "YulTypedName",
                  "src": "185:6:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "updated_pos",
                  "nativeSrc": "196:11:1",
                  "nodeType": "YulTypedName",
                  "src": "196:11:1",
                  "type": ""
                }
              ],
              "src": "112:169:1"
            },
            {
              "body": {
                "nativeSrc": "349:184:1",
                "nodeType": "YulBlock",
                "src": "349:184:1",
                "statements": [
                  {
                    "nativeSrc": "359:10:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "359:10:1",
                    "value": {
                      "kind": "number",
                      "nativeSrc": "368:1:1",
                      "nodeType": "YulLiteral",
                      "src": "368:1:1",
                      "type": "",
                      "value": "0"
                    },
                    "variables": [
                      {
                        "name": "i",
                        "nativeSrc": "363:1:1",
                        "nodeType": "YulTypedName",
                        "src": "363:1:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "body": {
                      "nativeSrc": "428:63:1",
                      "nodeType": "YulBlock",
                      "src": "428:63:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "arguments": [
                                  {
                                    "name": "dst",
                                    "nativeSrc": "453:3:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "453:3:1"
                                  },
                                  {
                                    "name": "i",
                                    "nativeSrc": "458:1:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "458:1:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "add",
                                  "nativeSrc": "449:3:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "449:3:1"
                                },
                                "nativeSrc": "449:11:1",
                                "nodeType": "YulFunctionCall",
                                "src": "449:11:1"
                              },
                              {
                                "arguments": [
                                  {
                                    "arguments": [
                                      {
                                        "name": "src",
                                        "nativeSrc": "472:3:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "472:3:1"
                                      },
                                      {
                                        "name": "i",
                                        "nativeSrc": "477:1:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "477:1:1"
                                      }
                                    ],
                                    "functionName": {
                                      "name": "add",
                                      "nativeSrc": "468:3:1",
                                      "nodeType": "YulIdentifier",
                                      "src": "468:3:1"
                                    },
                                    "nativeSrc": "468:11:1",
                                    "nodeType": "YulFunctionCall",
                                    "src": "468:11:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "mload",
                                  "nativeSrc": "462:5:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "462:5:1"
                                },
                                "nativeSrc": "462:18:1",
                                "nodeType": "YulFunctionCall",
                                "src": "462:18:1"
                              }
                            ],
                            "functionName": {
                              "name": "mstore",
                              "nativeSrc": "442:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "442:6:1"
                            },
                            "nativeSrc": "442:39:1",
                            "nodeType": "YulFunctionCall",
                            "src": "442:39:1"
                          },
                          "nativeSrc": "442:39:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "442:39:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "i",
                          "nativeSrc": "389:1:1",
                          "nodeType": "YulIdentifier",
                          "src": "389:1:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "392:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "392:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "lt",
                        "nativeSrc": "386:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "386:2:1"
                      },
                      "nativeSrc": "386:13:1",
                      "nodeType": "YulFunctionCall",
                      "src": "386:13:1"
                    },
                    "nativeSrc": "378:113:1",
                    "nodeType": "YulForLoop",
                    "post": {
                      "nativeSrc": "400:19:1",
                      "nodeType": "YulBlock",
                      "src": "400:19:1",
                      "statements": [
                        {
                          "nativeSrc": "402:15:1",
                          "nodeType": "YulAssignment",
                          "src": "402:15:1",
                          "value": {
                            "arguments": [
                              {
                                "name": "i",
                                "nativeSrc": "411:1:1",
                                "nodeType": "YulIdentifier",
                                "src": "411:1:1"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "414:2:1",
                                "nodeType": "YulLiteral",
                                "src": "414:2:1",
                                "type": "",
                                "value": "32"
                              }
                            ],
                            "functionName": {
                              "name": "add",
                              "nativeSrc": "407:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "407:3:1"
                            },
                            "nativeSrc": "407:10:1",
                            "nodeType": "YulFunctionCall",
                            "src": "407:10:1"
                          },
                          "variableNames": [
                            {
                              "name": "i",
                              "nativeSrc": "402:1:1",
                              "nodeType": "YulIdentifier",
                              "src": "402:1:1"
                            }
                          ]
                        }
                      ]
                    },
                    "pre": {
                      "nativeSrc": "382:3:1",
                      "nodeType": "YulBlock",
                      "src": "382:3:1",
                      "statements": []
                    },
                    "src": "378:113:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "dst",
                              "nativeSrc": "511:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "511:3:1"
                            },
                            {
                              "name": "length",
                              "nativeSrc": "516:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "516:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "507:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "507:3:1"
                          },
                          "nativeSrc": "507:16:1",
                          "nodeType": "YulFunctionCall",
                          "src": "507:16:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "525:1:1",
                          "nodeType": "YulLiteral",
                          "src": "525:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "500:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "500:6:1"
                      },
                      "nativeSrc": "500:27:1",
                      "nodeType": "YulFunctionCall",
                      "src": "500:27:1"
                    },
                    "nativeSrc": "500:27:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "500:27:1"
                  }
                ]
              },
              "name": "copy_memory_to_memory_with_cleanup",
              "nativeSrc": "287:246:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "src",
                  "nativeSrc": "331:3:1",
                  "nodeType": "YulTypedName",
                  "src": "331:3:1",
                  "type": ""
                },
                {
                  "name": "dst",
                  "nativeSrc": "336:3:1",
                  "nodeType": "YulTypedName",
                  "src": "336:3:1",
                  "type": ""
                },
                {
                  "name": "length",
                  "nativeSrc": "341:6:1",
                  "nodeType": "YulTypedName",
                  "src": "341:6:1",
                  "type": ""
                }
              ],
              "src": "287:246:1"
            },
            {
              "body": {
                "nativeSrc": "587:54:1",
                "nodeType": "YulBlock",
                "src": "587:54:1",
                "statements": [
                  {
                    "nativeSrc": "597:38:1",
                    "nodeType": "YulAssignment",
                    "src": "597:38:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nativeSrc": "615:5:1",
                              "nodeType": "YulIdentifier",
                              "src": "615:5:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "622:2:1",
                              "nodeType": "YulLiteral",
                              "src": "622:2:1",
                              "type": "",
                              "value": "31"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "611:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "611:3:1"
                          },
                          "nativeSrc": "611:14:1",
                          "nodeType": "YulFunctionCall",
                          "src": "611:14:1"
                        },
                        {
                          "arguments": [
                            {
                              "kind": "number",
                              "nativeSrc": "631:2:1",
                              "nodeType": "YulLiteral",
                              "src": "631:2:1",
                              "type": "",
                              "value": "31"
                            }
                          ],
                          "functionName": {
                            "name": "not",
                            "nativeSrc": "627:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "627:3:1"
                          },
                          "nativeSrc": "627:7:1",
                          "nodeType": "YulFunctionCall",
                          "src": "627:7:1"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nativeSrc": "607:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "607:3:1"
                      },
                      "nativeSrc": "607:28:1",
                      "nodeType": "YulFunctionCall",
                      "src": "607:28:1"
                    },
                    "variableNames": [
                      {
                        "name": "result",
                        "nativeSrc": "597:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "597:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "round_up_to_mul_of_32",
              "nativeSrc": "539:102:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "570:5:1",
                  "nodeType": "YulTypedName",
                  "src": "570:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "result",
                  "nativeSrc": "580:6:1",
                  "nodeType": "YulTypedName",
                  "src": "580:6:1",
                  "type": ""
                }
              ],
              "src": "539:102:1"
            },
            {
              "body": {
                "nativeSrc": "739:285:1",
                "nodeType": "YulBlock",
                "src": "739:285:1",
                "statements": [
                  {
                    "nativeSrc": "749:53:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "749:53:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "796:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "796:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "array_length_t_string_memory_ptr",
                        "nativeSrc": "763:32:1",
                        "nodeType": "YulIdentifier",
                        "src": "763:32:1"
                      },
                      "nativeSrc": "763:39:1",
                      "nodeType": "YulFunctionCall",
                      "src": "763:39:1"
                    },
                    "variables": [
                      {
                        "name": "length",
                        "nativeSrc": "753:6:1",
                        "nodeType": "YulTypedName",
                        "src": "753:6:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "811:78:1",
                    "nodeType": "YulAssignment",
                    "src": "811:78:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "pos",
                          "nativeSrc": "877:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "877:3:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "882:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "882:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "array_storeLengthForEncoding_t_string_memory_ptr_fromStack",
                        "nativeSrc": "818:58:1",
                        "nodeType": "YulIdentifier",
                        "src": "818:58:1"
                      },
                      "nativeSrc": "818:71:1",
                      "nodeType": "YulFunctionCall",
                      "src": "818:71:1"
                    },
                    "variableNames": [
                      {
                        "name": "pos",
                        "nativeSrc": "811:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "811:3:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nativeSrc": "937:5:1",
                              "nodeType": "YulIdentifier",
                              "src": "937:5:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "944:4:1",
                              "nodeType": "YulLiteral",
                              "src": "944:4:1",
                              "type": "",
                              "value": "0x20"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "933:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "933:3:1"
                          },
                          "nativeSrc": "933:16:1",
                          "nodeType": "YulFunctionCall",
                          "src": "933:16:1"
                        },
                        {
                          "name": "pos",
                          "nativeSrc": "951:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "951:3:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "956:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "956:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "copy_memory_to_memory_with_cleanup",
                        "nativeSrc": "898:34:1",
                        "nodeType": "YulIdentifier",
                        "src": "898:34:1"
                      },
                      "nativeSrc": "898:65:1",
                      "nodeType": "YulFunctionCall",
                      "src": "898:65:1"
                    },
                    "nativeSrc": "898:65:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "898:65:1"
                  },
                  {
                    "nativeSrc": "972:46:1",
                    "nodeType": "YulAssignment",
                    "src": "972:46:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "pos",
                          "nativeSrc": "983:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "983:3:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "length",
                              "nativeSrc": "1010:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "1010:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "round_up_to_mul_of_32",
                            "nativeSrc": "988:21:1",
                            "nodeType": "YulIdentifier",
                            "src": "988:21:1"
                          },
                          "nativeSrc": "988:29:1",
                          "nodeType": "YulFunctionCall",
                          "src": "988:29:1"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "979:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "979:3:1"
                      },
                      "nativeSrc": "979:39:1",
                      "nodeType": "YulFunctionCall",
                      "src": "979:39:1"
                    },
                    "variableNames": [
                      {
                        "name": "end",
                        "nativeSrc": "972:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "972:3:1"
                      }
                    ]
                  }
                ]
              },
              "name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
              "nativeSrc": "647:377:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "720:5:1",
                  "nodeType": "YulTypedName",
                  "src": "720:5:1",
                  "type": ""
                },
                {
                  "name": "pos",
                  "nativeSrc": "727:3:1",
                  "nodeType": "YulTypedName",
                  "src": "727:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "end",
                  "nativeSrc": "735:3:1",
                  "nodeType": "YulTypedName",
                  "src": "735:3:1",
                  "type": ""
                }
              ],
              "src": "647:377:1"
            },
            {
              "body": {
                "nativeSrc": "1244:501:1",
                "nodeType": "YulBlock",
                "src": "1244:501:1",
                "statements": [
                  {
                    "nativeSrc": "1254:26:1",
                    "nodeType": "YulAssignment",
                    "src": "1254:26:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "headStart",
                          "nativeSrc": "1266:9:1",
                          "nodeType": "YulIdentifier",
                          "src": "1266:9:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "1277:2:1",
                          "nodeType": "YulLiteral",
                          "src": "1277:2:1",
                          "type": "",
                          "value": "96"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "1262:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "1262:3:1"
                      },
                      "nativeSrc": "1262:18:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1262:18:1"
                    },
                    "variableNames": [
                      {
                        "name": "tail",
                        "nativeSrc": "1254:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "1254:4:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "headStart",
                              "nativeSrc": "1301:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1301:9:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "1312:1:1",
                              "nodeType": "YulLiteral",
                              "src": "1312:1:1",
                              "type": "",
                              "value": "0"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "1297:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1297:3:1"
                          },
                          "nativeSrc": "1297:17:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1297:17:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "tail",
                              "nativeSrc": "1320:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "1320:4:1"
                            },
                            {
                              "name": "headStart",
                              "nativeSrc": "1326:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1326:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nativeSrc": "1316:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1316:3:1"
                          },
                          "nativeSrc": "1316:20:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1316:20:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "1290:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "1290:6:1"
                      },
                      "nativeSrc": "1290:47:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1290:47:1"
                    },
                    "nativeSrc": "1290:47:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "1290:47:1"
                  },
                  {
                    "nativeSrc": "1346:86:1",
                    "nodeType": "YulAssignment",
                    "src": "1346:86:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value0",
                          "nativeSrc": "1418:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "1418:6:1"
                        },
                        {
                          "name": "tail",
                          "nativeSrc": "1427:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "1427:4:1"
                        }
                      ],
                      "functionName": {
                        "name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
                        "nativeSrc": "1354:63:1",
                        "nodeType": "YulIdentifier",
                        "src": "1354:63:1"
                      },
                      "nativeSrc": "1354:78:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1354:78:1"
                    },
                    "variableNames": [
                      {
                        "name": "tail",
                        "nativeSrc": "1346:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "1346:4:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "headStart",
                              "nativeSrc": "1453:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1453:9:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "1464:2:1",
                              "nodeType": "YulLiteral",
                              "src": "1464:2:1",
                              "type": "",
                              "value": "32"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "1449:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1449:3:1"
                          },
                          "nativeSrc": "1449:18:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1449:18:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "tail",
                              "nativeSrc": "1473:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "1473:4:1"
                            },
                            {
                              "name": "headStart",
                              "nativeSrc": "1479:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1479:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nativeSrc": "1469:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1469:3:1"
                          },
                          "nativeSrc": "1469:20:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1469:20:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "1442:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "1442:6:1"
                      },
                      "nativeSrc": "1442:48:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1442:48:1"
                    },
                    "nativeSrc": "1442:48:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "1442:48:1"
                  },
                  {
                    "nativeSrc": "1499:86:1",
                    "nodeType": "YulAssignment",
                    "src": "1499:86:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value1",
                          "nativeSrc": "1571:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "1571:6:1"
                        },
                        {
                          "name": "tail",
                          "nativeSrc": "1580:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "1580:4:1"
                        }
                      ],
                      "functionName": {
                        "name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
                        "nativeSrc": "1507:63:1",
                        "nodeType": "YulIdentifier",
                        "src": "1507:63:1"
                      },
                      "nativeSrc": "1507:78:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1507:78:1"
                    },
                    "variableNames": [
                      {
                        "name": "tail",
                        "nativeSrc": "1499:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "1499:4:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "headStart",
                              "nativeSrc": "1606:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1606:9:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "1617:2:1",
                              "nodeType": "YulLiteral",
                              "src": "1617:2:1",
                              "type": "",
                              "value": "64"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "1602:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1602:3:1"
                          },
                          "nativeSrc": "1602:18:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1602:18:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "tail",
                              "nativeSrc": "1626:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "1626:4:1"
                            },
                            {
                              "name": "headStart",
                              "nativeSrc": "1632:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "1632:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nativeSrc": "1622:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "1622:3:1"
                          },
                          "nativeSrc": "1622:20:1",
                          "nodeType": "YulFunctionCall",
                          "src": "1622:20:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "1595:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "1595:6:1"
                      },
                      "nativeSrc": "1595:48:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1595:48:1"
                    },
                    "nativeSrc": "1595:48:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "1595:48:1"
                  },
                  {
                    "nativeSrc": "1652:86:1",
                    "nodeType": "YulAssignment",
                    "src": "1652:86:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value2",
                          "nativeSrc": "1724:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "1724:6:1"
                        },
                        {
                          "name": "tail",
                          "nativeSrc": "1733:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "1733:4:1"
                        }
                      ],
                      "functionName": {
                        "name": "abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack",
                        "nativeSrc": "1660:63:1",
                        "nodeType": "YulIdentifier",
                        "src": "1660:63:1"
                      },
                      "nativeSrc": "1660:78:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1660:78:1"
                    },
                    "variableNames": [
                      {
                        "name": "tail",
                        "nativeSrc": "1652:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "1652:4:1"
                      }
                    ]
                  }
                ]
              },
              "name": "abi_encode_tuple_t_string_memory_ptr_t_string_memory_ptr_t_string_memory_ptr__to_t_string_memory_ptr_t_string_memory_ptr_t_string_memory_ptr__fromStack_reversed",
              "nativeSrc": "1030:715:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "headStart",
                  "nativeSrc": "1200:9:1",
                  "nodeType": "YulTypedName",
                  "src": "1200:9:1",
                  "type": ""
                },
                {
                  "name": "value2",
                  "nativeSrc": "1212:6:1",
                  "nodeType": "YulTypedName",
                  "src": "1212:6:1",
                  "type": ""
                },
                {
                  "name": "value1",
                  "nativeSrc": "1220:6:1",
                  "nodeType": "YulTypedName",
                  "src": "1220:6:1",
                  "type": ""
                },
                {
                  "name": "value0",
                  "nativeSrc": "1228:6:1",
                  "nodeType": "YulTypedName",
                  "src": "1228:6:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "tail",
                  "nativeSrc": "1239:4:1",
                  "nodeType": "YulTypedName",
                  "src": "1239:4:1",
                  "type": ""
                }
              ],
              "src": "1030:715:1"
            },
            {
              "body": {
                "nativeSrc": "1791:35:1",
                "nodeType": "YulBlock",
                "src": "1791:35:1",
                "statements": [
                  {
                    "nativeSrc": "1801:19:1",
                    "nodeType": "YulAssignment",
                    "src": "1801:19:1",
                    "value": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "1817:2:1",
                          "nodeType": "YulLiteral",
                          "src": "1817:2:1",
                          "type": "",
                          "value": "64"
                        }
                      ],
                      "functionName": {
                        "name": "mload",
                        "nativeSrc": "1811:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "1811:5:1"
                      },
                      "nativeSrc": "1811:9:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1811:9:1"
                    },
                    "variableNames": [
                      {
                        "name": "memPtr",
                        "nativeSrc": "1801:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "1801:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "allocate_unbounded",
              "nativeSrc": "1751:75:1",
              "nodeType": "YulFunctionDefinition",
              "returnVariables": [
                {
                  "name": "memPtr",
                  "nativeSrc": "1784:6:1",
                  "nodeType": "YulTypedName",
                  "src": "1784:6:1",
                  "type": ""
                }
              ],
              "src": "1751:75:1"
            },
            {
              "body": {
                "nativeSrc": "1921:28:1",
                "nodeType": "YulBlock",
                "src": "1921:28:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "1938:1:1",
                          "nodeType": "YulLiteral",
                          "src": "1938:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "1941:1:1",
                          "nodeType": "YulLiteral",
                          "src": "1941:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "1931:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "1931:6:1"
                      },
                      "nativeSrc": "1931:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "1931:12:1"
                    },
                    "nativeSrc": "1931:12:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "1931:12:1"
                  }
                ]
              },
              "name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
              "nativeSrc": "1832:117:1",
              "nodeType": "YulFunctionDefinition",
              "src": "1832:117:1"
            },
            {
              "body": {
                "nativeSrc": "2044:28:1",
                "nodeType": "YulBlock",
                "src": "2044:28:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "2061:1:1",
                          "nodeType": "YulLiteral",
                          "src": "2061:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "2064:1:1",
                          "nodeType": "YulLiteral",
                          "src": "2064:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "2054:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "2054:6:1"
                      },
                      "nativeSrc": "2054:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2054:12:1"
                    },
                    "nativeSrc": "2054:12:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "2054:12:1"
                  }
                ]
              },
              "name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
              "nativeSrc": "1955:117:1",
              "nodeType": "YulFunctionDefinition",
              "src": "1955:117:1"
            },
            {
              "body": {
                "nativeSrc": "2123:81:1",
                "nodeType": "YulBlock",
                "src": "2123:81:1",
                "statements": [
                  {
                    "nativeSrc": "2133:65:1",
                    "nodeType": "YulAssignment",
                    "src": "2133:65:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "2148:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "2148:5:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "2155:42:1",
                          "nodeType": "YulLiteral",
                          "src": "2155:42:1",
                          "type": "",
                          "value": "0xffffffffffffffffffffffffffffffffffffffff"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nativeSrc": "2144:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "2144:3:1"
                      },
                      "nativeSrc": "2144:54:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2144:54:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nativeSrc": "2133:7:1",
                        "nodeType": "YulIdentifier",
                        "src": "2133:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_uint160",
              "nativeSrc": "2078:126:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "2105:5:1",
                  "nodeType": "YulTypedName",
                  "src": "2105:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nativeSrc": "2115:7:1",
                  "nodeType": "YulTypedName",
                  "src": "2115:7:1",
                  "type": ""
                }
              ],
              "src": "2078:126:1"
            },
            {
              "body": {
                "nativeSrc": "2255:51:1",
                "nodeType": "YulBlock",
                "src": "2255:51:1",
                "statements": [
                  {
                    "nativeSrc": "2265:35:1",
                    "nodeType": "YulAssignment",
                    "src": "2265:35:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "2294:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "2294:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "cleanup_t_uint160",
                        "nativeSrc": "2276:17:1",
                        "nodeType": "YulIdentifier",
                        "src": "2276:17:1"
                      },
                      "nativeSrc": "2276:24:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2276:24:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nativeSrc": "2265:7:1",
                        "nodeType": "YulIdentifier",
                        "src": "2265:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_address",
              "nativeSrc": "2210:96:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "2237:5:1",
                  "nodeType": "YulTypedName",
                  "src": "2237:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nativeSrc": "2247:7:1",
                  "nodeType": "YulTypedName",
                  "src": "2247:7:1",
                  "type": ""
                }
              ],
              "src": "2210:96:1"
            },
            {
              "body": {
                "nativeSrc": "2355:79:1",
                "nodeType": "YulBlock",
                "src": "2355:79:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "2412:16:1",
                      "nodeType": "YulBlock",
                      "src": "2412:16:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "kind": "number",
                                "nativeSrc": "2421:1:1",
                                "nodeType": "YulLiteral",
                                "src": "2421:1:1",
                                "type": "",
                                "value": "0"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "2424:1:1",
                                "nodeType": "YulLiteral",
                                "src": "2424:1:1",
                                "type": "",
                                "value": "0"
                              }
                            ],
                            "functionName": {
                              "name": "revert",
                              "nativeSrc": "2414:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "2414:6:1"
                            },
                            "nativeSrc": "2414:12:1",
                            "nodeType": "YulFunctionCall",
                            "src": "2414:12:1"
                          },
                          "nativeSrc": "2414:12:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "2414:12:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nativeSrc": "2378:5:1",
                              "nodeType": "YulIdentifier",
                              "src": "2378:5:1"
                            },
                            {
                              "arguments": [
                                {
                                  "name": "value",
                                  "nativeSrc": "2403:5:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "2403:5:1"
                                }
                              ],
                              "functionName": {
                                "name": "cleanup_t_address",
                                "nativeSrc": "2385:17:1",
                                "nodeType": "YulIdentifier",
                                "src": "2385:17:1"
                              },
                              "nativeSrc": "2385:24:1",
                              "nodeType": "YulFunctionCall",
                              "src": "2385:24:1"
                            }
                          ],
                          "functionName": {
                            "name": "eq",
                            "nativeSrc": "2375:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "2375:2:1"
                          },
                          "nativeSrc": "2375:35:1",
                          "nodeType": "YulFunctionCall",
                          "src": "2375:35:1"
                        }
                      ],
                      "functionName": {
                        "name": "iszero",
                        "nativeSrc": "2368:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "2368:6:1"
                      },
                      "nativeSrc": "2368:43:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2368:43:1"
                    },
                    "nativeSrc": "2365:63:1",
                    "nodeType": "YulIf",
                    "src": "2365:63:1"
                  }
                ]
              },
              "name": "validator_revert_t_address",
              "nativeSrc": "2312:122:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "2348:5:1",
                  "nodeType": "YulTypedName",
                  "src": "2348:5:1",
                  "type": ""
                }
              ],
              "src": "2312:122:1"
            },
            {
              "body": {
                "nativeSrc": "2492:87:1",
                "nodeType": "YulBlock",
                "src": "2492:87:1",
                "statements": [
                  {
                    "nativeSrc": "2502:29:1",
                    "nodeType": "YulAssignment",
                    "src": "2502:29:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "offset",
                          "nativeSrc": "2524:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "2524:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "calldataload",
                        "nativeSrc": "2511:12:1",
                        "nodeType": "YulIdentifier",
                        "src": "2511:12:1"
                      },
                      "nativeSrc": "2511:20:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2511:20:1"
                    },
                    "variableNames": [
                      {
                        "name": "value",
                        "nativeSrc": "2502:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "2502:5:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "2567:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "2567:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "validator_revert_t_address",
                        "nativeSrc": "2540:26:1",
                        "nodeType": "YulIdentifier",
                        "src": "2540:26:1"
                      },
                      "nativeSrc": "2540:33:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2540:33:1"
                    },
                    "nativeSrc": "2540:33:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "2540:33:1"
                  }
                ]
              },
              "name": "abi_decode_t_address",
              "nativeSrc": "2440:139:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "offset",
                  "nativeSrc": "2470:6:1",
                  "nodeType": "YulTypedName",
                  "src": "2470:6:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nativeSrc": "2478:3:1",
                  "nodeType": "YulTypedName",
                  "src": "2478:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value",
                  "nativeSrc": "2486:5:1",
                  "nodeType": "YulTypedName",
                  "src": "2486:5:1",
                  "type": ""
                }
              ],
              "src": "2440:139:1"
            },
            {
              "body": {
                "nativeSrc": "2651:263:1",
                "nodeType": "YulBlock",
                "src": "2651:263:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "2697:83:1",
                      "nodeType": "YulBlock",
                      "src": "2697:83:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
                              "nativeSrc": "2699:77:1",
                              "nodeType": "YulIdentifier",
                              "src": "2699:77:1"
                            },
                            "nativeSrc": "2699:79:1",
                            "nodeType": "YulFunctionCall",
                            "src": "2699:79:1"
                          },
                          "nativeSrc": "2699:79:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "2699:79:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "dataEnd",
                              "nativeSrc": "2672:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "2672:7:1"
                            },
                            {
                              "name": "headStart",
                              "nativeSrc": "2681:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "2681:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nativeSrc": "2668:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "2668:3:1"
                          },
                          "nativeSrc": "2668:23:1",
                          "nodeType": "YulFunctionCall",
                          "src": "2668:23:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "2693:2:1",
                          "nodeType": "YulLiteral",
                          "src": "2693:2:1",
                          "type": "",
                          "value": "32"
                        }
                      ],
                      "functionName": {
                        "name": "slt",
                        "nativeSrc": "2664:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "2664:3:1"
                      },
                      "nativeSrc": "2664:32:1",
                      "nodeType": "YulFunctionCall",
                      "src": "2664:32:1"
                    },
                    "nativeSrc": "2661:119:1",
                    "nodeType": "YulIf",
                    "src": "2661:119:1"
                  },
                  {
                    "nativeSrc": "2790:117:1",
                    "nodeType": "YulBlock",
                    "src": "2790:117:1",
                    "statements": [
                      {
                        "nativeSrc": "2805:15:1",
                        "nodeType": "YulVariableDeclaration",
                        "src": "2805:15:1",
                        "value": {
                          "kind": "number",
                          "nativeSrc": "2819:1:1",
                          "nodeType": "YulLiteral",
                          "src": "2819:1:1",
                          "type": "",
                          "value": "0"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nativeSrc": "2809:6:1",
                            "nodeType": "YulTypedName",
                            "src": "2809:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "nativeSrc": "2834:63:1",
                        "nodeType": "YulAssignment",
                        "src": "2834:63:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "2869:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "2869:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nativeSrc": "2880:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "2880:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "2865:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "2865:3:1"
                              },
                              "nativeSrc": "2865:22:1",
                              "nodeType": "YulFunctionCall",
                              "src": "2865:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nativeSrc": "2889:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "2889:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_address",
                            "nativeSrc": "2844:20:1",
                            "nodeType": "YulIdentifier",
                            "src": "2844:20:1"
                          },
                          "nativeSrc": "2844:53:1",
                          "nodeType": "YulFunctionCall",
                          "src": "2844:53:1"
                        },
                        "variableNames": [
                          {
                            "name": "value0",
                            "nativeSrc": "2834:6:1",
                            "nodeType": "YulIdentifier",
                            "src": "2834:6:1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "name": "abi_decode_tuple_t_address",
              "nativeSrc": "2585:329:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "headStart",
                  "nativeSrc": "2621:9:1",
                  "nodeType": "YulTypedName",
                  "src": "2621:9:1",
                  "type": ""
                },
                {
                  "name": "dataEnd",
                  "nativeSrc": "2632:7:1",
                  "nodeType": "YulTypedName",
                  "src": "2632:7:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value0",
                  "nativeSrc": "2644:6:1",
                  "nodeType": "YulTypedName",
                  "src": "2644:6:1",
                  "type": ""
                }
              ],
              "src": "2585:329:1"
            },
            {
              "body": {
                "nativeSrc": "3009:28:1",
                "nodeType": "YulBlock",
                "src": "3009:28:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3026:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3026:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3029:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3029:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "3019:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3019:6:1"
                      },
                      "nativeSrc": "3019:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3019:12:1"
                    },
                    "nativeSrc": "3019:12:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3019:12:1"
                  }
                ]
              },
              "name": "revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d",
              "nativeSrc": "2920:117:1",
              "nodeType": "YulFunctionDefinition",
              "src": "2920:117:1"
            },
            {
              "body": {
                "nativeSrc": "3132:28:1",
                "nodeType": "YulBlock",
                "src": "3132:28:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3149:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3149:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3152:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3152:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "3142:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3142:6:1"
                      },
                      "nativeSrc": "3142:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3142:12:1"
                    },
                    "nativeSrc": "3142:12:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3142:12:1"
                  }
                ]
              },
              "name": "revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae",
              "nativeSrc": "3043:117:1",
              "nodeType": "YulFunctionDefinition",
              "src": "3043:117:1"
            },
            {
              "body": {
                "nativeSrc": "3194:152:1",
                "nodeType": "YulBlock",
                "src": "3194:152:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3211:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3211:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3214:77:1",
                          "nodeType": "YulLiteral",
                          "src": "3214:77:1",
                          "type": "",
                          "value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "3204:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3204:6:1"
                      },
                      "nativeSrc": "3204:88:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3204:88:1"
                    },
                    "nativeSrc": "3204:88:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3204:88:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3308:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3308:1:1",
                          "type": "",
                          "value": "4"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3311:4:1",
                          "nodeType": "YulLiteral",
                          "src": "3311:4:1",
                          "type": "",
                          "value": "0x41"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "3301:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3301:6:1"
                      },
                      "nativeSrc": "3301:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3301:15:1"
                    },
                    "nativeSrc": "3301:15:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3301:15:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3332:1:1",
                          "nodeType": "YulLiteral",
                          "src": "3332:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3335:4:1",
                          "nodeType": "YulLiteral",
                          "src": "3335:4:1",
                          "type": "",
                          "value": "0x24"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "3325:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3325:6:1"
                      },
                      "nativeSrc": "3325:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3325:15:1"
                    },
                    "nativeSrc": "3325:15:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3325:15:1"
                  }
                ]
              },
              "name": "panic_error_0x41",
              "nativeSrc": "3166:180:1",
              "nodeType": "YulFunctionDefinition",
              "src": "3166:180:1"
            },
            {
              "body": {
                "nativeSrc": "3395:238:1",
                "nodeType": "YulBlock",
                "src": "3395:238:1",
                "statements": [
                  {
                    "nativeSrc": "3405:58:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "3405:58:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "memPtr",
                          "nativeSrc": "3427:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "3427:6:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "size",
                              "nativeSrc": "3457:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "3457:4:1"
                            }
                          ],
                          "functionName": {
                            "name": "round_up_to_mul_of_32",
                            "nativeSrc": "3435:21:1",
                            "nodeType": "YulIdentifier",
                            "src": "3435:21:1"
                          },
                          "nativeSrc": "3435:27:1",
                          "nodeType": "YulFunctionCall",
                          "src": "3435:27:1"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "3423:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "3423:3:1"
                      },
                      "nativeSrc": "3423:40:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3423:40:1"
                    },
                    "variables": [
                      {
                        "name": "newFreePtr",
                        "nativeSrc": "3409:10:1",
                        "nodeType": "YulTypedName",
                        "src": "3409:10:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "body": {
                      "nativeSrc": "3574:22:1",
                      "nodeType": "YulBlock",
                      "src": "3574:22:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "panic_error_0x41",
                              "nativeSrc": "3576:16:1",
                              "nodeType": "YulIdentifier",
                              "src": "3576:16:1"
                            },
                            "nativeSrc": "3576:18:1",
                            "nodeType": "YulFunctionCall",
                            "src": "3576:18:1"
                          },
                          "nativeSrc": "3576:18:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "3576:18:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "newFreePtr",
                              "nativeSrc": "3517:10:1",
                              "nodeType": "YulIdentifier",
                              "src": "3517:10:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "3529:18:1",
                              "nodeType": "YulLiteral",
                              "src": "3529:18:1",
                              "type": "",
                              "value": "0xffffffffffffffff"
                            }
                          ],
                          "functionName": {
                            "name": "gt",
                            "nativeSrc": "3514:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "3514:2:1"
                          },
                          "nativeSrc": "3514:34:1",
                          "nodeType": "YulFunctionCall",
                          "src": "3514:34:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "newFreePtr",
                              "nativeSrc": "3553:10:1",
                              "nodeType": "YulIdentifier",
                              "src": "3553:10:1"
                            },
                            {
                              "name": "memPtr",
                              "nativeSrc": "3565:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "3565:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "lt",
                            "nativeSrc": "3550:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "3550:2:1"
                          },
                          "nativeSrc": "3550:22:1",
                          "nodeType": "YulFunctionCall",
                          "src": "3550:22:1"
                        }
                      ],
                      "functionName": {
                        "name": "or",
                        "nativeSrc": "3511:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "3511:2:1"
                      },
                      "nativeSrc": "3511:62:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3511:62:1"
                    },
                    "nativeSrc": "3508:88:1",
                    "nodeType": "YulIf",
                    "src": "3508:88:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "3612:2:1",
                          "nodeType": "YulLiteral",
                          "src": "3612:2:1",
                          "type": "",
                          "value": "64"
                        },
                        {
                          "name": "newFreePtr",
                          "nativeSrc": "3616:10:1",
                          "nodeType": "YulIdentifier",
                          "src": "3616:10:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "3605:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3605:6:1"
                      },
                      "nativeSrc": "3605:22:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3605:22:1"
                    },
                    "nativeSrc": "3605:22:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3605:22:1"
                  }
                ]
              },
              "name": "finalize_allocation",
              "nativeSrc": "3352:281:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "memPtr",
                  "nativeSrc": "3381:6:1",
                  "nodeType": "YulTypedName",
                  "src": "3381:6:1",
                  "type": ""
                },
                {
                  "name": "size",
                  "nativeSrc": "3389:4:1",
                  "nodeType": "YulTypedName",
                  "src": "3389:4:1",
                  "type": ""
                }
              ],
              "src": "3352:281:1"
            },
            {
              "body": {
                "nativeSrc": "3680:88:1",
                "nodeType": "YulBlock",
                "src": "3680:88:1",
                "statements": [
                  {
                    "nativeSrc": "3690:30:1",
                    "nodeType": "YulAssignment",
                    "src": "3690:30:1",
                    "value": {
                      "arguments": [],
                      "functionName": {
                        "name": "allocate_unbounded",
                        "nativeSrc": "3700:18:1",
                        "nodeType": "YulIdentifier",
                        "src": "3700:18:1"
                      },
                      "nativeSrc": "3700:20:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3700:20:1"
                    },
                    "variableNames": [
                      {
                        "name": "memPtr",
                        "nativeSrc": "3690:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "3690:6:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "memPtr",
                          "nativeSrc": "3749:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "3749:6:1"
                        },
                        {
                          "name": "size",
                          "nativeSrc": "3757:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "3757:4:1"
                        }
                      ],
                      "functionName": {
                        "name": "finalize_allocation",
                        "nativeSrc": "3729:19:1",
                        "nodeType": "YulIdentifier",
                        "src": "3729:19:1"
                      },
                      "nativeSrc": "3729:33:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3729:33:1"
                    },
                    "nativeSrc": "3729:33:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "3729:33:1"
                  }
                ]
              },
              "name": "allocate_memory",
              "nativeSrc": "3639:129:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "size",
                  "nativeSrc": "3664:4:1",
                  "nodeType": "YulTypedName",
                  "src": "3664:4:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "memPtr",
                  "nativeSrc": "3673:6:1",
                  "nodeType": "YulTypedName",
                  "src": "3673:6:1",
                  "type": ""
                }
              ],
              "src": "3639:129:1"
            },
            {
              "body": {
                "nativeSrc": "3841:241:1",
                "nodeType": "YulBlock",
                "src": "3841:241:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "3946:22:1",
                      "nodeType": "YulBlock",
                      "src": "3946:22:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "panic_error_0x41",
                              "nativeSrc": "3948:16:1",
                              "nodeType": "YulIdentifier",
                              "src": "3948:16:1"
                            },
                            "nativeSrc": "3948:18:1",
                            "nodeType": "YulFunctionCall",
                            "src": "3948:18:1"
                          },
                          "nativeSrc": "3948:18:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "3948:18:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "length",
                          "nativeSrc": "3918:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "3918:6:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "3926:18:1",
                          "nodeType": "YulLiteral",
                          "src": "3926:18:1",
                          "type": "",
                          "value": "0xffffffffffffffff"
                        }
                      ],
                      "functionName": {
                        "name": "gt",
                        "nativeSrc": "3915:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "3915:2:1"
                      },
                      "nativeSrc": "3915:30:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3915:30:1"
                    },
                    "nativeSrc": "3912:56:1",
                    "nodeType": "YulIf",
                    "src": "3912:56:1"
                  },
                  {
                    "nativeSrc": "3978:37:1",
                    "nodeType": "YulAssignment",
                    "src": "3978:37:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "length",
                          "nativeSrc": "4008:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "4008:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "round_up_to_mul_of_32",
                        "nativeSrc": "3986:21:1",
                        "nodeType": "YulIdentifier",
                        "src": "3986:21:1"
                      },
                      "nativeSrc": "3986:29:1",
                      "nodeType": "YulFunctionCall",
                      "src": "3986:29:1"
                    },
                    "variableNames": [
                      {
                        "name": "size",
                        "nativeSrc": "3978:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "3978:4:1"
                      }
                    ]
                  },
                  {
                    "nativeSrc": "4052:23:1",
                    "nodeType": "YulAssignment",
                    "src": "4052:23:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "size",
                          "nativeSrc": "4064:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "4064:4:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "4070:4:1",
                          "nodeType": "YulLiteral",
                          "src": "4070:4:1",
                          "type": "",
                          "value": "0x20"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "4060:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "4060:3:1"
                      },
                      "nativeSrc": "4060:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4060:15:1"
                    },
                    "variableNames": [
                      {
                        "name": "size",
                        "nativeSrc": "4052:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "4052:4:1"
                      }
                    ]
                  }
                ]
              },
              "name": "array_allocation_size_t_string_memory_ptr",
              "nativeSrc": "3774:308:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "length",
                  "nativeSrc": "3825:6:1",
                  "nodeType": "YulTypedName",
                  "src": "3825:6:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "size",
                  "nativeSrc": "3836:4:1",
                  "nodeType": "YulTypedName",
                  "src": "3836:4:1",
                  "type": ""
                }
              ],
              "src": "3774:308:1"
            },
            {
              "body": {
                "nativeSrc": "4152:82:1",
                "nodeType": "YulBlock",
                "src": "4152:82:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "dst",
                          "nativeSrc": "4175:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "4175:3:1"
                        },
                        {
                          "name": "src",
                          "nativeSrc": "4180:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "4180:3:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "4185:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "4185:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "calldatacopy",
                        "nativeSrc": "4162:12:1",
                        "nodeType": "YulIdentifier",
                        "src": "4162:12:1"
                      },
                      "nativeSrc": "4162:30:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4162:30:1"
                    },
                    "nativeSrc": "4162:30:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "4162:30:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "dst",
                              "nativeSrc": "4212:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "4212:3:1"
                            },
                            {
                              "name": "length",
                              "nativeSrc": "4217:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "4217:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "4208:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "4208:3:1"
                          },
                          "nativeSrc": "4208:16:1",
                          "nodeType": "YulFunctionCall",
                          "src": "4208:16:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "4226:1:1",
                          "nodeType": "YulLiteral",
                          "src": "4226:1:1",
                          "type": "",
                          "value": "0"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "4201:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "4201:6:1"
                      },
                      "nativeSrc": "4201:27:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4201:27:1"
                    },
                    "nativeSrc": "4201:27:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "4201:27:1"
                  }
                ]
              },
              "name": "copy_calldata_to_memory_with_cleanup",
              "nativeSrc": "4088:146:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "src",
                  "nativeSrc": "4134:3:1",
                  "nodeType": "YulTypedName",
                  "src": "4134:3:1",
                  "type": ""
                },
                {
                  "name": "dst",
                  "nativeSrc": "4139:3:1",
                  "nodeType": "YulTypedName",
                  "src": "4139:3:1",
                  "type": ""
                },
                {
                  "name": "length",
                  "nativeSrc": "4144:6:1",
                  "nodeType": "YulTypedName",
                  "src": "4144:6:1",
                  "type": ""
                }
              ],
              "src": "4088:146:1"
            },
            {
              "body": {
                "nativeSrc": "4324:341:1",
                "nodeType": "YulBlock",
                "src": "4324:341:1",
                "statements": [
                  {
                    "nativeSrc": "4334:75:1",
                    "nodeType": "YulAssignment",
                    "src": "4334:75:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "length",
                              "nativeSrc": "4401:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "4401:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "array_allocation_size_t_string_memory_ptr",
                            "nativeSrc": "4359:41:1",
                            "nodeType": "YulIdentifier",
                            "src": "4359:41:1"
                          },
                          "nativeSrc": "4359:49:1",
                          "nodeType": "YulFunctionCall",
                          "src": "4359:49:1"
                        }
                      ],
                      "functionName": {
                        "name": "allocate_memory",
                        "nativeSrc": "4343:15:1",
                        "nodeType": "YulIdentifier",
                        "src": "4343:15:1"
                      },
                      "nativeSrc": "4343:66:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4343:66:1"
                    },
                    "variableNames": [
                      {
                        "name": "array",
                        "nativeSrc": "4334:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "4334:5:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "array",
                          "nativeSrc": "4425:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "4425:5:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "4432:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "4432:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "4418:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "4418:6:1"
                      },
                      "nativeSrc": "4418:21:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4418:21:1"
                    },
                    "nativeSrc": "4418:21:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "4418:21:1"
                  },
                  {
                    "nativeSrc": "4448:27:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "4448:27:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "array",
                          "nativeSrc": "4463:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "4463:5:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "4470:4:1",
                          "nodeType": "YulLiteral",
                          "src": "4470:4:1",
                          "type": "",
                          "value": "0x20"
                        }
                      ],
                      "functionName": {
                        "name": "add",
                        "nativeSrc": "4459:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "4459:3:1"
                      },
                      "nativeSrc": "4459:16:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4459:16:1"
                    },
                    "variables": [
                      {
                        "name": "dst",
                        "nativeSrc": "4452:3:1",
                        "nodeType": "YulTypedName",
                        "src": "4452:3:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "body": {
                      "nativeSrc": "4513:83:1",
                      "nodeType": "YulBlock",
                      "src": "4513:83:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae",
                              "nativeSrc": "4515:77:1",
                              "nodeType": "YulIdentifier",
                              "src": "4515:77:1"
                            },
                            "nativeSrc": "4515:79:1",
                            "nodeType": "YulFunctionCall",
                            "src": "4515:79:1"
                          },
                          "nativeSrc": "4515:79:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "4515:79:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "src",
                              "nativeSrc": "4494:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "4494:3:1"
                            },
                            {
                              "name": "length",
                              "nativeSrc": "4499:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "4499:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "4490:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "4490:3:1"
                          },
                          "nativeSrc": "4490:16:1",
                          "nodeType": "YulFunctionCall",
                          "src": "4490:16:1"
                        },
                        {
                          "name": "end",
                          "nativeSrc": "4508:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "4508:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "gt",
                        "nativeSrc": "4487:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "4487:2:1"
                      },
                      "nativeSrc": "4487:25:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4487:25:1"
                    },
                    "nativeSrc": "4484:112:1",
                    "nodeType": "YulIf",
                    "src": "4484:112:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "src",
                          "nativeSrc": "4642:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "4642:3:1"
                        },
                        {
                          "name": "dst",
                          "nativeSrc": "4647:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "4647:3:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "4652:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "4652:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "copy_calldata_to_memory_with_cleanup",
                        "nativeSrc": "4605:36:1",
                        "nodeType": "YulIdentifier",
                        "src": "4605:36:1"
                      },
                      "nativeSrc": "4605:54:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4605:54:1"
                    },
                    "nativeSrc": "4605:54:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "4605:54:1"
                  }
                ]
              },
              "name": "abi_decode_available_length_t_string_memory_ptr",
              "nativeSrc": "4240:425:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "src",
                  "nativeSrc": "4297:3:1",
                  "nodeType": "YulTypedName",
                  "src": "4297:3:1",
                  "type": ""
                },
                {
                  "name": "length",
                  "nativeSrc": "4302:6:1",
                  "nodeType": "YulTypedName",
                  "src": "4302:6:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nativeSrc": "4310:3:1",
                  "nodeType": "YulTypedName",
                  "src": "4310:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "array",
                  "nativeSrc": "4318:5:1",
                  "nodeType": "YulTypedName",
                  "src": "4318:5:1",
                  "type": ""
                }
              ],
              "src": "4240:425:1"
            },
            {
              "body": {
                "nativeSrc": "4747:278:1",
                "nodeType": "YulBlock",
                "src": "4747:278:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "4796:83:1",
                      "nodeType": "YulBlock",
                      "src": "4796:83:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d",
                              "nativeSrc": "4798:77:1",
                              "nodeType": "YulIdentifier",
                              "src": "4798:77:1"
                            },
                            "nativeSrc": "4798:79:1",
                            "nodeType": "YulFunctionCall",
                            "src": "4798:79:1"
                          },
                          "nativeSrc": "4798:79:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "4798:79:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "offset",
                                  "nativeSrc": "4775:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "4775:6:1"
                                },
                                {
                                  "kind": "number",
                                  "nativeSrc": "4783:4:1",
                                  "nodeType": "YulLiteral",
                                  "src": "4783:4:1",
                                  "type": "",
                                  "value": "0x1f"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "4771:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "4771:3:1"
                              },
                              "nativeSrc": "4771:17:1",
                              "nodeType": "YulFunctionCall",
                              "src": "4771:17:1"
                            },
                            {
                              "name": "end",
                              "nativeSrc": "4790:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "4790:3:1"
                            }
                          ],
                          "functionName": {
                            "name": "slt",
                            "nativeSrc": "4767:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "4767:3:1"
                          },
                          "nativeSrc": "4767:27:1",
                          "nodeType": "YulFunctionCall",
                          "src": "4767:27:1"
                        }
                      ],
                      "functionName": {
                        "name": "iszero",
                        "nativeSrc": "4760:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "4760:6:1"
                      },
                      "nativeSrc": "4760:35:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4760:35:1"
                    },
                    "nativeSrc": "4757:122:1",
                    "nodeType": "YulIf",
                    "src": "4757:122:1"
                  },
                  {
                    "nativeSrc": "4888:34:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "4888:34:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "offset",
                          "nativeSrc": "4915:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "4915:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "calldataload",
                        "nativeSrc": "4902:12:1",
                        "nodeType": "YulIdentifier",
                        "src": "4902:12:1"
                      },
                      "nativeSrc": "4902:20:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4902:20:1"
                    },
                    "variables": [
                      {
                        "name": "length",
                        "nativeSrc": "4892:6:1",
                        "nodeType": "YulTypedName",
                        "src": "4892:6:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "4931:88:1",
                    "nodeType": "YulAssignment",
                    "src": "4931:88:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "offset",
                              "nativeSrc": "4992:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "4992:6:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "5000:4:1",
                              "nodeType": "YulLiteral",
                              "src": "5000:4:1",
                              "type": "",
                              "value": "0x20"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "4988:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "4988:3:1"
                          },
                          "nativeSrc": "4988:17:1",
                          "nodeType": "YulFunctionCall",
                          "src": "4988:17:1"
                        },
                        {
                          "name": "length",
                          "nativeSrc": "5007:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "5007:6:1"
                        },
                        {
                          "name": "end",
                          "nativeSrc": "5015:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "5015:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "abi_decode_available_length_t_string_memory_ptr",
                        "nativeSrc": "4940:47:1",
                        "nodeType": "YulIdentifier",
                        "src": "4940:47:1"
                      },
                      "nativeSrc": "4940:79:1",
                      "nodeType": "YulFunctionCall",
                      "src": "4940:79:1"
                    },
                    "variableNames": [
                      {
                        "name": "array",
                        "nativeSrc": "4931:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "4931:5:1"
                      }
                    ]
                  }
                ]
              },
              "name": "abi_decode_t_string_memory_ptr",
              "nativeSrc": "4685:340:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "offset",
                  "nativeSrc": "4725:6:1",
                  "nodeType": "YulTypedName",
                  "src": "4725:6:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nativeSrc": "4733:3:1",
                  "nodeType": "YulTypedName",
                  "src": "4733:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "array",
                  "nativeSrc": "4741:5:1",
                  "nodeType": "YulTypedName",
                  "src": "4741:5:1",
                  "type": ""
                }
              ],
              "src": "4685:340:1"
            },
            {
              "body": {
                "nativeSrc": "5161:1029:1",
                "nodeType": "YulBlock",
                "src": "5161:1029:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "5207:83:1",
                      "nodeType": "YulBlock",
                      "src": "5207:83:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b",
                              "nativeSrc": "5209:77:1",
                              "nodeType": "YulIdentifier",
                              "src": "5209:77:1"
                            },
                            "nativeSrc": "5209:79:1",
                            "nodeType": "YulFunctionCall",
                            "src": "5209:79:1"
                          },
                          "nativeSrc": "5209:79:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "5209:79:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "dataEnd",
                              "nativeSrc": "5182:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "5182:7:1"
                            },
                            {
                              "name": "headStart",
                              "nativeSrc": "5191:9:1",
                              "nodeType": "YulIdentifier",
                              "src": "5191:9:1"
                            }
                          ],
                          "functionName": {
                            "name": "sub",
                            "nativeSrc": "5178:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "5178:3:1"
                          },
                          "nativeSrc": "5178:23:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5178:23:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "5203:2:1",
                          "nodeType": "YulLiteral",
                          "src": "5203:2:1",
                          "type": "",
                          "value": "96"
                        }
                      ],
                      "functionName": {
                        "name": "slt",
                        "nativeSrc": "5174:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "5174:3:1"
                      },
                      "nativeSrc": "5174:32:1",
                      "nodeType": "YulFunctionCall",
                      "src": "5174:32:1"
                    },
                    "nativeSrc": "5171:119:1",
                    "nodeType": "YulIf",
                    "src": "5171:119:1"
                  },
                  {
                    "nativeSrc": "5300:287:1",
                    "nodeType": "YulBlock",
                    "src": "5300:287:1",
                    "statements": [
                      {
                        "nativeSrc": "5315:45:1",
                        "nodeType": "YulVariableDeclaration",
                        "src": "5315:45:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "5346:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5346:9:1"
                                },
                                {
                                  "kind": "number",
                                  "nativeSrc": "5357:1:1",
                                  "nodeType": "YulLiteral",
                                  "src": "5357:1:1",
                                  "type": "",
                                  "value": "0"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "5342:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "5342:3:1"
                              },
                              "nativeSrc": "5342:17:1",
                              "nodeType": "YulFunctionCall",
                              "src": "5342:17:1"
                            }
                          ],
                          "functionName": {
                            "name": "calldataload",
                            "nativeSrc": "5329:12:1",
                            "nodeType": "YulIdentifier",
                            "src": "5329:12:1"
                          },
                          "nativeSrc": "5329:31:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5329:31:1"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nativeSrc": "5319:6:1",
                            "nodeType": "YulTypedName",
                            "src": "5319:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "body": {
                          "nativeSrc": "5407:83:1",
                          "nodeType": "YulBlock",
                          "src": "5407:83:1",
                          "statements": [
                            {
                              "expression": {
                                "arguments": [],
                                "functionName": {
                                  "name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
                                  "nativeSrc": "5409:77:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5409:77:1"
                                },
                                "nativeSrc": "5409:79:1",
                                "nodeType": "YulFunctionCall",
                                "src": "5409:79:1"
                              },
                              "nativeSrc": "5409:79:1",
                              "nodeType": "YulExpressionStatement",
                              "src": "5409:79:1"
                            }
                          ]
                        },
                        "condition": {
                          "arguments": [
                            {
                              "name": "offset",
                              "nativeSrc": "5379:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "5379:6:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "5387:18:1",
                              "nodeType": "YulLiteral",
                              "src": "5387:18:1",
                              "type": "",
                              "value": "0xffffffffffffffff"
                            }
                          ],
                          "functionName": {
                            "name": "gt",
                            "nativeSrc": "5376:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "5376:2:1"
                          },
                          "nativeSrc": "5376:30:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5376:30:1"
                        },
                        "nativeSrc": "5373:117:1",
                        "nodeType": "YulIf",
                        "src": "5373:117:1"
                      },
                      {
                        "nativeSrc": "5504:73:1",
                        "nodeType": "YulAssignment",
                        "src": "5504:73:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "5549:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5549:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nativeSrc": "5560:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5560:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "5545:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "5545:3:1"
                              },
                              "nativeSrc": "5545:22:1",
                              "nodeType": "YulFunctionCall",
                              "src": "5545:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nativeSrc": "5569:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "5569:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_string_memory_ptr",
                            "nativeSrc": "5514:30:1",
                            "nodeType": "YulIdentifier",
                            "src": "5514:30:1"
                          },
                          "nativeSrc": "5514:63:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5514:63:1"
                        },
                        "variableNames": [
                          {
                            "name": "value0",
                            "nativeSrc": "5504:6:1",
                            "nodeType": "YulIdentifier",
                            "src": "5504:6:1"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nativeSrc": "5597:288:1",
                    "nodeType": "YulBlock",
                    "src": "5597:288:1",
                    "statements": [
                      {
                        "nativeSrc": "5612:46:1",
                        "nodeType": "YulVariableDeclaration",
                        "src": "5612:46:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "5643:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5643:9:1"
                                },
                                {
                                  "kind": "number",
                                  "nativeSrc": "5654:2:1",
                                  "nodeType": "YulLiteral",
                                  "src": "5654:2:1",
                                  "type": "",
                                  "value": "32"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "5639:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "5639:3:1"
                              },
                              "nativeSrc": "5639:18:1",
                              "nodeType": "YulFunctionCall",
                              "src": "5639:18:1"
                            }
                          ],
                          "functionName": {
                            "name": "calldataload",
                            "nativeSrc": "5626:12:1",
                            "nodeType": "YulIdentifier",
                            "src": "5626:12:1"
                          },
                          "nativeSrc": "5626:32:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5626:32:1"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nativeSrc": "5616:6:1",
                            "nodeType": "YulTypedName",
                            "src": "5616:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "body": {
                          "nativeSrc": "5705:83:1",
                          "nodeType": "YulBlock",
                          "src": "5705:83:1",
                          "statements": [
                            {
                              "expression": {
                                "arguments": [],
                                "functionName": {
                                  "name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
                                  "nativeSrc": "5707:77:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5707:77:1"
                                },
                                "nativeSrc": "5707:79:1",
                                "nodeType": "YulFunctionCall",
                                "src": "5707:79:1"
                              },
                              "nativeSrc": "5707:79:1",
                              "nodeType": "YulExpressionStatement",
                              "src": "5707:79:1"
                            }
                          ]
                        },
                        "condition": {
                          "arguments": [
                            {
                              "name": "offset",
                              "nativeSrc": "5677:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "5677:6:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "5685:18:1",
                              "nodeType": "YulLiteral",
                              "src": "5685:18:1",
                              "type": "",
                              "value": "0xffffffffffffffff"
                            }
                          ],
                          "functionName": {
                            "name": "gt",
                            "nativeSrc": "5674:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "5674:2:1"
                          },
                          "nativeSrc": "5674:30:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5674:30:1"
                        },
                        "nativeSrc": "5671:117:1",
                        "nodeType": "YulIf",
                        "src": "5671:117:1"
                      },
                      {
                        "nativeSrc": "5802:73:1",
                        "nodeType": "YulAssignment",
                        "src": "5802:73:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "5847:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5847:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nativeSrc": "5858:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5858:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "5843:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "5843:3:1"
                              },
                              "nativeSrc": "5843:22:1",
                              "nodeType": "YulFunctionCall",
                              "src": "5843:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nativeSrc": "5867:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "5867:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_string_memory_ptr",
                            "nativeSrc": "5812:30:1",
                            "nodeType": "YulIdentifier",
                            "src": "5812:30:1"
                          },
                          "nativeSrc": "5812:63:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5812:63:1"
                        },
                        "variableNames": [
                          {
                            "name": "value1",
                            "nativeSrc": "5802:6:1",
                            "nodeType": "YulIdentifier",
                            "src": "5802:6:1"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "nativeSrc": "5895:288:1",
                    "nodeType": "YulBlock",
                    "src": "5895:288:1",
                    "statements": [
                      {
                        "nativeSrc": "5910:46:1",
                        "nodeType": "YulVariableDeclaration",
                        "src": "5910:46:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "5941:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "5941:9:1"
                                },
                                {
                                  "kind": "number",
                                  "nativeSrc": "5952:2:1",
                                  "nodeType": "YulLiteral",
                                  "src": "5952:2:1",
                                  "type": "",
                                  "value": "64"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "5937:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "5937:3:1"
                              },
                              "nativeSrc": "5937:18:1",
                              "nodeType": "YulFunctionCall",
                              "src": "5937:18:1"
                            }
                          ],
                          "functionName": {
                            "name": "calldataload",
                            "nativeSrc": "5924:12:1",
                            "nodeType": "YulIdentifier",
                            "src": "5924:12:1"
                          },
                          "nativeSrc": "5924:32:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5924:32:1"
                        },
                        "variables": [
                          {
                            "name": "offset",
                            "nativeSrc": "5914:6:1",
                            "nodeType": "YulTypedName",
                            "src": "5914:6:1",
                            "type": ""
                          }
                        ]
                      },
                      {
                        "body": {
                          "nativeSrc": "6003:83:1",
                          "nodeType": "YulBlock",
                          "src": "6003:83:1",
                          "statements": [
                            {
                              "expression": {
                                "arguments": [],
                                "functionName": {
                                  "name": "revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db",
                                  "nativeSrc": "6005:77:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "6005:77:1"
                                },
                                "nativeSrc": "6005:79:1",
                                "nodeType": "YulFunctionCall",
                                "src": "6005:79:1"
                              },
                              "nativeSrc": "6005:79:1",
                              "nodeType": "YulExpressionStatement",
                              "src": "6005:79:1"
                            }
                          ]
                        },
                        "condition": {
                          "arguments": [
                            {
                              "name": "offset",
                              "nativeSrc": "5975:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "5975:6:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "5983:18:1",
                              "nodeType": "YulLiteral",
                              "src": "5983:18:1",
                              "type": "",
                              "value": "0xffffffffffffffff"
                            }
                          ],
                          "functionName": {
                            "name": "gt",
                            "nativeSrc": "5972:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "5972:2:1"
                          },
                          "nativeSrc": "5972:30:1",
                          "nodeType": "YulFunctionCall",
                          "src": "5972:30:1"
                        },
                        "nativeSrc": "5969:117:1",
                        "nodeType": "YulIf",
                        "src": "5969:117:1"
                      },
                      {
                        "nativeSrc": "6100:73:1",
                        "nodeType": "YulAssignment",
                        "src": "6100:73:1",
                        "value": {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "headStart",
                                  "nativeSrc": "6145:9:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "6145:9:1"
                                },
                                {
                                  "name": "offset",
                                  "nativeSrc": "6156:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "6156:6:1"
                                }
                              ],
                              "functionName": {
                                "name": "add",
                                "nativeSrc": "6141:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "6141:3:1"
                              },
                              "nativeSrc": "6141:22:1",
                              "nodeType": "YulFunctionCall",
                              "src": "6141:22:1"
                            },
                            {
                              "name": "dataEnd",
                              "nativeSrc": "6165:7:1",
                              "nodeType": "YulIdentifier",
                              "src": "6165:7:1"
                            }
                          ],
                          "functionName": {
                            "name": "abi_decode_t_string_memory_ptr",
                            "nativeSrc": "6110:30:1",
                            "nodeType": "YulIdentifier",
                            "src": "6110:30:1"
                          },
                          "nativeSrc": "6110:63:1",
                          "nodeType": "YulFunctionCall",
                          "src": "6110:63:1"
                        },
                        "variableNames": [
                          {
                            "name": "value2",
                            "nativeSrc": "6100:6:1",
                            "nodeType": "YulIdentifier",
                            "src": "6100:6:1"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "name": "abi_decode_tuple_t_string_memory_ptrt_string_memory_ptrt_string_memory_ptr",
              "nativeSrc": "5031:1159:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "headStart",
                  "nativeSrc": "5115:9:1",
                  "nodeType": "YulTypedName",
                  "src": "5115:9:1",
                  "type": ""
                },
                {
                  "name": "dataEnd",
                  "nativeSrc": "5126:7:1",
                  "nodeType": "YulTypedName",
                  "src": "5126:7:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "value0",
                  "nativeSrc": "5138:6:1",
                  "nodeType": "YulTypedName",
                  "src": "5138:6:1",
                  "type": ""
                },
                {
                  "name": "value1",
                  "nativeSrc": "5146:6:1",
                  "nodeType": "YulTypedName",
                  "src": "5146:6:1",
                  "type": ""
                },
                {
                  "name": "value2",
                  "nativeSrc": "5154:6:1",
                  "nodeType": "YulTypedName",
                  "src": "5154:6:1",
                  "type": ""
                }
              ],
              "src": "5031:1159:1"
            },
            {
              "body": {
                "nativeSrc": "6224:152:1",
                "nodeType": "YulBlock",
                "src": "6224:152:1",
                "statements": [
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "6241:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6241:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6244:77:1",
                          "nodeType": "YulLiteral",
                          "src": "6244:77:1",
                          "type": "",
                          "value": "35408467139433450592217433187231851964531694900788300625387963629091585785856"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "6234:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6234:6:1"
                      },
                      "nativeSrc": "6234:88:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6234:88:1"
                    },
                    "nativeSrc": "6234:88:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "6234:88:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "6338:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6338:1:1",
                          "type": "",
                          "value": "4"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6341:4:1",
                          "nodeType": "YulLiteral",
                          "src": "6341:4:1",
                          "type": "",
                          "value": "0x22"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "6331:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6331:6:1"
                      },
                      "nativeSrc": "6331:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6331:15:1"
                    },
                    "nativeSrc": "6331:15:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "6331:15:1"
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "6362:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6362:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6365:4:1",
                          "nodeType": "YulLiteral",
                          "src": "6365:4:1",
                          "type": "",
                          "value": "0x24"
                        }
                      ],
                      "functionName": {
                        "name": "revert",
                        "nativeSrc": "6355:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6355:6:1"
                      },
                      "nativeSrc": "6355:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6355:15:1"
                    },
                    "nativeSrc": "6355:15:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "6355:15:1"
                  }
                ]
              },
              "name": "panic_error_0x22",
              "nativeSrc": "6196:180:1",
              "nodeType": "YulFunctionDefinition",
              "src": "6196:180:1"
            },
            {
              "body": {
                "nativeSrc": "6433:269:1",
                "nodeType": "YulBlock",
                "src": "6433:269:1",
                "statements": [
                  {
                    "nativeSrc": "6443:22:1",
                    "nodeType": "YulAssignment",
                    "src": "6443:22:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "data",
                          "nativeSrc": "6457:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "6457:4:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6463:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6463:1:1",
                          "type": "",
                          "value": "2"
                        }
                      ],
                      "functionName": {
                        "name": "div",
                        "nativeSrc": "6453:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "6453:3:1"
                      },
                      "nativeSrc": "6453:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6453:12:1"
                    },
                    "variableNames": [
                      {
                        "name": "length",
                        "nativeSrc": "6443:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6443:6:1"
                      }
                    ]
                  },
                  {
                    "nativeSrc": "6474:38:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "6474:38:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "data",
                          "nativeSrc": "6504:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "6504:4:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6510:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6510:1:1",
                          "type": "",
                          "value": "1"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nativeSrc": "6500:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "6500:3:1"
                      },
                      "nativeSrc": "6500:12:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6500:12:1"
                    },
                    "variables": [
                      {
                        "name": "outOfPlaceEncoding",
                        "nativeSrc": "6478:18:1",
                        "nodeType": "YulTypedName",
                        "src": "6478:18:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "body": {
                      "nativeSrc": "6551:51:1",
                      "nodeType": "YulBlock",
                      "src": "6551:51:1",
                      "statements": [
                        {
                          "nativeSrc": "6565:27:1",
                          "nodeType": "YulAssignment",
                          "src": "6565:27:1",
                          "value": {
                            "arguments": [
                              {
                                "name": "length",
                                "nativeSrc": "6579:6:1",
                                "nodeType": "YulIdentifier",
                                "src": "6579:6:1"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "6587:4:1",
                                "nodeType": "YulLiteral",
                                "src": "6587:4:1",
                                "type": "",
                                "value": "0x7f"
                              }
                            ],
                            "functionName": {
                              "name": "and",
                              "nativeSrc": "6575:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "6575:3:1"
                            },
                            "nativeSrc": "6575:17:1",
                            "nodeType": "YulFunctionCall",
                            "src": "6575:17:1"
                          },
                          "variableNames": [
                            {
                              "name": "length",
                              "nativeSrc": "6565:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "6565:6:1"
                            }
                          ]
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "outOfPlaceEncoding",
                          "nativeSrc": "6531:18:1",
                          "nodeType": "YulIdentifier",
                          "src": "6531:18:1"
                        }
                      ],
                      "functionName": {
                        "name": "iszero",
                        "nativeSrc": "6524:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6524:6:1"
                      },
                      "nativeSrc": "6524:26:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6524:26:1"
                    },
                    "nativeSrc": "6521:81:1",
                    "nodeType": "YulIf",
                    "src": "6521:81:1"
                  },
                  {
                    "body": {
                      "nativeSrc": "6654:42:1",
                      "nodeType": "YulBlock",
                      "src": "6654:42:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "panic_error_0x22",
                              "nativeSrc": "6668:16:1",
                              "nodeType": "YulIdentifier",
                              "src": "6668:16:1"
                            },
                            "nativeSrc": "6668:18:1",
                            "nodeType": "YulFunctionCall",
                            "src": "6668:18:1"
                          },
                          "nativeSrc": "6668:18:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "6668:18:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "outOfPlaceEncoding",
                          "nativeSrc": "6618:18:1",
                          "nodeType": "YulIdentifier",
                          "src": "6618:18:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "length",
                              "nativeSrc": "6641:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "6641:6:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "6649:2:1",
                              "nodeType": "YulLiteral",
                              "src": "6649:2:1",
                              "type": "",
                              "value": "32"
                            }
                          ],
                          "functionName": {
                            "name": "lt",
                            "nativeSrc": "6638:2:1",
                            "nodeType": "YulIdentifier",
                            "src": "6638:2:1"
                          },
                          "nativeSrc": "6638:14:1",
                          "nodeType": "YulFunctionCall",
                          "src": "6638:14:1"
                        }
                      ],
                      "functionName": {
                        "name": "eq",
                        "nativeSrc": "6615:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "6615:2:1"
                      },
                      "nativeSrc": "6615:38:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6615:38:1"
                    },
                    "nativeSrc": "6612:84:1",
                    "nodeType": "YulIf",
                    "src": "6612:84:1"
                  }
                ]
              },
              "name": "extract_byte_array_length",
              "nativeSrc": "6382:320:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "data",
                  "nativeSrc": "6417:4:1",
                  "nodeType": "YulTypedName",
                  "src": "6417:4:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "length",
                  "nativeSrc": "6426:6:1",
                  "nodeType": "YulTypedName",
                  "src": "6426:6:1",
                  "type": ""
                }
              ],
              "src": "6382:320:1"
            },
            {
              "body": {
                "nativeSrc": "6762:87:1",
                "nodeType": "YulBlock",
                "src": "6762:87:1",
                "statements": [
                  {
                    "nativeSrc": "6772:11:1",
                    "nodeType": "YulAssignment",
                    "src": "6772:11:1",
                    "value": {
                      "name": "ptr",
                      "nativeSrc": "6780:3:1",
                      "nodeType": "YulIdentifier",
                      "src": "6780:3:1"
                    },
                    "variableNames": [
                      {
                        "name": "data",
                        "nativeSrc": "6772:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "6772:4:1"
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "6800:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6800:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "name": "ptr",
                          "nativeSrc": "6803:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "6803:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "mstore",
                        "nativeSrc": "6793:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6793:6:1"
                      },
                      "nativeSrc": "6793:14:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6793:14:1"
                    },
                    "nativeSrc": "6793:14:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "6793:14:1"
                  },
                  {
                    "nativeSrc": "6816:26:1",
                    "nodeType": "YulAssignment",
                    "src": "6816:26:1",
                    "value": {
                      "arguments": [
                        {
                          "kind": "number",
                          "nativeSrc": "6834:1:1",
                          "nodeType": "YulLiteral",
                          "src": "6834:1:1",
                          "type": "",
                          "value": "0"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6837:4:1",
                          "nodeType": "YulLiteral",
                          "src": "6837:4:1",
                          "type": "",
                          "value": "0x20"
                        }
                      ],
                      "functionName": {
                        "name": "keccak256",
                        "nativeSrc": "6824:9:1",
                        "nodeType": "YulIdentifier",
                        "src": "6824:9:1"
                      },
                      "nativeSrc": "6824:18:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6824:18:1"
                    },
                    "variableNames": [
                      {
                        "name": "data",
                        "nativeSrc": "6816:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "6816:4:1"
                      }
                    ]
                  }
                ]
              },
              "name": "array_dataslot_t_string_storage",
              "nativeSrc": "6708:141:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "ptr",
                  "nativeSrc": "6749:3:1",
                  "nodeType": "YulTypedName",
                  "src": "6749:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "data",
                  "nativeSrc": "6757:4:1",
                  "nodeType": "YulTypedName",
                  "src": "6757:4:1",
                  "type": ""
                }
              ],
              "src": "6708:141:1"
            },
            {
              "body": {
                "nativeSrc": "6899:49:1",
                "nodeType": "YulBlock",
                "src": "6899:49:1",
                "statements": [
                  {
                    "nativeSrc": "6909:33:1",
                    "nodeType": "YulAssignment",
                    "src": "6909:33:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "value",
                              "nativeSrc": "6927:5:1",
                              "nodeType": "YulIdentifier",
                              "src": "6927:5:1"
                            },
                            {
                              "kind": "number",
                              "nativeSrc": "6934:2:1",
                              "nodeType": "YulLiteral",
                              "src": "6934:2:1",
                              "type": "",
                              "value": "31"
                            }
                          ],
                          "functionName": {
                            "name": "add",
                            "nativeSrc": "6923:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "6923:3:1"
                          },
                          "nativeSrc": "6923:14:1",
                          "nodeType": "YulFunctionCall",
                          "src": "6923:14:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "6939:2:1",
                          "nodeType": "YulLiteral",
                          "src": "6939:2:1",
                          "type": "",
                          "value": "32"
                        }
                      ],
                      "functionName": {
                        "name": "div",
                        "nativeSrc": "6919:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "6919:3:1"
                      },
                      "nativeSrc": "6919:23:1",
                      "nodeType": "YulFunctionCall",
                      "src": "6919:23:1"
                    },
                    "variableNames": [
                      {
                        "name": "result",
                        "nativeSrc": "6909:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "6909:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "divide_by_32_ceil",
              "nativeSrc": "6855:93:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "6882:5:1",
                  "nodeType": "YulTypedName",
                  "src": "6882:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "result",
                  "nativeSrc": "6892:6:1",
                  "nodeType": "YulTypedName",
                  "src": "6892:6:1",
                  "type": ""
                }
              ],
              "src": "6855:93:1"
            },
            {
              "body": {
                "nativeSrc": "7007:54:1",
                "nodeType": "YulBlock",
                "src": "7007:54:1",
                "statements": [
                  {
                    "nativeSrc": "7017:37:1",
                    "nodeType": "YulAssignment",
                    "src": "7017:37:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "bits",
                          "nativeSrc": "7042:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "7042:4:1"
                        },
                        {
                          "name": "value",
                          "nativeSrc": "7048:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "7048:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "shl",
                        "nativeSrc": "7038:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "7038:3:1"
                      },
                      "nativeSrc": "7038:16:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7038:16:1"
                    },
                    "variableNames": [
                      {
                        "name": "newValue",
                        "nativeSrc": "7017:8:1",
                        "nodeType": "YulIdentifier",
                        "src": "7017:8:1"
                      }
                    ]
                  }
                ]
              },
              "name": "shift_left_dynamic",
              "nativeSrc": "6954:107:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "bits",
                  "nativeSrc": "6982:4:1",
                  "nodeType": "YulTypedName",
                  "src": "6982:4:1",
                  "type": ""
                },
                {
                  "name": "value",
                  "nativeSrc": "6988:5:1",
                  "nodeType": "YulTypedName",
                  "src": "6988:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "newValue",
                  "nativeSrc": "6998:8:1",
                  "nodeType": "YulTypedName",
                  "src": "6998:8:1",
                  "type": ""
                }
              ],
              "src": "6954:107:1"
            },
            {
              "body": {
                "nativeSrc": "7143:317:1",
                "nodeType": "YulBlock",
                "src": "7143:317:1",
                "statements": [
                  {
                    "nativeSrc": "7153:35:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "7153:35:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "shiftBytes",
                          "nativeSrc": "7174:10:1",
                          "nodeType": "YulIdentifier",
                          "src": "7174:10:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "7186:1:1",
                          "nodeType": "YulLiteral",
                          "src": "7186:1:1",
                          "type": "",
                          "value": "8"
                        }
                      ],
                      "functionName": {
                        "name": "mul",
                        "nativeSrc": "7170:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "7170:3:1"
                      },
                      "nativeSrc": "7170:18:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7170:18:1"
                    },
                    "variables": [
                      {
                        "name": "shiftBits",
                        "nativeSrc": "7157:9:1",
                        "nodeType": "YulTypedName",
                        "src": "7157:9:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "7197:109:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "7197:109:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "shiftBits",
                          "nativeSrc": "7228:9:1",
                          "nodeType": "YulIdentifier",
                          "src": "7228:9:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "7239:66:1",
                          "nodeType": "YulLiteral",
                          "src": "7239:66:1",
                          "type": "",
                          "value": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                        }
                      ],
                      "functionName": {
                        "name": "shift_left_dynamic",
                        "nativeSrc": "7209:18:1",
                        "nodeType": "YulIdentifier",
                        "src": "7209:18:1"
                      },
                      "nativeSrc": "7209:97:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7209:97:1"
                    },
                    "variables": [
                      {
                        "name": "mask",
                        "nativeSrc": "7201:4:1",
                        "nodeType": "YulTypedName",
                        "src": "7201:4:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "7315:51:1",
                    "nodeType": "YulAssignment",
                    "src": "7315:51:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "shiftBits",
                          "nativeSrc": "7346:9:1",
                          "nodeType": "YulIdentifier",
                          "src": "7346:9:1"
                        },
                        {
                          "name": "toInsert",
                          "nativeSrc": "7357:8:1",
                          "nodeType": "YulIdentifier",
                          "src": "7357:8:1"
                        }
                      ],
                      "functionName": {
                        "name": "shift_left_dynamic",
                        "nativeSrc": "7327:18:1",
                        "nodeType": "YulIdentifier",
                        "src": "7327:18:1"
                      },
                      "nativeSrc": "7327:39:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7327:39:1"
                    },
                    "variableNames": [
                      {
                        "name": "toInsert",
                        "nativeSrc": "7315:8:1",
                        "nodeType": "YulIdentifier",
                        "src": "7315:8:1"
                      }
                    ]
                  },
                  {
                    "nativeSrc": "7375:30:1",
                    "nodeType": "YulAssignment",
                    "src": "7375:30:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "7388:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "7388:5:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "mask",
                              "nativeSrc": "7399:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "7399:4:1"
                            }
                          ],
                          "functionName": {
                            "name": "not",
                            "nativeSrc": "7395:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "7395:3:1"
                          },
                          "nativeSrc": "7395:9:1",
                          "nodeType": "YulFunctionCall",
                          "src": "7395:9:1"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nativeSrc": "7384:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "7384:3:1"
                      },
                      "nativeSrc": "7384:21:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7384:21:1"
                    },
                    "variableNames": [
                      {
                        "name": "value",
                        "nativeSrc": "7375:5:1",
                        "nodeType": "YulIdentifier",
                        "src": "7375:5:1"
                      }
                    ]
                  },
                  {
                    "nativeSrc": "7414:40:1",
                    "nodeType": "YulAssignment",
                    "src": "7414:40:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value",
                          "nativeSrc": "7427:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "7427:5:1"
                        },
                        {
                          "arguments": [
                            {
                              "name": "toInsert",
                              "nativeSrc": "7438:8:1",
                              "nodeType": "YulIdentifier",
                              "src": "7438:8:1"
                            },
                            {
                              "name": "mask",
                              "nativeSrc": "7448:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "7448:4:1"
                            }
                          ],
                          "functionName": {
                            "name": "and",
                            "nativeSrc": "7434:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "7434:3:1"
                          },
                          "nativeSrc": "7434:19:1",
                          "nodeType": "YulFunctionCall",
                          "src": "7434:19:1"
                        }
                      ],
                      "functionName": {
                        "name": "or",
                        "nativeSrc": "7424:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "7424:2:1"
                      },
                      "nativeSrc": "7424:30:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7424:30:1"
                    },
                    "variableNames": [
                      {
                        "name": "result",
                        "nativeSrc": "7414:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "7414:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "update_byte_slice_dynamic32",
              "nativeSrc": "7067:393:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "7104:5:1",
                  "nodeType": "YulTypedName",
                  "src": "7104:5:1",
                  "type": ""
                },
                {
                  "name": "shiftBytes",
                  "nativeSrc": "7111:10:1",
                  "nodeType": "YulTypedName",
                  "src": "7111:10:1",
                  "type": ""
                },
                {
                  "name": "toInsert",
                  "nativeSrc": "7123:8:1",
                  "nodeType": "YulTypedName",
                  "src": "7123:8:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "result",
                  "nativeSrc": "7136:6:1",
                  "nodeType": "YulTypedName",
                  "src": "7136:6:1",
                  "type": ""
                }
              ],
              "src": "7067:393:1"
            },
            {
              "body": {
                "nativeSrc": "7511:32:1",
                "nodeType": "YulBlock",
                "src": "7511:32:1",
                "statements": [
                  {
                    "nativeSrc": "7521:16:1",
                    "nodeType": "YulAssignment",
                    "src": "7521:16:1",
                    "value": {
                      "name": "value",
                      "nativeSrc": "7532:5:1",
                      "nodeType": "YulIdentifier",
                      "src": "7532:5:1"
                    },
                    "variableNames": [
                      {
                        "name": "cleaned",
                        "nativeSrc": "7521:7:1",
                        "nodeType": "YulIdentifier",
                        "src": "7521:7:1"
                      }
                    ]
                  }
                ]
              },
              "name": "cleanup_t_uint256",
              "nativeSrc": "7466:77:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "7493:5:1",
                  "nodeType": "YulTypedName",
                  "src": "7493:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "cleaned",
                  "nativeSrc": "7503:7:1",
                  "nodeType": "YulTypedName",
                  "src": "7503:7:1",
                  "type": ""
                }
              ],
              "src": "7466:77:1"
            },
            {
              "body": {
                "nativeSrc": "7581:28:1",
                "nodeType": "YulBlock",
                "src": "7581:28:1",
                "statements": [
                  {
                    "nativeSrc": "7591:12:1",
                    "nodeType": "YulAssignment",
                    "src": "7591:12:1",
                    "value": {
                      "name": "value",
                      "nativeSrc": "7598:5:1",
                      "nodeType": "YulIdentifier",
                      "src": "7598:5:1"
                    },
                    "variableNames": [
                      {
                        "name": "ret",
                        "nativeSrc": "7591:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "7591:3:1"
                      }
                    ]
                  }
                ]
              },
              "name": "identity",
              "nativeSrc": "7549:60:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "7567:5:1",
                  "nodeType": "YulTypedName",
                  "src": "7567:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "ret",
                  "nativeSrc": "7577:3:1",
                  "nodeType": "YulTypedName",
                  "src": "7577:3:1",
                  "type": ""
                }
              ],
              "src": "7549:60:1"
            },
            {
              "body": {
                "nativeSrc": "7675:82:1",
                "nodeType": "YulBlock",
                "src": "7675:82:1",
                "statements": [
                  {
                    "nativeSrc": "7685:66:1",
                    "nodeType": "YulAssignment",
                    "src": "7685:66:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "value",
                                  "nativeSrc": "7743:5:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "7743:5:1"
                                }
                              ],
                              "functionName": {
                                "name": "cleanup_t_uint256",
                                "nativeSrc": "7725:17:1",
                                "nodeType": "YulIdentifier",
                                "src": "7725:17:1"
                              },
                              "nativeSrc": "7725:24:1",
                              "nodeType": "YulFunctionCall",
                              "src": "7725:24:1"
                            }
                          ],
                          "functionName": {
                            "name": "identity",
                            "nativeSrc": "7716:8:1",
                            "nodeType": "YulIdentifier",
                            "src": "7716:8:1"
                          },
                          "nativeSrc": "7716:34:1",
                          "nodeType": "YulFunctionCall",
                          "src": "7716:34:1"
                        }
                      ],
                      "functionName": {
                        "name": "cleanup_t_uint256",
                        "nativeSrc": "7698:17:1",
                        "nodeType": "YulIdentifier",
                        "src": "7698:17:1"
                      },
                      "nativeSrc": "7698:53:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7698:53:1"
                    },
                    "variableNames": [
                      {
                        "name": "converted",
                        "nativeSrc": "7685:9:1",
                        "nodeType": "YulIdentifier",
                        "src": "7685:9:1"
                      }
                    ]
                  }
                ]
              },
              "name": "convert_t_uint256_to_t_uint256",
              "nativeSrc": "7615:142:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "7655:5:1",
                  "nodeType": "YulTypedName",
                  "src": "7655:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "converted",
                  "nativeSrc": "7665:9:1",
                  "nodeType": "YulTypedName",
                  "src": "7665:9:1",
                  "type": ""
                }
              ],
              "src": "7615:142:1"
            },
            {
              "body": {
                "nativeSrc": "7810:28:1",
                "nodeType": "YulBlock",
                "src": "7810:28:1",
                "statements": [
                  {
                    "nativeSrc": "7820:12:1",
                    "nodeType": "YulAssignment",
                    "src": "7820:12:1",
                    "value": {
                      "name": "value",
                      "nativeSrc": "7827:5:1",
                      "nodeType": "YulIdentifier",
                      "src": "7827:5:1"
                    },
                    "variableNames": [
                      {
                        "name": "ret",
                        "nativeSrc": "7820:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "7820:3:1"
                      }
                    ]
                  }
                ]
              },
              "name": "prepare_store_t_uint256",
              "nativeSrc": "7763:75:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "value",
                  "nativeSrc": "7796:5:1",
                  "nodeType": "YulTypedName",
                  "src": "7796:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "ret",
                  "nativeSrc": "7806:3:1",
                  "nodeType": "YulTypedName",
                  "src": "7806:3:1",
                  "type": ""
                }
              ],
              "src": "7763:75:1"
            },
            {
              "body": {
                "nativeSrc": "7920:193:1",
                "nodeType": "YulBlock",
                "src": "7920:193:1",
                "statements": [
                  {
                    "nativeSrc": "7930:63:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "7930:63:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "value_0",
                          "nativeSrc": "7985:7:1",
                          "nodeType": "YulIdentifier",
                          "src": "7985:7:1"
                        }
                      ],
                      "functionName": {
                        "name": "convert_t_uint256_to_t_uint256",
                        "nativeSrc": "7954:30:1",
                        "nodeType": "YulIdentifier",
                        "src": "7954:30:1"
                      },
                      "nativeSrc": "7954:39:1",
                      "nodeType": "YulFunctionCall",
                      "src": "7954:39:1"
                    },
                    "variables": [
                      {
                        "name": "convertedValue_0",
                        "nativeSrc": "7934:16:1",
                        "nodeType": "YulTypedName",
                        "src": "7934:16:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "slot",
                          "nativeSrc": "8009:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "8009:4:1"
                        },
                        {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "name": "slot",
                                  "nativeSrc": "8049:4:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "8049:4:1"
                                }
                              ],
                              "functionName": {
                                "name": "sload",
                                "nativeSrc": "8043:5:1",
                                "nodeType": "YulIdentifier",
                                "src": "8043:5:1"
                              },
                              "nativeSrc": "8043:11:1",
                              "nodeType": "YulFunctionCall",
                              "src": "8043:11:1"
                            },
                            {
                              "name": "offset",
                              "nativeSrc": "8056:6:1",
                              "nodeType": "YulIdentifier",
                              "src": "8056:6:1"
                            },
                            {
                              "arguments": [
                                {
                                  "name": "convertedValue_0",
                                  "nativeSrc": "8088:16:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "8088:16:1"
                                }
                              ],
                              "functionName": {
                                "name": "prepare_store_t_uint256",
                                "nativeSrc": "8064:23:1",
                                "nodeType": "YulIdentifier",
                                "src": "8064:23:1"
                              },
                              "nativeSrc": "8064:41:1",
                              "nodeType": "YulFunctionCall",
                              "src": "8064:41:1"
                            }
                          ],
                          "functionName": {
                            "name": "update_byte_slice_dynamic32",
                            "nativeSrc": "8015:27:1",
                            "nodeType": "YulIdentifier",
                            "src": "8015:27:1"
                          },
                          "nativeSrc": "8015:91:1",
                          "nodeType": "YulFunctionCall",
                          "src": "8015:91:1"
                        }
                      ],
                      "functionName": {
                        "name": "sstore",
                        "nativeSrc": "8002:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "8002:6:1"
                      },
                      "nativeSrc": "8002:105:1",
                      "nodeType": "YulFunctionCall",
                      "src": "8002:105:1"
                    },
                    "nativeSrc": "8002:105:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "8002:105:1"
                  }
                ]
              },
              "name": "update_storage_value_t_uint256_to_t_uint256",
              "nativeSrc": "7844:269:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "slot",
                  "nativeSrc": "7897:4:1",
                  "nodeType": "YulTypedName",
                  "src": "7897:4:1",
                  "type": ""
                },
                {
                  "name": "offset",
                  "nativeSrc": "7903:6:1",
                  "nodeType": "YulTypedName",
                  "src": "7903:6:1",
                  "type": ""
                },
                {
                  "name": "value_0",
                  "nativeSrc": "7911:7:1",
                  "nodeType": "YulTypedName",
                  "src": "7911:7:1",
                  "type": ""
                }
              ],
              "src": "7844:269:1"
            },
            {
              "body": {
                "nativeSrc": "8168:24:1",
                "nodeType": "YulBlock",
                "src": "8168:24:1",
                "statements": [
                  {
                    "nativeSrc": "8178:8:1",
                    "nodeType": "YulAssignment",
                    "src": "8178:8:1",
                    "value": {
                      "kind": "number",
                      "nativeSrc": "8185:1:1",
                      "nodeType": "YulLiteral",
                      "src": "8185:1:1",
                      "type": "",
                      "value": "0"
                    },
                    "variableNames": [
                      {
                        "name": "ret",
                        "nativeSrc": "8178:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "8178:3:1"
                      }
                    ]
                  }
                ]
              },
              "name": "zero_value_for_split_t_uint256",
              "nativeSrc": "8119:73:1",
              "nodeType": "YulFunctionDefinition",
              "returnVariables": [
                {
                  "name": "ret",
                  "nativeSrc": "8164:3:1",
                  "nodeType": "YulTypedName",
                  "src": "8164:3:1",
                  "type": ""
                }
              ],
              "src": "8119:73:1"
            },
            {
              "body": {
                "nativeSrc": "8251:136:1",
                "nodeType": "YulBlock",
                "src": "8251:136:1",
                "statements": [
                  {
                    "nativeSrc": "8261:46:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "8261:46:1",
                    "value": {
                      "arguments": [],
                      "functionName": {
                        "name": "zero_value_for_split_t_uint256",
                        "nativeSrc": "8275:30:1",
                        "nodeType": "YulIdentifier",
                        "src": "8275:30:1"
                      },
                      "nativeSrc": "8275:32:1",
                      "nodeType": "YulFunctionCall",
                      "src": "8275:32:1"
                    },
                    "variables": [
                      {
                        "name": "zero_0",
                        "nativeSrc": "8265:6:1",
                        "nodeType": "YulTypedName",
                        "src": "8265:6:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "slot",
                          "nativeSrc": "8360:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "8360:4:1"
                        },
                        {
                          "name": "offset",
                          "nativeSrc": "8366:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "8366:6:1"
                        },
                        {
                          "name": "zero_0",
                          "nativeSrc": "8374:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "8374:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "update_storage_value_t_uint256_to_t_uint256",
                        "nativeSrc": "8316:43:1",
                        "nodeType": "YulIdentifier",
                        "src": "8316:43:1"
                      },
                      "nativeSrc": "8316:65:1",
                      "nodeType": "YulFunctionCall",
                      "src": "8316:65:1"
                    },
                    "nativeSrc": "8316:65:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "8316:65:1"
                  }
                ]
              },
              "name": "storage_set_to_zero_t_uint256",
              "nativeSrc": "8198:189:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "slot",
                  "nativeSrc": "8237:4:1",
                  "nodeType": "YulTypedName",
                  "src": "8237:4:1",
                  "type": ""
                },
                {
                  "name": "offset",
                  "nativeSrc": "8243:6:1",
                  "nodeType": "YulTypedName",
                  "src": "8243:6:1",
                  "type": ""
                }
              ],
              "src": "8198:189:1"
            },
            {
              "body": {
                "nativeSrc": "8443:136:1",
                "nodeType": "YulBlock",
                "src": "8443:136:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "8510:63:1",
                      "nodeType": "YulBlock",
                      "src": "8510:63:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [
                              {
                                "name": "start",
                                "nativeSrc": "8554:5:1",
                                "nodeType": "YulIdentifier",
                                "src": "8554:5:1"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "8561:1:1",
                                "nodeType": "YulLiteral",
                                "src": "8561:1:1",
                                "type": "",
                                "value": "0"
                              }
                            ],
                            "functionName": {
                              "name": "storage_set_to_zero_t_uint256",
                              "nativeSrc": "8524:29:1",
                              "nodeType": "YulIdentifier",
                              "src": "8524:29:1"
                            },
                            "nativeSrc": "8524:39:1",
                            "nodeType": "YulFunctionCall",
                            "src": "8524:39:1"
                          },
                          "nativeSrc": "8524:39:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "8524:39:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "start",
                          "nativeSrc": "8463:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "8463:5:1"
                        },
                        {
                          "name": "end",
                          "nativeSrc": "8470:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "8470:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "lt",
                        "nativeSrc": "8460:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "8460:2:1"
                      },
                      "nativeSrc": "8460:14:1",
                      "nodeType": "YulFunctionCall",
                      "src": "8460:14:1"
                    },
                    "nativeSrc": "8453:120:1",
                    "nodeType": "YulForLoop",
                    "post": {
                      "nativeSrc": "8475:26:1",
                      "nodeType": "YulBlock",
                      "src": "8475:26:1",
                      "statements": [
                        {
                          "nativeSrc": "8477:22:1",
                          "nodeType": "YulAssignment",
                          "src": "8477:22:1",
                          "value": {
                            "arguments": [
                              {
                                "name": "start",
                                "nativeSrc": "8490:5:1",
                                "nodeType": "YulIdentifier",
                                "src": "8490:5:1"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "8497:1:1",
                                "nodeType": "YulLiteral",
                                "src": "8497:1:1",
                                "type": "",
                                "value": "1"
                              }
                            ],
                            "functionName": {
                              "name": "add",
                              "nativeSrc": "8486:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "8486:3:1"
                            },
                            "nativeSrc": "8486:13:1",
                            "nodeType": "YulFunctionCall",
                            "src": "8486:13:1"
                          },
                          "variableNames": [
                            {
                              "name": "start",
                              "nativeSrc": "8477:5:1",
                              "nodeType": "YulIdentifier",
                              "src": "8477:5:1"
                            }
                          ]
                        }
                      ]
                    },
                    "pre": {
                      "nativeSrc": "8457:2:1",
                      "nodeType": "YulBlock",
                      "src": "8457:2:1",
                      "statements": []
                    },
                    "src": "8453:120:1"
                  }
                ]
              },
              "name": "clear_storage_range_t_bytes1",
              "nativeSrc": "8393:186:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "start",
                  "nativeSrc": "8431:5:1",
                  "nodeType": "YulTypedName",
                  "src": "8431:5:1",
                  "type": ""
                },
                {
                  "name": "end",
                  "nativeSrc": "8438:3:1",
                  "nodeType": "YulTypedName",
                  "src": "8438:3:1",
                  "type": ""
                }
              ],
              "src": "8393:186:1"
            },
            {
              "body": {
                "nativeSrc": "8664:464:1",
                "nodeType": "YulBlock",
                "src": "8664:464:1",
                "statements": [
                  {
                    "body": {
                      "nativeSrc": "8690:431:1",
                      "nodeType": "YulBlock",
                      "src": "8690:431:1",
                      "statements": [
                        {
                          "nativeSrc": "8704:54:1",
                          "nodeType": "YulVariableDeclaration",
                          "src": "8704:54:1",
                          "value": {
                            "arguments": [
                              {
                                "name": "array",
                                "nativeSrc": "8752:5:1",
                                "nodeType": "YulIdentifier",
                                "src": "8752:5:1"
                              }
                            ],
                            "functionName": {
                              "name": "array_dataslot_t_string_storage",
                              "nativeSrc": "8720:31:1",
                              "nodeType": "YulIdentifier",
                              "src": "8720:31:1"
                            },
                            "nativeSrc": "8720:38:1",
                            "nodeType": "YulFunctionCall",
                            "src": "8720:38:1"
                          },
                          "variables": [
                            {
                              "name": "dataArea",
                              "nativeSrc": "8708:8:1",
                              "nodeType": "YulTypedName",
                              "src": "8708:8:1",
                              "type": ""
                            }
                          ]
                        },
                        {
                          "nativeSrc": "8771:63:1",
                          "nodeType": "YulVariableDeclaration",
                          "src": "8771:63:1",
                          "value": {
                            "arguments": [
                              {
                                "name": "dataArea",
                                "nativeSrc": "8794:8:1",
                                "nodeType": "YulIdentifier",
                                "src": "8794:8:1"
                              },
                              {
                                "arguments": [
                                  {
                                    "name": "startIndex",
                                    "nativeSrc": "8822:10:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "8822:10:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "divide_by_32_ceil",
                                  "nativeSrc": "8804:17:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "8804:17:1"
                                },
                                "nativeSrc": "8804:29:1",
                                "nodeType": "YulFunctionCall",
                                "src": "8804:29:1"
                              }
                            ],
                            "functionName": {
                              "name": "add",
                              "nativeSrc": "8790:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "8790:3:1"
                            },
                            "nativeSrc": "8790:44:1",
                            "nodeType": "YulFunctionCall",
                            "src": "8790:44:1"
                          },
                          "variables": [
                            {
                              "name": "deleteStart",
                              "nativeSrc": "8775:11:1",
                              "nodeType": "YulTypedName",
                              "src": "8775:11:1",
                              "type": ""
                            }
                          ]
                        },
                        {
                          "body": {
                            "nativeSrc": "8991:27:1",
                            "nodeType": "YulBlock",
                            "src": "8991:27:1",
                            "statements": [
                              {
                                "nativeSrc": "8993:23:1",
                                "nodeType": "YulAssignment",
                                "src": "8993:23:1",
                                "value": {
                                  "name": "dataArea",
                                  "nativeSrc": "9008:8:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "9008:8:1"
                                },
                                "variableNames": [
                                  {
                                    "name": "deleteStart",
                                    "nativeSrc": "8993:11:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "8993:11:1"
                                  }
                                ]
                              }
                            ]
                          },
                          "condition": {
                            "arguments": [
                              {
                                "name": "startIndex",
                                "nativeSrc": "8975:10:1",
                                "nodeType": "YulIdentifier",
                                "src": "8975:10:1"
                              },
                              {
                                "kind": "number",
                                "nativeSrc": "8987:2:1",
                                "nodeType": "YulLiteral",
                                "src": "8987:2:1",
                                "type": "",
                                "value": "32"
                              }
                            ],
                            "functionName": {
                              "name": "lt",
                              "nativeSrc": "8972:2:1",
                              "nodeType": "YulIdentifier",
                              "src": "8972:2:1"
                            },
                            "nativeSrc": "8972:18:1",
                            "nodeType": "YulFunctionCall",
                            "src": "8972:18:1"
                          },
                          "nativeSrc": "8969:49:1",
                          "nodeType": "YulIf",
                          "src": "8969:49:1"
                        },
                        {
                          "expression": {
                            "arguments": [
                              {
                                "name": "deleteStart",
                                "nativeSrc": "9060:11:1",
                                "nodeType": "YulIdentifier",
                                "src": "9060:11:1"
                              },
                              {
                                "arguments": [
                                  {
                                    "name": "dataArea",
                                    "nativeSrc": "9077:8:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "9077:8:1"
                                  },
                                  {
                                    "arguments": [
                                      {
                                        "name": "len",
                                        "nativeSrc": "9105:3:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "9105:3:1"
                                      }
                                    ],
                                    "functionName": {
                                      "name": "divide_by_32_ceil",
                                      "nativeSrc": "9087:17:1",
                                      "nodeType": "YulIdentifier",
                                      "src": "9087:17:1"
                                    },
                                    "nativeSrc": "9087:22:1",
                                    "nodeType": "YulFunctionCall",
                                    "src": "9087:22:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "add",
                                  "nativeSrc": "9073:3:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "9073:3:1"
                                },
                                "nativeSrc": "9073:37:1",
                                "nodeType": "YulFunctionCall",
                                "src": "9073:37:1"
                              }
                            ],
                            "functionName": {
                              "name": "clear_storage_range_t_bytes1",
                              "nativeSrc": "9031:28:1",
                              "nodeType": "YulIdentifier",
                              "src": "9031:28:1"
                            },
                            "nativeSrc": "9031:80:1",
                            "nodeType": "YulFunctionCall",
                            "src": "9031:80:1"
                          },
                          "nativeSrc": "9031:80:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "9031:80:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "len",
                          "nativeSrc": "8681:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "8681:3:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "8686:2:1",
                          "nodeType": "YulLiteral",
                          "src": "8686:2:1",
                          "type": "",
                          "value": "31"
                        }
                      ],
                      "functionName": {
                        "name": "gt",
                        "nativeSrc": "8678:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "8678:2:1"
                      },
                      "nativeSrc": "8678:11:1",
                      "nodeType": "YulFunctionCall",
                      "src": "8678:11:1"
                    },
                    "nativeSrc": "8675:446:1",
                    "nodeType": "YulIf",
                    "src": "8675:446:1"
                  }
                ]
              },
              "name": "clean_up_bytearray_end_slots_t_string_storage",
              "nativeSrc": "8585:543:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "array",
                  "nativeSrc": "8640:5:1",
                  "nodeType": "YulTypedName",
                  "src": "8640:5:1",
                  "type": ""
                },
                {
                  "name": "len",
                  "nativeSrc": "8647:3:1",
                  "nodeType": "YulTypedName",
                  "src": "8647:3:1",
                  "type": ""
                },
                {
                  "name": "startIndex",
                  "nativeSrc": "8652:10:1",
                  "nodeType": "YulTypedName",
                  "src": "8652:10:1",
                  "type": ""
                }
              ],
              "src": "8585:543:1"
            },
            {
              "body": {
                "nativeSrc": "9197:54:1",
                "nodeType": "YulBlock",
                "src": "9197:54:1",
                "statements": [
                  {
                    "nativeSrc": "9207:37:1",
                    "nodeType": "YulAssignment",
                    "src": "9207:37:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "bits",
                          "nativeSrc": "9232:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "9232:4:1"
                        },
                        {
                          "name": "value",
                          "nativeSrc": "9238:5:1",
                          "nodeType": "YulIdentifier",
                          "src": "9238:5:1"
                        }
                      ],
                      "functionName": {
                        "name": "shr",
                        "nativeSrc": "9228:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "9228:3:1"
                      },
                      "nativeSrc": "9228:16:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9228:16:1"
                    },
                    "variableNames": [
                      {
                        "name": "newValue",
                        "nativeSrc": "9207:8:1",
                        "nodeType": "YulIdentifier",
                        "src": "9207:8:1"
                      }
                    ]
                  }
                ]
              },
              "name": "shift_right_unsigned_dynamic",
              "nativeSrc": "9134:117:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "bits",
                  "nativeSrc": "9172:4:1",
                  "nodeType": "YulTypedName",
                  "src": "9172:4:1",
                  "type": ""
                },
                {
                  "name": "value",
                  "nativeSrc": "9178:5:1",
                  "nodeType": "YulTypedName",
                  "src": "9178:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "newValue",
                  "nativeSrc": "9188:8:1",
                  "nodeType": "YulTypedName",
                  "src": "9188:8:1",
                  "type": ""
                }
              ],
              "src": "9134:117:1"
            },
            {
              "body": {
                "nativeSrc": "9308:118:1",
                "nodeType": "YulBlock",
                "src": "9308:118:1",
                "statements": [
                  {
                    "nativeSrc": "9318:68:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "9318:68:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "arguments": [
                                {
                                  "kind": "number",
                                  "nativeSrc": "9367:1:1",
                                  "nodeType": "YulLiteral",
                                  "src": "9367:1:1",
                                  "type": "",
                                  "value": "8"
                                },
                                {
                                  "name": "bytes",
                                  "nativeSrc": "9370:5:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "9370:5:1"
                                }
                              ],
                              "functionName": {
                                "name": "mul",
                                "nativeSrc": "9363:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "9363:3:1"
                              },
                              "nativeSrc": "9363:13:1",
                              "nodeType": "YulFunctionCall",
                              "src": "9363:13:1"
                            },
                            {
                              "arguments": [
                                {
                                  "kind": "number",
                                  "nativeSrc": "9382:1:1",
                                  "nodeType": "YulLiteral",
                                  "src": "9382:1:1",
                                  "type": "",
                                  "value": "0"
                                }
                              ],
                              "functionName": {
                                "name": "not",
                                "nativeSrc": "9378:3:1",
                                "nodeType": "YulIdentifier",
                                "src": "9378:3:1"
                              },
                              "nativeSrc": "9378:6:1",
                              "nodeType": "YulFunctionCall",
                              "src": "9378:6:1"
                            }
                          ],
                          "functionName": {
                            "name": "shift_right_unsigned_dynamic",
                            "nativeSrc": "9334:28:1",
                            "nodeType": "YulIdentifier",
                            "src": "9334:28:1"
                          },
                          "nativeSrc": "9334:51:1",
                          "nodeType": "YulFunctionCall",
                          "src": "9334:51:1"
                        }
                      ],
                      "functionName": {
                        "name": "not",
                        "nativeSrc": "9330:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "9330:3:1"
                      },
                      "nativeSrc": "9330:56:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9330:56:1"
                    },
                    "variables": [
                      {
                        "name": "mask",
                        "nativeSrc": "9322:4:1",
                        "nodeType": "YulTypedName",
                        "src": "9322:4:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "9395:25:1",
                    "nodeType": "YulAssignment",
                    "src": "9395:25:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "data",
                          "nativeSrc": "9409:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "9409:4:1"
                        },
                        {
                          "name": "mask",
                          "nativeSrc": "9415:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "9415:4:1"
                        }
                      ],
                      "functionName": {
                        "name": "and",
                        "nativeSrc": "9405:3:1",
                        "nodeType": "YulIdentifier",
                        "src": "9405:3:1"
                      },
                      "nativeSrc": "9405:15:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9405:15:1"
                    },
                    "variableNames": [
                      {
                        "name": "result",
                        "nativeSrc": "9395:6:1",
                        "nodeType": "YulIdentifier",
                        "src": "9395:6:1"
                      }
                    ]
                  }
                ]
              },
              "name": "mask_bytes_dynamic",
              "nativeSrc": "9257:169:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "data",
                  "nativeSrc": "9285:4:1",
                  "nodeType": "YulTypedName",
                  "src": "9285:4:1",
                  "type": ""
                },
                {
                  "name": "bytes",
                  "nativeSrc": "9291:5:1",
                  "nodeType": "YulTypedName",
                  "src": "9291:5:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "result",
                  "nativeSrc": "9301:6:1",
                  "nodeType": "YulTypedName",
                  "src": "9301:6:1",
                  "type": ""
                }
              ],
              "src": "9257:169:1"
            },
            {
              "body": {
                "nativeSrc": "9512:214:1",
                "nodeType": "YulBlock",
                "src": "9512:214:1",
                "statements": [
                  {
                    "nativeSrc": "9645:37:1",
                    "nodeType": "YulAssignment",
                    "src": "9645:37:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "data",
                          "nativeSrc": "9672:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "9672:4:1"
                        },
                        {
                          "name": "len",
                          "nativeSrc": "9678:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "9678:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "mask_bytes_dynamic",
                        "nativeSrc": "9653:18:1",
                        "nodeType": "YulIdentifier",
                        "src": "9653:18:1"
                      },
                      "nativeSrc": "9653:29:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9653:29:1"
                    },
                    "variableNames": [
                      {
                        "name": "data",
                        "nativeSrc": "9645:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "9645:4:1"
                      }
                    ]
                  },
                  {
                    "nativeSrc": "9691:29:1",
                    "nodeType": "YulAssignment",
                    "src": "9691:29:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "data",
                          "nativeSrc": "9702:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "9702:4:1"
                        },
                        {
                          "arguments": [
                            {
                              "kind": "number",
                              "nativeSrc": "9712:1:1",
                              "nodeType": "YulLiteral",
                              "src": "9712:1:1",
                              "type": "",
                              "value": "2"
                            },
                            {
                              "name": "len",
                              "nativeSrc": "9715:3:1",
                              "nodeType": "YulIdentifier",
                              "src": "9715:3:1"
                            }
                          ],
                          "functionName": {
                            "name": "mul",
                            "nativeSrc": "9708:3:1",
                            "nodeType": "YulIdentifier",
                            "src": "9708:3:1"
                          },
                          "nativeSrc": "9708:11:1",
                          "nodeType": "YulFunctionCall",
                          "src": "9708:11:1"
                        }
                      ],
                      "functionName": {
                        "name": "or",
                        "nativeSrc": "9699:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "9699:2:1"
                      },
                      "nativeSrc": "9699:21:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9699:21:1"
                    },
                    "variableNames": [
                      {
                        "name": "used",
                        "nativeSrc": "9691:4:1",
                        "nodeType": "YulIdentifier",
                        "src": "9691:4:1"
                      }
                    ]
                  }
                ]
              },
              "name": "extract_used_part_and_set_length_of_short_byte_array",
              "nativeSrc": "9431:295:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "data",
                  "nativeSrc": "9493:4:1",
                  "nodeType": "YulTypedName",
                  "src": "9493:4:1",
                  "type": ""
                },
                {
                  "name": "len",
                  "nativeSrc": "9499:3:1",
                  "nodeType": "YulTypedName",
                  "src": "9499:3:1",
                  "type": ""
                }
              ],
              "returnVariables": [
                {
                  "name": "used",
                  "nativeSrc": "9507:4:1",
                  "nodeType": "YulTypedName",
                  "src": "9507:4:1",
                  "type": ""
                }
              ],
              "src": "9431:295:1"
            },
            {
              "body": {
                "nativeSrc": "9823:1303:1",
                "nodeType": "YulBlock",
                "src": "9823:1303:1",
                "statements": [
                  {
                    "nativeSrc": "9834:51:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "9834:51:1",
                    "value": {
                      "arguments": [
                        {
                          "name": "src",
                          "nativeSrc": "9881:3:1",
                          "nodeType": "YulIdentifier",
                          "src": "9881:3:1"
                        }
                      ],
                      "functionName": {
                        "name": "array_length_t_string_memory_ptr",
                        "nativeSrc": "9848:32:1",
                        "nodeType": "YulIdentifier",
                        "src": "9848:32:1"
                      },
                      "nativeSrc": "9848:37:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9848:37:1"
                    },
                    "variables": [
                      {
                        "name": "newLen",
                        "nativeSrc": "9838:6:1",
                        "nodeType": "YulTypedName",
                        "src": "9838:6:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "body": {
                      "nativeSrc": "9970:22:1",
                      "nodeType": "YulBlock",
                      "src": "9970:22:1",
                      "statements": [
                        {
                          "expression": {
                            "arguments": [],
                            "functionName": {
                              "name": "panic_error_0x41",
                              "nativeSrc": "9972:16:1",
                              "nodeType": "YulIdentifier",
                              "src": "9972:16:1"
                            },
                            "nativeSrc": "9972:18:1",
                            "nodeType": "YulFunctionCall",
                            "src": "9972:18:1"
                          },
                          "nativeSrc": "9972:18:1",
                          "nodeType": "YulExpressionStatement",
                          "src": "9972:18:1"
                        }
                      ]
                    },
                    "condition": {
                      "arguments": [
                        {
                          "name": "newLen",
                          "nativeSrc": "9942:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "9942:6:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "9950:18:1",
                          "nodeType": "YulLiteral",
                          "src": "9950:18:1",
                          "type": "",
                          "value": "0xffffffffffffffff"
                        }
                      ],
                      "functionName": {
                        "name": "gt",
                        "nativeSrc": "9939:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "9939:2:1"
                      },
                      "nativeSrc": "9939:30:1",
                      "nodeType": "YulFunctionCall",
                      "src": "9939:30:1"
                    },
                    "nativeSrc": "9936:56:1",
                    "nodeType": "YulIf",
                    "src": "9936:56:1"
                  },
                  {
                    "nativeSrc": "10002:52:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "10002:52:1",
                    "value": {
                      "arguments": [
                        {
                          "arguments": [
                            {
                              "name": "slot",
                              "nativeSrc": "10048:4:1",
                              "nodeType": "YulIdentifier",
                              "src": "10048:4:1"
                            }
                          ],
                          "functionName": {
                            "name": "sload",
                            "nativeSrc": "10042:5:1",
                            "nodeType": "YulIdentifier",
                            "src": "10042:5:1"
                          },
                          "nativeSrc": "10042:11:1",
                          "nodeType": "YulFunctionCall",
                          "src": "10042:11:1"
                        }
                      ],
                      "functionName": {
                        "name": "extract_byte_array_length",
                        "nativeSrc": "10016:25:1",
                        "nodeType": "YulIdentifier",
                        "src": "10016:25:1"
                      },
                      "nativeSrc": "10016:38:1",
                      "nodeType": "YulFunctionCall",
                      "src": "10016:38:1"
                    },
                    "variables": [
                      {
                        "name": "oldLen",
                        "nativeSrc": "10006:6:1",
                        "nodeType": "YulTypedName",
                        "src": "10006:6:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "expression": {
                      "arguments": [
                        {
                          "name": "slot",
                          "nativeSrc": "10147:4:1",
                          "nodeType": "YulIdentifier",
                          "src": "10147:4:1"
                        },
                        {
                          "name": "oldLen",
                          "nativeSrc": "10153:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "10153:6:1"
                        },
                        {
                          "name": "newLen",
                          "nativeSrc": "10161:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "10161:6:1"
                        }
                      ],
                      "functionName": {
                        "name": "clean_up_bytearray_end_slots_t_string_storage",
                        "nativeSrc": "10101:45:1",
                        "nodeType": "YulIdentifier",
                        "src": "10101:45:1"
                      },
                      "nativeSrc": "10101:67:1",
                      "nodeType": "YulFunctionCall",
                      "src": "10101:67:1"
                    },
                    "nativeSrc": "10101:67:1",
                    "nodeType": "YulExpressionStatement",
                    "src": "10101:67:1"
                  },
                  {
                    "nativeSrc": "10178:18:1",
                    "nodeType": "YulVariableDeclaration",
                    "src": "10178:18:1",
                    "value": {
                      "kind": "number",
                      "nativeSrc": "10195:1:1",
                      "nodeType": "YulLiteral",
                      "src": "10195:1:1",
                      "type": "",
                      "value": "0"
                    },
                    "variables": [
                      {
                        "name": "srcOffset",
                        "nativeSrc": "10182:9:1",
                        "nodeType": "YulTypedName",
                        "src": "10182:9:1",
                        "type": ""
                      }
                    ]
                  },
                  {
                    "nativeSrc": "10206:17:1",
                    "nodeType": "YulAssignment",
                    "src": "10206:17:1",
                    "value": {
                      "kind": "number",
                      "nativeSrc": "10219:4:1",
                      "nodeType": "YulLiteral",
                      "src": "10219:4:1",
                      "type": "",
                      "value": "0x20"
                    },
                    "variableNames": [
                      {
                        "name": "srcOffset",
                        "nativeSrc": "10206:9:1",
                        "nodeType": "YulIdentifier",
                        "src": "10206:9:1"
                      }
                    ]
                  },
                  {
                    "cases": [
                      {
                        "body": {
                          "nativeSrc": "10270:611:1",
                          "nodeType": "YulBlock",
                          "src": "10270:611:1",
                          "statements": [
                            {
                              "nativeSrc": "10284:37:1",
                              "nodeType": "YulVariableDeclaration",
                              "src": "10284:37:1",
                              "value": {
                                "arguments": [
                                  {
                                    "name": "newLen",
                                    "nativeSrc": "10303:6:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10303:6:1"
                                  },
                                  {
                                    "arguments": [
                                      {
                                        "kind": "number",
                                        "nativeSrc": "10315:4:1",
                                        "nodeType": "YulLiteral",
                                        "src": "10315:4:1",
                                        "type": "",
                                        "value": "0x1f"
                                      }
                                    ],
                                    "functionName": {
                                      "name": "not",
                                      "nativeSrc": "10311:3:1",
                                      "nodeType": "YulIdentifier",
                                      "src": "10311:3:1"
                                    },
                                    "nativeSrc": "10311:9:1",
                                    "nodeType": "YulFunctionCall",
                                    "src": "10311:9:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "and",
                                  "nativeSrc": "10299:3:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "10299:3:1"
                                },
                                "nativeSrc": "10299:22:1",
                                "nodeType": "YulFunctionCall",
                                "src": "10299:22:1"
                              },
                              "variables": [
                                {
                                  "name": "loopEnd",
                                  "nativeSrc": "10288:7:1",
                                  "nodeType": "YulTypedName",
                                  "src": "10288:7:1",
                                  "type": ""
                                }
                              ]
                            },
                            {
                              "nativeSrc": "10335:51:1",
                              "nodeType": "YulVariableDeclaration",
                              "src": "10335:51:1",
                              "value": {
                                "arguments": [
                                  {
                                    "name": "slot",
                                    "nativeSrc": "10381:4:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10381:4:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "array_dataslot_t_string_storage",
                                  "nativeSrc": "10349:31:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "10349:31:1"
                                },
                                "nativeSrc": "10349:37:1",
                                "nodeType": "YulFunctionCall",
                                "src": "10349:37:1"
                              },
                              "variables": [
                                {
                                  "name": "dstPtr",
                                  "nativeSrc": "10339:6:1",
                                  "nodeType": "YulTypedName",
                                  "src": "10339:6:1",
                                  "type": ""
                                }
                              ]
                            },
                            {
                              "nativeSrc": "10399:10:1",
                              "nodeType": "YulVariableDeclaration",
                              "src": "10399:10:1",
                              "value": {
                                "kind": "number",
                                "nativeSrc": "10408:1:1",
                                "nodeType": "YulLiteral",
                                "src": "10408:1:1",
                                "type": "",
                                "value": "0"
                              },
                              "variables": [
                                {
                                  "name": "i",
                                  "nativeSrc": "10403:1:1",
                                  "nodeType": "YulTypedName",
                                  "src": "10403:1:1",
                                  "type": ""
                                }
                              ]
                            },
                            {
                              "body": {
                                "nativeSrc": "10467:163:1",
                                "nodeType": "YulBlock",
                                "src": "10467:163:1",
                                "statements": [
                                  {
                                    "expression": {
                                      "arguments": [
                                        {
                                          "name": "dstPtr",
                                          "nativeSrc": "10492:6:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10492:6:1"
                                        },
                                        {
                                          "arguments": [
                                            {
                                              "arguments": [
                                                {
                                                  "name": "src",
                                                  "nativeSrc": "10510:3:1",
                                                  "nodeType": "YulIdentifier",
                                                  "src": "10510:3:1"
                                                },
                                                {
                                                  "name": "srcOffset",
                                                  "nativeSrc": "10515:9:1",
                                                  "nodeType": "YulIdentifier",
                                                  "src": "10515:9:1"
                                                }
                                              ],
                                              "functionName": {
                                                "name": "add",
                                                "nativeSrc": "10506:3:1",
                                                "nodeType": "YulIdentifier",
                                                "src": "10506:3:1"
                                              },
                                              "nativeSrc": "10506:19:1",
                                              "nodeType": "YulFunctionCall",
                                              "src": "10506:19:1"
                                            }
                                          ],
                                          "functionName": {
                                            "name": "mload",
                                            "nativeSrc": "10500:5:1",
                                            "nodeType": "YulIdentifier",
                                            "src": "10500:5:1"
                                          },
                                          "nativeSrc": "10500:26:1",
                                          "nodeType": "YulFunctionCall",
                                          "src": "10500:26:1"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "sstore",
                                        "nativeSrc": "10485:6:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10485:6:1"
                                      },
                                      "nativeSrc": "10485:42:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10485:42:1"
                                    },
                                    "nativeSrc": "10485:42:1",
                                    "nodeType": "YulExpressionStatement",
                                    "src": "10485:42:1"
                                  },
                                  {
                                    "nativeSrc": "10544:24:1",
                                    "nodeType": "YulAssignment",
                                    "src": "10544:24:1",
                                    "value": {
                                      "arguments": [
                                        {
                                          "name": "dstPtr",
                                          "nativeSrc": "10558:6:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10558:6:1"
                                        },
                                        {
                                          "kind": "number",
                                          "nativeSrc": "10566:1:1",
                                          "nodeType": "YulLiteral",
                                          "src": "10566:1:1",
                                          "type": "",
                                          "value": "1"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "add",
                                        "nativeSrc": "10554:3:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10554:3:1"
                                      },
                                      "nativeSrc": "10554:14:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10554:14:1"
                                    },
                                    "variableNames": [
                                      {
                                        "name": "dstPtr",
                                        "nativeSrc": "10544:6:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10544:6:1"
                                      }
                                    ]
                                  },
                                  {
                                    "nativeSrc": "10585:31:1",
                                    "nodeType": "YulAssignment",
                                    "src": "10585:31:1",
                                    "value": {
                                      "arguments": [
                                        {
                                          "name": "srcOffset",
                                          "nativeSrc": "10602:9:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10602:9:1"
                                        },
                                        {
                                          "kind": "number",
                                          "nativeSrc": "10613:2:1",
                                          "nodeType": "YulLiteral",
                                          "src": "10613:2:1",
                                          "type": "",
                                          "value": "32"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "add",
                                        "nativeSrc": "10598:3:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10598:3:1"
                                      },
                                      "nativeSrc": "10598:18:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10598:18:1"
                                    },
                                    "variableNames": [
                                      {
                                        "name": "srcOffset",
                                        "nativeSrc": "10585:9:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10585:9:1"
                                      }
                                    ]
                                  }
                                ]
                              },
                              "condition": {
                                "arguments": [
                                  {
                                    "name": "i",
                                    "nativeSrc": "10433:1:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10433:1:1"
                                  },
                                  {
                                    "name": "loopEnd",
                                    "nativeSrc": "10436:7:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10436:7:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "lt",
                                  "nativeSrc": "10430:2:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "10430:2:1"
                                },
                                "nativeSrc": "10430:14:1",
                                "nodeType": "YulFunctionCall",
                                "src": "10430:14:1"
                              },
                              "nativeSrc": "10422:208:1",
                              "nodeType": "YulForLoop",
                              "post": {
                                "nativeSrc": "10445:21:1",
                                "nodeType": "YulBlock",
                                "src": "10445:21:1",
                                "statements": [
                                  {
                                    "nativeSrc": "10447:17:1",
                                    "nodeType": "YulAssignment",
                                    "src": "10447:17:1",
                                    "value": {
                                      "arguments": [
                                        {
                                          "name": "i",
                                          "nativeSrc": "10456:1:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10456:1:1"
                                        },
                                        {
                                          "kind": "number",
                                          "nativeSrc": "10459:4:1",
                                          "nodeType": "YulLiteral",
                                          "src": "10459:4:1",
                                          "type": "",
                                          "value": "0x20"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "add",
                                        "nativeSrc": "10452:3:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10452:3:1"
                                      },
                                      "nativeSrc": "10452:12:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10452:12:1"
                                    },
                                    "variableNames": [
                                      {
                                        "name": "i",
                                        "nativeSrc": "10447:1:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10447:1:1"
                                      }
                                    ]
                                  }
                                ]
                              },
                              "pre": {
                                "nativeSrc": "10426:3:1",
                                "nodeType": "YulBlock",
                                "src": "10426:3:1",
                                "statements": []
                              },
                              "src": "10422:208:1"
                            },
                            {
                              "body": {
                                "nativeSrc": "10666:156:1",
                                "nodeType": "YulBlock",
                                "src": "10666:156:1",
                                "statements": [
                                  {
                                    "nativeSrc": "10684:43:1",
                                    "nodeType": "YulVariableDeclaration",
                                    "src": "10684:43:1",
                                    "value": {
                                      "arguments": [
                                        {
                                          "arguments": [
                                            {
                                              "name": "src",
                                              "nativeSrc": "10711:3:1",
                                              "nodeType": "YulIdentifier",
                                              "src": "10711:3:1"
                                            },
                                            {
                                              "name": "srcOffset",
                                              "nativeSrc": "10716:9:1",
                                              "nodeType": "YulIdentifier",
                                              "src": "10716:9:1"
                                            }
                                          ],
                                          "functionName": {
                                            "name": "add",
                                            "nativeSrc": "10707:3:1",
                                            "nodeType": "YulIdentifier",
                                            "src": "10707:3:1"
                                          },
                                          "nativeSrc": "10707:19:1",
                                          "nodeType": "YulFunctionCall",
                                          "src": "10707:19:1"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "mload",
                                        "nativeSrc": "10701:5:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10701:5:1"
                                      },
                                      "nativeSrc": "10701:26:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10701:26:1"
                                    },
                                    "variables": [
                                      {
                                        "name": "lastValue",
                                        "nativeSrc": "10688:9:1",
                                        "nodeType": "YulTypedName",
                                        "src": "10688:9:1",
                                        "type": ""
                                      }
                                    ]
                                  },
                                  {
                                    "expression": {
                                      "arguments": [
                                        {
                                          "name": "dstPtr",
                                          "nativeSrc": "10751:6:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10751:6:1"
                                        },
                                        {
                                          "arguments": [
                                            {
                                              "name": "lastValue",
                                              "nativeSrc": "10778:9:1",
                                              "nodeType": "YulIdentifier",
                                              "src": "10778:9:1"
                                            },
                                            {
                                              "arguments": [
                                                {
                                                  "name": "newLen",
                                                  "nativeSrc": "10793:6:1",
                                                  "nodeType": "YulIdentifier",
                                                  "src": "10793:6:1"
                                                },
                                                {
                                                  "kind": "number",
                                                  "nativeSrc": "10801:4:1",
                                                  "nodeType": "YulLiteral",
                                                  "src": "10801:4:1",
                                                  "type": "",
                                                  "value": "0x1f"
                                                }
                                              ],
                                              "functionName": {
                                                "name": "and",
                                                "nativeSrc": "10789:3:1",
                                                "nodeType": "YulIdentifier",
                                                "src": "10789:3:1"
                                              },
                                              "nativeSrc": "10789:17:1",
                                              "nodeType": "YulFunctionCall",
                                              "src": "10789:17:1"
                                            }
                                          ],
                                          "functionName": {
                                            "name": "mask_bytes_dynamic",
                                            "nativeSrc": "10759:18:1",
                                            "nodeType": "YulIdentifier",
                                            "src": "10759:18:1"
                                          },
                                          "nativeSrc": "10759:48:1",
                                          "nodeType": "YulFunctionCall",
                                          "src": "10759:48:1"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "sstore",
                                        "nativeSrc": "10744:6:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10744:6:1"
                                      },
                                      "nativeSrc": "10744:64:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10744:64:1"
                                    },
                                    "nativeSrc": "10744:64:1",
                                    "nodeType": "YulExpressionStatement",
                                    "src": "10744:64:1"
                                  }
                                ]
                              },
                              "condition": {
                                "arguments": [
                                  {
                                    "name": "loopEnd",
                                    "nativeSrc": "10649:7:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10649:7:1"
                                  },
                                  {
                                    "name": "newLen",
                                    "nativeSrc": "10658:6:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10658:6:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "lt",
                                  "nativeSrc": "10646:2:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "10646:2:1"
                                },
                                "nativeSrc": "10646:19:1",
                                "nodeType": "YulFunctionCall",
                                "src": "10646:19:1"
                              },
                              "nativeSrc": "10643:179:1",
                              "nodeType": "YulIf",
                              "src": "10643:179:1"
                            },
                            {
                              "expression": {
                                "arguments": [
                                  {
                                    "name": "slot",
                                    "nativeSrc": "10842:4:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "10842:4:1"
                                  },
                                  {
                                    "arguments": [
                                      {
                                        "arguments": [
                                          {
                                            "name": "newLen",
                                            "nativeSrc": "10856:6:1",
                                            "nodeType": "YulIdentifier",
                                            "src": "10856:6:1"
                                          },
                                          {
                                            "kind": "number",
                                            "nativeSrc": "10864:1:1",
                                            "nodeType": "YulLiteral",
                                            "src": "10864:1:1",
                                            "type": "",
                                            "value": "2"
                                          }
                                        ],
                                        "functionName": {
                                          "name": "mul",
                                          "nativeSrc": "10852:3:1",
                                          "nodeType": "YulIdentifier",
                                          "src": "10852:3:1"
                                        },
                                        "nativeSrc": "10852:14:1",
                                        "nodeType": "YulFunctionCall",
                                        "src": "10852:14:1"
                                      },
                                      {
                                        "kind": "number",
                                        "nativeSrc": "10868:1:1",
                                        "nodeType": "YulLiteral",
                                        "src": "10868:1:1",
                                        "type": "",
                                        "value": "1"
                                      }
                                    ],
                                    "functionName": {
                                      "name": "add",
                                      "nativeSrc": "10848:3:1",
                                      "nodeType": "YulIdentifier",
                                      "src": "10848:3:1"
                                    },
                                    "nativeSrc": "10848:22:1",
                                    "nodeType": "YulFunctionCall",
                                    "src": "10848:22:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "sstore",
                                  "nativeSrc": "10835:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "10835:6:1"
                                },
                                "nativeSrc": "10835:36:1",
                                "nodeType": "YulFunctionCall",
                                "src": "10835:36:1"
                              },
                              "nativeSrc": "10835:36:1",
                              "nodeType": "YulExpressionStatement",
                              "src": "10835:36:1"
                            }
                          ]
                        },
                        "nativeSrc": "10263:618:1",
                        "nodeType": "YulCase",
                        "src": "10263:618:1",
                        "value": {
                          "kind": "number",
                          "nativeSrc": "10268:1:1",
                          "nodeType": "YulLiteral",
                          "src": "10268:1:1",
                          "type": "",
                          "value": "1"
                        }
                      },
                      {
                        "body": {
                          "nativeSrc": "10898:222:1",
                          "nodeType": "YulBlock",
                          "src": "10898:222:1",
                          "statements": [
                            {
                              "nativeSrc": "10912:14:1",
                              "nodeType": "YulVariableDeclaration",
                              "src": "10912:14:1",
                              "value": {
                                "kind": "number",
                                "nativeSrc": "10925:1:1",
                                "nodeType": "YulLiteral",
                                "src": "10925:1:1",
                                "type": "",
                                "value": "0"
                              },
                              "variables": [
                                {
                                  "name": "value",
                                  "nativeSrc": "10916:5:1",
                                  "nodeType": "YulTypedName",
                                  "src": "10916:5:1",
                                  "type": ""
                                }
                              ]
                            },
                            {
                              "body": {
                                "nativeSrc": "10949:67:1",
                                "nodeType": "YulBlock",
                                "src": "10949:67:1",
                                "statements": [
                                  {
                                    "nativeSrc": "10967:35:1",
                                    "nodeType": "YulAssignment",
                                    "src": "10967:35:1",
                                    "value": {
                                      "arguments": [
                                        {
                                          "arguments": [
                                            {
                                              "name": "src",
                                              "nativeSrc": "10986:3:1",
                                              "nodeType": "YulIdentifier",
                                              "src": "10986:3:1"
                                            },
                                            {
                                              "name": "srcOffset",
                                              "nativeSrc": "10991:9:1",
                                              "nodeType": "YulIdentifier",
                                              "src": "10991:9:1"
                                            }
                                          ],
                                          "functionName": {
                                            "name": "add",
                                            "nativeSrc": "10982:3:1",
                                            "nodeType": "YulIdentifier",
                                            "src": "10982:3:1"
                                          },
                                          "nativeSrc": "10982:19:1",
                                          "nodeType": "YulFunctionCall",
                                          "src": "10982:19:1"
                                        }
                                      ],
                                      "functionName": {
                                        "name": "mload",
                                        "nativeSrc": "10976:5:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10976:5:1"
                                      },
                                      "nativeSrc": "10976:26:1",
                                      "nodeType": "YulFunctionCall",
                                      "src": "10976:26:1"
                                    },
                                    "variableNames": [
                                      {
                                        "name": "value",
                                        "nativeSrc": "10967:5:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "10967:5:1"
                                      }
                                    ]
                                  }
                                ]
                              },
                              "condition": {
                                "name": "newLen",
                                "nativeSrc": "10942:6:1",
                                "nodeType": "YulIdentifier",
                                "src": "10942:6:1"
                              },
                              "nativeSrc": "10939:77:1",
                              "nodeType": "YulIf",
                              "src": "10939:77:1"
                            },
                            {
                              "expression": {
                                "arguments": [
                                  {
                                    "name": "slot",
                                    "nativeSrc": "11036:4:1",
                                    "nodeType": "YulIdentifier",
                                    "src": "11036:4:1"
                                  },
                                  {
                                    "arguments": [
                                      {
                                        "name": "value",
                                        "nativeSrc": "11095:5:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "11095:5:1"
                                      },
                                      {
                                        "name": "newLen",
                                        "nativeSrc": "11102:6:1",
                                        "nodeType": "YulIdentifier",
                                        "src": "11102:6:1"
                                      }
                                    ],
                                    "functionName": {
                                      "name": "extract_used_part_and_set_length_of_short_byte_array",
                                      "nativeSrc": "11042:52:1",
                                      "nodeType": "YulIdentifier",
                                      "src": "11042:52:1"
                                    },
                                    "nativeSrc": "11042:67:1",
                                    "nodeType": "YulFunctionCall",
                                    "src": "11042:67:1"
                                  }
                                ],
                                "functionName": {
                                  "name": "sstore",
                                  "nativeSrc": "11029:6:1",
                                  "nodeType": "YulIdentifier",
                                  "src": "11029:6:1"
                                },
                                "nativeSrc": "11029:81:1",
                                "nodeType": "YulFunctionCall",
                                "src": "11029:81:1"
                              },
                              "nativeSrc": "11029:81:1",
                              "nodeType": "YulExpressionStatement",
                              "src": "11029:81:1"
                            }
                          ]
                        },
                        "nativeSrc": "10890:230:1",
                        "nodeType": "YulCase",
                        "src": "10890:230:1",
                        "value": "default"
                      }
                    ],
                    "expression": {
                      "arguments": [
                        {
                          "name": "newLen",
                          "nativeSrc": "10243:6:1",
                          "nodeType": "YulIdentifier",
                          "src": "10243:6:1"
                        },
                        {
                          "kind": "number",
                          "nativeSrc": "10251:2:1",
                          "nodeType": "YulLiteral",
                          "src": "10251:2:1",
                          "type": "",
                          "value": "31"
                        }
                      ],
                      "functionName": {
                        "name": "gt",
                        "nativeSrc": "10240:2:1",
                        "nodeType": "YulIdentifier",
                        "src": "10240:2:1"
                      },
                      "nativeSrc": "10240:14:1",
                      "nodeType": "YulFunctionCall",
                      "src": "10240:14:1"
                    },
                    "nativeSrc": "10233:887:1",
                    "nodeType": "YulSwitch",
                    "src": "10233:887:1"
                  }
                ]
              },
              "name": "copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage",
              "nativeSrc": "9731:1395:1",
              "nodeType": "YulFunctionDefinition",
              "parameters": [
                {
                  "name": "slot",
                  "nativeSrc": "9812:4:1",
                  "nodeType": "YulTypedName",
                  "src": "9812:4:1",
                  "type": ""
                },
                {
                  "name": "src",
                  "nativeSrc": "9818:3:1",
                  "nodeType": "YulTypedName",
                  "src": "9818:3:1",
                  "type": ""
                }
              ],
              "src": "9731:1395:1"
            }
          ]
        },
        "contents": "{\n\n    function array_length_t_string_memory_ptr(value) -> length {\n\n        length := mload(value)\n\n    }\n\n    function array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length) -> updated_pos {\n        mstore(pos, length)\n        updated_pos := add(pos, 0x20)\n    }\n\n    function copy_memory_to_memory_with_cleanup(src, dst, length) {\n        let i := 0\n        for { } lt(i, length) { i := add(i, 32) }\n        {\n            mstore(add(dst, i), mload(add(src, i)))\n        }\n        mstore(add(dst, length), 0)\n    }\n\n    function round_up_to_mul_of_32(value) -> result {\n        result := and(add(value, 31), not(31))\n    }\n\n    function abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value, pos) -> end {\n        let length := array_length_t_string_memory_ptr(value)\n        pos := array_storeLengthForEncoding_t_string_memory_ptr_fromStack(pos, length)\n        copy_memory_to_memory_with_cleanup(add(value, 0x20), pos, length)\n        end := add(pos, round_up_to_mul_of_32(length))\n    }\n\n    function abi_encode_tuple_t_string_memory_ptr_t_string_memory_ptr_t_string_memory_ptr__to_t_string_memory_ptr_t_string_memory_ptr_t_string_memory_ptr__fromStack_reversed(headStart , value2, value1, value0) -> tail {\n        tail := add(headStart, 96)\n\n        mstore(add(headStart, 0), sub(tail, headStart))\n        tail := abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value0,  tail)\n\n        mstore(add(headStart, 32), sub(tail, headStart))\n        tail := abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value1,  tail)\n\n        mstore(add(headStart, 64), sub(tail, headStart))\n        tail := abi_encode_t_string_memory_ptr_to_t_string_memory_ptr_fromStack(value2,  tail)\n\n    }\n\n    function allocate_unbounded() -> memPtr {\n        memPtr := mload(64)\n    }\n\n    function revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() {\n        revert(0, 0)\n    }\n\n    function revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() {\n        revert(0, 0)\n    }\n\n    function cleanup_t_uint160(value) -> cleaned {\n        cleaned := and(value, 0xffffffffffffffffffffffffffffffffffffffff)\n    }\n\n    function cleanup_t_address(value) -> cleaned {\n        cleaned := cleanup_t_uint160(value)\n    }\n\n    function validator_revert_t_address(value) {\n        if iszero(eq(value, cleanup_t_address(value))) { revert(0, 0) }\n    }\n\n    function abi_decode_t_address(offset, end) -> value {\n        value := calldataload(offset)\n        validator_revert_t_address(value)\n    }\n\n    function abi_decode_tuple_t_address(headStart, dataEnd) -> value0 {\n        if slt(sub(dataEnd, headStart), 32) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := 0\n\n            value0 := abi_decode_t_address(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() {\n        revert(0, 0)\n    }\n\n    function revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() {\n        revert(0, 0)\n    }\n\n    function panic_error_0x41() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x41)\n        revert(0, 0x24)\n    }\n\n    function finalize_allocation(memPtr, size) {\n        let newFreePtr := add(memPtr, round_up_to_mul_of_32(size))\n        // protect against overflow\n        if or(gt(newFreePtr, 0xffffffffffffffff), lt(newFreePtr, memPtr)) { panic_error_0x41() }\n        mstore(64, newFreePtr)\n    }\n\n    function allocate_memory(size) -> memPtr {\n        memPtr := allocate_unbounded()\n        finalize_allocation(memPtr, size)\n    }\n\n    function array_allocation_size_t_string_memory_ptr(length) -> size {\n        // Make sure we can allocate memory without overflow\n        if gt(length, 0xffffffffffffffff) { panic_error_0x41() }\n\n        size := round_up_to_mul_of_32(length)\n\n        // add length slot\n        size := add(size, 0x20)\n\n    }\n\n    function copy_calldata_to_memory_with_cleanup(src, dst, length) {\n        calldatacopy(dst, src, length)\n        mstore(add(dst, length), 0)\n    }\n\n    function abi_decode_available_length_t_string_memory_ptr(src, length, end) -> array {\n        array := allocate_memory(array_allocation_size_t_string_memory_ptr(length))\n        mstore(array, length)\n        let dst := add(array, 0x20)\n        if gt(add(src, length), end) { revert_error_987264b3b1d58a9c7f8255e93e81c77d86d6299019c33110a076957a3e06e2ae() }\n        copy_calldata_to_memory_with_cleanup(src, dst, length)\n    }\n\n    // string\n    function abi_decode_t_string_memory_ptr(offset, end) -> array {\n        if iszero(slt(add(offset, 0x1f), end)) { revert_error_1b9f4a0a5773e33b91aa01db23bf8c55fce1411167c872835e7fa00a4f17d46d() }\n        let length := calldataload(offset)\n        array := abi_decode_available_length_t_string_memory_ptr(add(offset, 0x20), length, end)\n    }\n\n    function abi_decode_tuple_t_string_memory_ptrt_string_memory_ptrt_string_memory_ptr(headStart, dataEnd) -> value0, value1, value2 {\n        if slt(sub(dataEnd, headStart), 96) { revert_error_dbdddcbe895c83990c08b3492a0e83918d802a52331272ac6fdb6a7c4aea3b1b() }\n\n        {\n\n            let offset := calldataload(add(headStart, 0))\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\n\n            value0 := abi_decode_t_string_memory_ptr(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := calldataload(add(headStart, 32))\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\n\n            value1 := abi_decode_t_string_memory_ptr(add(headStart, offset), dataEnd)\n        }\n\n        {\n\n            let offset := calldataload(add(headStart, 64))\n            if gt(offset, 0xffffffffffffffff) { revert_error_c1322bf8034eace5e0b5c7295db60986aa89aae5e0ea0873e4689e076861a5db() }\n\n            value2 := abi_decode_t_string_memory_ptr(add(headStart, offset), dataEnd)\n        }\n\n    }\n\n    function panic_error_0x22() {\n        mstore(0, 35408467139433450592217433187231851964531694900788300625387963629091585785856)\n        mstore(4, 0x22)\n        revert(0, 0x24)\n    }\n\n    function extract_byte_array_length(data) -> length {\n        length := div(data, 2)\n        let outOfPlaceEncoding := and(data, 1)\n        if iszero(outOfPlaceEncoding) {\n            length := and(length, 0x7f)\n        }\n\n        if eq(outOfPlaceEncoding, lt(length, 32)) {\n            panic_error_0x22()\n        }\n    }\n\n    function array_dataslot_t_string_storage(ptr) -> data {\n        data := ptr\n\n        mstore(0, ptr)\n        data := keccak256(0, 0x20)\n\n    }\n\n    function divide_by_32_ceil(value) -> result {\n        result := div(add(value, 31), 32)\n    }\n\n    function shift_left_dynamic(bits, value) -> newValue {\n        newValue :=\n\n        shl(bits, value)\n\n    }\n\n    function update_byte_slice_dynamic32(value, shiftBytes, toInsert) -> result {\n        let shiftBits := mul(shiftBytes, 8)\n        let mask := shift_left_dynamic(shiftBits, 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)\n        toInsert := shift_left_dynamic(shiftBits, toInsert)\n        value := and(value, not(mask))\n        result := or(value, and(toInsert, mask))\n    }\n\n    function cleanup_t_uint256(value) -> cleaned {\n        cleaned := value\n    }\n\n    function identity(value) -> ret {\n        ret := value\n    }\n\n    function convert_t_uint256_to_t_uint256(value) -> converted {\n        converted := cleanup_t_uint256(identity(cleanup_t_uint256(value)))\n    }\n\n    function prepare_store_t_uint256(value) -> ret {\n        ret := value\n    }\n\n    function update_storage_value_t_uint256_to_t_uint256(slot, offset, value_0) {\n        let convertedValue_0 := convert_t_uint256_to_t_uint256(value_0)\n        sstore(slot, update_byte_slice_dynamic32(sload(slot), offset, prepare_store_t_uint256(convertedValue_0)))\n    }\n\n    function zero_value_for_split_t_uint256() -> ret {\n        ret := 0\n    }\n\n    function storage_set_to_zero_t_uint256(slot, offset) {\n        let zero_0 := zero_value_for_split_t_uint256()\n        update_storage_value_t_uint256_to_t_uint256(slot, offset, zero_0)\n    }\n\n    function clear_storage_range_t_bytes1(start, end) {\n        for {} lt(start, end) { start := add(start, 1) }\n        {\n            storage_set_to_zero_t_uint256(start, 0)\n        }\n    }\n\n    function clean_up_bytearray_end_slots_t_string_storage(array, len, startIndex) {\n\n        if gt(len, 31) {\n            let dataArea := array_dataslot_t_string_storage(array)\n            let deleteStart := add(dataArea, divide_by_32_ceil(startIndex))\n            // If we are clearing array to be short byte array, we want to clear only data starting from array data area.\n            if lt(startIndex, 32) { deleteStart := dataArea }\n            clear_storage_range_t_bytes1(deleteStart, add(dataArea, divide_by_32_ceil(len)))\n        }\n\n    }\n\n    function shift_right_unsigned_dynamic(bits, value) -> newValue {\n        newValue :=\n\n        shr(bits, value)\n\n    }\n\n    function mask_bytes_dynamic(data, bytes) -> result {\n        let mask := not(shift_right_unsigned_dynamic(mul(8, bytes), not(0)))\n        result := and(data, mask)\n    }\n    function extract_used_part_and_set_length_of_short_byte_array(data, len) -> used {\n        // we want to save only elements that are part of the array after resizing\n        // others should be set to zero\n        data := mask_bytes_dynamic(data, len)\n        used := or(data, mul(2, len))\n    }\n    function copy_byte_array_to_storage_from_t_string_memory_ptr_to_t_string_storage(slot, src) {\n\n        let newLen := array_length_t_string_memory_ptr(src)\n        // Make sure array length is sane\n        if gt(newLen, 0xffffffffffffffff) { panic_error_0x41() }\n\n        let oldLen := extract_byte_array_length(sload(slot))\n\n        // potentially truncate data\n        clean_up_bytearray_end_slots_t_string_storage(slot, oldLen, newLen)\n\n        let srcOffset := 0\n\n        srcOffset := 0x20\n\n        switch gt(newLen, 31)\n        case 1 {\n            let loopEnd := and(newLen, not(0x1f))\n\n            let dstPtr := array_dataslot_t_string_storage(slot)\n            let i := 0\n            for { } lt(i, loopEnd) { i := add(i, 0x20) } {\n                sstore(dstPtr, mload(add(src, srcOffset)))\n                dstPtr := add(dstPtr, 1)\n                srcOffset := add(srcOffset, 32)\n            }\n            if lt(loopEnd, newLen) {\n                let lastValue := mload(add(src, srcOffset))\n                sstore(dstPtr, mask_bytes_dynamic(lastValue, and(newLen, 0x1f)))\n            }\n            sstore(slot, add(mul(newLen, 2), 1))\n        }\n        default {\n            let value := 0\n            if newLen {\n                value := mload(add(src, srcOffset))\n            }\n            sstore(slot, extract_used_part_and_set_length_of_short_byte_array(value, newLen))\n        }\n    }\n\n}\n",
        "id": 1,
        "language": "Yul",
        "name": "#utility.yul"
      }
    ],
    "sourceMap": "60:668:0:-:0;;;;;;;;;;;;;;;;;;;",
    "deployedSourceMap": "60:668:0:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;519:206;;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;;194:37;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;;;;;;;;:::i;:::-;;;;;;;;240:271;;;;;;;;;;;;;:::i;:::-;;:::i;:::-;;519:206;559:13;574;589;615:16;634:5;:17;640:10;634:17;;;;;;;;;;;;;;;615:36;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;670:4;:19;;;691:4;:9;;;702:4;:14;;;662:55;;;;;;;519:206;;;:::o;194:37::-;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;240:271::-;378:125;;;;;;;;414:15;378:125;;;;450:5;378:125;;;;481:10;378:125;;;358:5;:17;364:10;358:17;;;;;;;;;;;;;;;:145;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;:::i;:::-;;;;;240:271;;;:::o;7:99:1:-;59:6;93:5;87:12;77:22;;7:99;;;:::o;112:169::-;196:11;230:6;225:3;218:19;270:4;265:3;261:14;246:29;;112:169;;;;:::o;287:246::-;368:1;378:113;392:6;389:1;386:13;378:113;;;477:1;472:3;468:11;462:18;458:1;453:3;449:11;442:39;414:2;411:1;407:10;402:15;;378:113;;;525:1;516:6;511:3;507:16;500:27;349:184;287:246;;;:::o;539:102::-;580:6;631:2;627:7;622:2;615:5;611:14;607:28;597:38;;539:102;;;:::o;647:377::-;735:3;763:39;796:5;763:39;:::i;:::-;818:71;882:6;877:3;818:71;:::i;:::-;811:78;;898:65;956:6;951:3;944:4;937:5;933:16;898:65;:::i;:::-;988:29;1010:6;988:29;:::i;:::-;983:3;979:39;972:46;;739:285;647:377;;;;:::o;1030:715::-;1239:4;1277:2;1266:9;1262:18;1254:26;;1326:9;1320:4;1316:20;1312:1;1301:9;1297:17;1290:47;1354:78;1427:4;1418:6;1354:78;:::i;:::-;1346:86;;1479:9;1473:4;1469:20;1464:2;1453:9;1449:18;1442:48;1507:78;1580:4;1571:6;1507:78;:::i;:::-;1499:86;;1632:9;1626:4;1622:20;1617:2;1606:9;1602:18;1595:48;1660:78;1733:4;1724:6;1660:78;:::i;:::-;1652:86;;1030:715;;;;;;:::o;1751:75::-;1784:6;1817:2;1811:9;1801:19;;1751:75;:::o;1832:117::-;1941:1;1938;1931:12;1955:117;2064:1;2061;2054:12;2078:126;2115:7;2155:42;2148:5;2144:54;2133:65;;2078:126;;;:::o;2210:96::-;2247:7;2276:24;2294:5;2276:24;:::i;:::-;2265:35;;2210:96;;;:::o;2312:122::-;2385:24;2403:5;2385:24;:::i;:::-;2378:5;2375:35;2365:63;;2424:1;2421;2414:12;2365:63;2312:122;:::o;2440:139::-;2486:5;2524:6;2511:20;2502:29;;2540:33;2567:5;2540:33;:::i;:::-;2440:139;;;;:::o;2585:329::-;2644:6;2693:2;2681:9;2672:7;2668:23;2664:32;2661:119;;;2699:79;;:::i;:::-;2661:119;2819:1;2844:53;2889:7;2880:6;2869:9;2865:22;2844:53;:::i;:::-;2834:63;;2790:117;2585:329;;;;:::o;2920:117::-;3029:1;3026;3019:12;3043:117;3152:1;3149;3142:12;3166:180;3214:77;3211:1;3204:88;3311:4;3308:1;3301:15;3335:4;3332:1;3325:15;3352:281;3435:27;3457:4;3435:27;:::i;:::-;3427:6;3423:40;3565:6;3553:10;3550:22;3529:18;3517:10;3514:34;3511:62;3508:88;;;3576:18;;:::i;:::-;3508:88;3616:10;3612:2;3605:22;3395:238;3352:281;;:::o;3639:129::-;3673:6;3700:20;;:::i;:::-;3690:30;;3729:33;3757:4;3749:6;3729:33;:::i;:::-;3639:129;;;:::o;3774:308::-;3836:4;3926:18;3918:6;3915:30;3912:56;;;3948:18;;:::i;:::-;3912:56;3986:29;4008:6;3986:29;:::i;:::-;3978:37;;4070:4;4064;4060:15;4052:23;;3774:308;;;:::o;4088:146::-;4185:6;4180:3;4175;4162:30;4226:1;4217:6;4212:3;4208:16;4201:27;4088:146;;;:::o;4240:425::-;4318:5;4343:66;4359:49;4401:6;4359:49;:::i;:::-;4343:66;:::i;:::-;4334:75;;4432:6;4425:5;4418:21;4470:4;4463:5;4459:16;4508:3;4499:6;4494:3;4490:16;4487:25;4484:112;;;4515:79;;:::i;:::-;4484:112;4605:54;4652:6;4647:3;4642;4605:54;:::i;:::-;4324:341;4240:425;;;;;:::o;4685:340::-;4741:5;4790:3;4783:4;4775:6;4771:17;4767:27;4757:122;;4798:79;;:::i;:::-;4757:122;4915:6;4902:20;4940:79;5015:3;5007:6;5000:4;4992:6;4988:17;4940:79;:::i;:::-;4931:88;;4747:278;4685:340;;;;:::o;5031:1159::-;5138:6;5146;5154;5203:2;5191:9;5182:7;5178:23;5174:32;5171:119;;;5209:79;;:::i;:::-;5171:119;5357:1;5346:9;5342:17;5329:31;5387:18;5379:6;5376:30;5373:117;;;5409:79;;:::i;:::-;5373:117;5514:63;5569:7;5560:6;5549:9;5545:22;5514:63;:::i;:::-;5504:73;;5300:287;5654:2;5643:9;5639:18;5626:32;5685:18;5677:6;5674:30;5671:117;;;5707:79;;:::i;:::-;5671:117;5812:63;5867:7;5858:6;5847:9;5843:22;5812:63;:::i;:::-;5802:73;;5597:288;5952:2;5941:9;5937:18;5924:32;5983:18;5975:6;5972:30;5969:117;;;6005:79;;:::i;:::-;5969:117;6110:63;6165:7;6156:6;6145:9;6141:22;6110:63;:::i;:::-;6100:73;;5895:288;5031:1159;;;;;:::o;6196:180::-;6244:77;6241:1;6234:88;6341:4;6338:1;6331:15;6365:4;6362:1;6355:15;6382:320;6426:6;6463:1;6457:4;6453:12;6443:22;;6510:1;6504:4;6500:12;6531:18;6521:81;;6587:4;6579:6;6575:17;6565:27;;6521:81;6649:2;6641:6;6638:14;6618:18;6615:38;6612:84;;6668:18;;:::i;:::-;6612:84;6433:269;6382:320;;;:::o;6708:141::-;6757:4;6780:3;6772:11;;6803:3;6800:1;6793:14;6837:4;6834:1;6824:18;6816:26;;6708:141;;;:::o;6855:93::-;6892:6;6939:2;6934;6927:5;6923:14;6919:23;6909:33;;6855:93;;;:::o;6954:107::-;6998:8;7048:5;7042:4;7038:16;7017:37;;6954:107;;;;:::o;7067:393::-;7136:6;7186:1;7174:10;7170:18;7209:97;7239:66;7228:9;7209:97;:::i;:::-;7327:39;7357:8;7346:9;7327:39;:::i;:::-;7315:51;;7399:4;7395:9;7388:5;7384:21;7375:30;;7448:4;7438:8;7434:19;7427:5;7424:30;7414:40;;7143:317;;7067:393;;;;;:::o;7466:77::-;7503:7;7532:5;7521:16;;7466:77;;;:::o;7549:60::-;7577:3;7598:5;7591:12;;7549:60;;;:::o;7615:142::-;7665:9;7698:53;7716:34;7725:24;7743:5;7725:24;:::i;:::-;7716:34;:::i;:::-;7698:53;:::i;:::-;7685:66;;7615:142;;;:::o;7763:75::-;7806:3;7827:5;7820:12;;7763:75;;;:::o;7844:269::-;7954:39;7985:7;7954:39;:::i;:::-;8015:91;8064:41;8088:16;8064:41;:::i;:::-;8056:6;8049:4;8043:11;8015:91;:::i;:::-;8009:4;8002:105;7920:193;7844:269;;;:::o;8119:73::-;8164:3;8119:73;:::o;8198:189::-;8275:32;;:::i;:::-;8316:65;8374:6;8366;8360:4;8316:65;:::i;:::-;8251:136;8198:189;;:::o;8393:186::-;8453:120;8470:3;8463:5;8460:14;8453:120;;;8524:39;8561:1;8554:5;8524:39;:::i;:::-;8497:1;8490:5;8486:13;8477:22;;8453:120;;;8393:186;;:::o;8585:543::-;8686:2;8681:3;8678:11;8675:446;;;8720:38;8752:5;8720:38;:::i;:::-;8804:29;8822:10;8804:29;:::i;:::-;8794:8;8790:44;8987:2;8975:10;8972:18;8969:49;;;9008:8;8993:23;;8969:49;9031:80;9087:22;9105:3;9087:22;:::i;:::-;9077:8;9073:37;9060:11;9031:80;:::i;:::-;8690:431;;8675:446;8585:543;;;:::o;9134:117::-;9188:8;9238:5;9232:4;9228:16;9207:37;;9134:117;;;;:::o;9257:169::-;9301:6;9334:51;9382:1;9378:6;9370:5;9367:1;9363:13;9334:51;:::i;:::-;9330:56;9415:4;9409;9405:15;9395:25;;9308:118;9257:169;;;;:::o;9431:295::-;9507:4;9653:29;9678:3;9672:4;9653:29;:::i;:::-;9645:37;;9715:3;9712:1;9708:11;9702:4;9699:21;9691:29;;9431:295;;;;:::o;9731:1395::-;9848:37;9881:3;9848:37;:::i;:::-;9950:18;9942:6;9939:30;9936:56;;;9972:18;;:::i;:::-;9936:56;10016:38;10048:4;10042:11;10016:38;:::i;:::-;10101:67;10161:6;10153;10147:4;10101:67;:::i;:::-;10195:1;10219:4;10206:17;;10251:2;10243:6;10240:14;10268:1;10263:618;;;;10925:1;10942:6;10939:77;;;10991:9;10986:3;10982:19;10976:26;10967:35;;10939:77;11042:67;11102:6;11095:5;11042:67;:::i;:::-;11036:4;11029:81;10898:222;10233:887;;10263:618;10315:4;10311:9;10303:6;10299:22;10349:37;10381:4;10349:37;:::i;:::-;10408:1;10422:208;10436:7;10433:1;10430:14;10422:208;;;10515:9;10510:3;10506:19;10500:26;10492:6;10485:42;10566:1;10558:6;10554:14;10544:24;;10613:2;10602:9;10598:18;10585:31;;10459:4;10456:1;10452:12;10447:17;;10422:208;;;10658:6;10649:7;10646:19;10643:179;;;10716:9;10711:3;10707:19;10701:26;10759:48;10801:4;10793:6;10789:17;10778:9;10759:48;:::i;:::-;10751:6;10744:64;10666:156;10643:179;10868:1;10864;10856:6;10852:14;10848:22;10842:4;10835:36;10270:611;;;10233:887;;9823:1303;;;9731:1395;;:::o",
    "source": "// SPDX-License-Identifier: MIT\r\npragma solidity ^0.8.0;\r\n\r\ncontract UserAuth {\r\n    struct User {\r\n        string hashedPassword;\r\n        string salt;\r\n        string publicKey;\r\n    }\r\n\r\n    mapping(address => User) public users;\r\n\r\n    function registerUser(string memory _hashedPassword, string memory _salt, string memory _publicKey) public {\r\n        users[msg.sender] = User({\r\n            hashedPassword: _hashedPassword,\r\n            salt: _salt,\r\n            publicKey: _publicKey\r\n        });\r\n    }\r\n\r\n    function getUser() public view returns (string memory, string memory, string memory) {\r\n        User memory user = users[msg.sender];\r\n        return (user.hashedPassword, user.salt, user.publicKey);\r\n    }\r\n}\r\n",
    "sourcePath": "C:\\Users\\koknginhao\\eth-login-demo\\contracts\\contracts\\UserAuth.sol",
    "ast": {
      "absolutePath": "project:/contracts/UserAuth.sol",
      "exportedSymbols": {
        "UserAuth": [
          61
        ]
      },
      "id": 62,
      "license": "MIT",
      "nodeType": "SourceUnit",
      "nodes": [
        {
          "id": 1,
          "literals": [
            "solidity",
            "^",
            "0.8",
            ".0"
          ],
          "nodeType": "PragmaDirective",
          "src": "33:23:0"
        },
        {
          "abstract": false,
          "baseContracts": [],
          "canonicalName": "UserAuth",
          "contractDependencies": [],
          "contractKind": "contract",
          "fullyImplemented": true,
          "id": 61,
          "linearizedBaseContracts": [
            61
          ],
          "name": "UserAuth",
          "nameLocation": "69:8:0",
          "nodeType": "ContractDefinition",
          "nodes": [
            {
              "canonicalName": "UserAuth.User",
              "id": 8,
              "members": [
                {
                  "constant": false,
                  "id": 3,
                  "mutability": "mutable",
                  "name": "hashedPassword",
                  "nameLocation": "115:14:0",
                  "nodeType": "VariableDeclaration",
                  "scope": 8,
                  "src": "108:21:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 2,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "108:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 5,
                  "mutability": "mutable",
                  "name": "salt",
                  "nameLocation": "147:4:0",
                  "nodeType": "VariableDeclaration",
                  "scope": 8,
                  "src": "140:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 4,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "140:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 7,
                  "mutability": "mutable",
                  "name": "publicKey",
                  "nameLocation": "169:9:0",
                  "nodeType": "VariableDeclaration",
                  "scope": 8,
                  "src": "162:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 6,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "162:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "visibility": "internal"
                }
              ],
              "name": "User",
              "nameLocation": "92:4:0",
              "nodeType": "StructDefinition",
              "scope": 61,
              "src": "85:101:0",
              "visibility": "public"
            },
            {
              "constant": false,
              "functionSelector": "a87430ba",
              "id": 13,
              "mutability": "mutable",
              "name": "users",
              "nameLocation": "226:5:0",
              "nodeType": "VariableDeclaration",
              "scope": 61,
              "src": "194:37:0",
              "stateVariable": true,
              "storageLocation": "default",
              "typeDescriptions": {
                "typeIdentifier": "t_mapping$_t_address_$_t_struct$_User_$8_storage_$",
                "typeString": "mapping(address => struct UserAuth.User)"
              },
              "typeName": {
                "id": 12,
                "keyName": "",
                "keyNameLocation": "-1:-1:-1",
                "keyType": {
                  "id": 9,
                  "name": "address",
                  "nodeType": "ElementaryTypeName",
                  "src": "202:7:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_address",
                    "typeString": "address"
                  }
                },
                "nodeType": "Mapping",
                "src": "194:24:0",
                "typeDescriptions": {
                  "typeIdentifier": "t_mapping$_t_address_$_t_struct$_User_$8_storage_$",
                  "typeString": "mapping(address => struct UserAuth.User)"
                },
                "valueName": "",
                "valueNameLocation": "-1:-1:-1",
                "valueType": {
                  "id": 11,
                  "nodeType": "UserDefinedTypeName",
                  "pathNode": {
                    "id": 10,
                    "name": "User",
                    "nameLocations": [
                      "213:4:0"
                    ],
                    "nodeType": "IdentifierPath",
                    "referencedDeclaration": 8,
                    "src": "213:4:0"
                  },
                  "referencedDeclaration": 8,
                  "src": "213:4:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_struct$_User_$8_storage_ptr",
                    "typeString": "struct UserAuth.User"
                  }
                }
              },
              "visibility": "public"
            },
            {
              "body": {
                "id": 33,
                "nodeType": "Block",
                "src": "347:164:0",
                "statements": [
                  {
                    "expression": {
                      "id": 31,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "leftHandSide": {
                        "baseExpression": {
                          "id": 22,
                          "name": "users",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 13,
                          "src": "358:5:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_mapping$_t_address_$_t_struct$_User_$8_storage_$",
                            "typeString": "mapping(address => struct UserAuth.User storage ref)"
                          }
                        },
                        "id": 25,
                        "indexExpression": {
                          "expression": {
                            "id": 23,
                            "name": "msg",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 4294967281,
                            "src": "364:3:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_magic_message",
                              "typeString": "msg"
                            }
                          },
                          "id": 24,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "368:6:0",
                          "memberName": "sender",
                          "nodeType": "MemberAccess",
                          "src": "364:10:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_address",
                            "typeString": "address"
                          }
                        },
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": true,
                        "nodeType": "IndexAccess",
                        "src": "358:17:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_User_$8_storage",
                          "typeString": "struct UserAuth.User storage ref"
                        }
                      },
                      "nodeType": "Assignment",
                      "operator": "=",
                      "rightHandSide": {
                        "arguments": [
                          {
                            "id": 27,
                            "name": "_hashedPassword",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 15,
                            "src": "414:15:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            }
                          },
                          {
                            "id": 28,
                            "name": "_salt",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 17,
                            "src": "450:5:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            }
                          },
                          {
                            "id": 29,
                            "name": "_publicKey",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 19,
                            "src": "481:10:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            }
                          }
                        ],
                        "expression": {
                          "argumentTypes": [
                            {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            },
                            {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            },
                            {
                              "typeIdentifier": "t_string_memory_ptr",
                              "typeString": "string memory"
                            }
                          ],
                          "id": 26,
                          "name": "User",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 8,
                          "src": "378:4:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_type$_t_struct$_User_$8_storage_ptr_$",
                            "typeString": "type(struct UserAuth.User storage pointer)"
                          }
                        },
                        "id": 30,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "kind": "structConstructorCall",
                        "lValueRequested": false,
                        "nameLocations": [
                          "398:14:0",
                          "444:4:0",
                          "470:9:0"
                        ],
                        "names": [
                          "hashedPassword",
                          "salt",
                          "publicKey"
                        ],
                        "nodeType": "FunctionCall",
                        "src": "378:125:0",
                        "tryCall": false,
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_User_$8_memory_ptr",
                          "typeString": "struct UserAuth.User memory"
                        }
                      },
                      "src": "358:145:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_User_$8_storage",
                        "typeString": "struct UserAuth.User storage ref"
                      }
                    },
                    "id": 32,
                    "nodeType": "ExpressionStatement",
                    "src": "358:145:0"
                  }
                ]
              },
              "functionSelector": "d637dcfa",
              "id": 34,
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "registerUser",
              "nameLocation": "249:12:0",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 20,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 15,
                    "mutability": "mutable",
                    "name": "_hashedPassword",
                    "nameLocation": "276:15:0",
                    "nodeType": "VariableDeclaration",
                    "scope": 34,
                    "src": "262:29:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 14,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "262:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 17,
                    "mutability": "mutable",
                    "name": "_salt",
                    "nameLocation": "307:5:0",
                    "nodeType": "VariableDeclaration",
                    "scope": 34,
                    "src": "293:19:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 16,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "293:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 19,
                    "mutability": "mutable",
                    "name": "_publicKey",
                    "nameLocation": "328:10:0",
                    "nodeType": "VariableDeclaration",
                    "scope": 34,
                    "src": "314:24:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 18,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "314:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "261:78:0"
              },
              "returnParameters": {
                "id": 21,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "347:0:0"
              },
              "scope": 61,
              "src": "240:271:0",
              "stateMutability": "nonpayable",
              "virtual": false,
              "visibility": "public"
            },
            {
              "body": {
                "id": 59,
                "nodeType": "Block",
                "src": "604:121:0",
                "statements": [
                  {
                    "assignments": [
                      45
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 45,
                        "mutability": "mutable",
                        "name": "user",
                        "nameLocation": "627:4:0",
                        "nodeType": "VariableDeclaration",
                        "scope": 59,
                        "src": "615:16:0",
                        "stateVariable": false,
                        "storageLocation": "memory",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_User_$8_memory_ptr",
                          "typeString": "struct UserAuth.User"
                        },
                        "typeName": {
                          "id": 44,
                          "nodeType": "UserDefinedTypeName",
                          "pathNode": {
                            "id": 43,
                            "name": "User",
                            "nameLocations": [
                              "615:4:0"
                            ],
                            "nodeType": "IdentifierPath",
                            "referencedDeclaration": 8,
                            "src": "615:4:0"
                          },
                          "referencedDeclaration": 8,
                          "src": "615:4:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_User_$8_storage_ptr",
                            "typeString": "struct UserAuth.User"
                          }
                        },
                        "visibility": "internal"
                      }
                    ],
                    "id": 50,
                    "initialValue": {
                      "baseExpression": {
                        "id": 46,
                        "name": "users",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 13,
                        "src": "634:5:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_mapping$_t_address_$_t_struct$_User_$8_storage_$",
                          "typeString": "mapping(address => struct UserAuth.User storage ref)"
                        }
                      },
                      "id": 49,
                      "indexExpression": {
                        "expression": {
                          "id": 47,
                          "name": "msg",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 4294967281,
                          "src": "640:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_magic_message",
                            "typeString": "msg"
                          }
                        },
                        "id": 48,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberLocation": "644:6:0",
                        "memberName": "sender",
                        "nodeType": "MemberAccess",
                        "src": "640:10:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_address",
                          "typeString": "address"
                        }
                      },
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "IndexAccess",
                      "src": "634:17:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_struct$_User_$8_storage",
                        "typeString": "struct UserAuth.User storage ref"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "615:36:0"
                  },
                  {
                    "expression": {
                      "components": [
                        {
                          "expression": {
                            "id": 51,
                            "name": "user",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 45,
                            "src": "670:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_struct$_User_$8_memory_ptr",
                              "typeString": "struct UserAuth.User memory"
                            }
                          },
                          "id": 52,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "675:14:0",
                          "memberName": "hashedPassword",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 3,
                          "src": "670:19:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_string_memory_ptr",
                            "typeString": "string memory"
                          }
                        },
                        {
                          "expression": {
                            "id": 53,
                            "name": "user",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 45,
                            "src": "691:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_struct$_User_$8_memory_ptr",
                              "typeString": "struct UserAuth.User memory"
                            }
                          },
                          "id": 54,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "696:4:0",
                          "memberName": "salt",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 5,
                          "src": "691:9:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_string_memory_ptr",
                            "typeString": "string memory"
                          }
                        },
                        {
                          "expression": {
                            "id": 55,
                            "name": "user",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 45,
                            "src": "702:4:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_struct$_User_$8_memory_ptr",
                              "typeString": "struct UserAuth.User memory"
                            }
                          },
                          "id": 56,
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "memberLocation": "707:9:0",
                          "memberName": "publicKey",
                          "nodeType": "MemberAccess",
                          "referencedDeclaration": 7,
                          "src": "702:14:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_string_memory_ptr",
                            "typeString": "string memory"
                          }
                        }
                      ],
                      "id": 57,
                      "isConstant": false,
                      "isInlineArray": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "TupleExpression",
                      "src": "669:48:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_tuple$_t_string_memory_ptr_$_t_string_memory_ptr_$_t_string_memory_ptr_$",
                        "typeString": "tuple(string memory,string memory,string memory)"
                      }
                    },
                    "functionReturnParameters": 42,
                    "id": 58,
                    "nodeType": "Return",
                    "src": "662:55:0"
                  }
                ]
              },
              "functionSelector": "832880e7",
              "id": 60,
              "implemented": true,
              "kind": "function",
              "modifiers": [],
              "name": "getUser",
              "nameLocation": "528:7:0",
              "nodeType": "FunctionDefinition",
              "parameters": {
                "id": 35,
                "nodeType": "ParameterList",
                "parameters": [],
                "src": "535:2:0"
              },
              "returnParameters": {
                "id": 42,
                "nodeType": "ParameterList",
                "parameters": [
                  {
                    "constant": false,
                    "id": 37,
                    "mutability": "mutable",
                    "name": "",
                    "nameLocation": "-1:-1:-1",
                    "nodeType": "VariableDeclaration",
                    "scope": 60,
                    "src": "559:13:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 36,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "559:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 39,
                    "mutability": "mutable",
                    "name": "",
                    "nameLocation": "-1:-1:-1",
                    "nodeType": "VariableDeclaration",
                    "scope": 60,
                    "src": "574:13:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 38,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "574:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  },
                  {
                    "constant": false,
                    "id": 41,
                    "mutability": "mutable",
                    "name": "",
                    "nameLocation": "-1:-1:-1",
                    "nodeType": "VariableDeclaration",
                    "scope": 60,
                    "src": "589:13:0",
                    "stateVariable": false,
                    "storageLocation": "memory",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_memory_ptr",
                      "typeString": "string"
                    },
                    "typeName": {
                      "id": 40,
                      "name": "string",
                      "nodeType": "ElementaryTypeName",
                      "src": "589:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage_ptr",
                        "typeString": "string"
                      }
                    },
                    "visibility": "internal"
                  }
                ],
                "src": "558:45:0"
              },
              "scope": 61,
              "src": "519:206:0",
              "stateMutability": "view",
              "virtual": false,
              "visibility": "public"
            }
          ],
          "scope": 62,
          "src": "60:668:0",
          "usedErrors": [],
          "usedEvents": []
        }
      ],
      "src": "33:697:0"
    },
    "compiler": {
      "name": "solc",
      "version": "0.8.21+commit.d9974bed.Emscripten.clang"
    },
    "networks": {},
    "schemaVersion": "3.4.16",
    "updatedAt": "2024-12-10T14:56:46.775Z",
    "devdoc": {
      "kind": "dev",
      "methods": {},
      "version": 1
    },
    "userdoc": {
      "kind": "user",
      "methods": {},
      "version": 1
    }
  }] // Contract ABI
  const contractAddress = '0x139e16b10BA413fce30815be3E5625f785EFdCfF';

  // Initialize Web3
  const web3 = new Web3(window.ethereum); // Using MetaMask's provider

  // Get the current account (from MetaMask)
  const getAccount = async () => {
    const accounts = await web3.eth.requestAccounts();
    return accounts[0];
  };

  // Handle registering a new user
  const registerUser = async (e) => {
    e.preventDefault();
    setStatus('Registering user...');
    try {
      const account = await getAccount();
      const contract = new web3.eth.Contract(contractABI, contractAddress);

      // Calling registerUser function
      const tx = await contract.methods.registerUser(hashedPassword, salt, rsaPublicKey).send({ from: account });

      // Wait for the transaction to be mined
      await tx.wait();

      setStatus('User registered successfully!');
    } catch (err) {
      console.error('Error registering user:', err);
      setStatus('Error registering user.');
    }
  };

  // Handle getting user data
  const getUserData = async (e) => {
    e.preventDefault();
    setStatus('Fetching user data...');
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const data = await contract.methods.getUserData(userAddress).call();
      
      setUserData({
        hashedPassword: data[0],
        salt: data[1],
        rsaPublicKey: data[2],
      });
      setStatus('User data fetched successfully!');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setStatus('Error fetching user data.');
    }
  };

  return (
    <div>
      <h1>User Authentication</h1>

      {/* Register User Form */}
      <form onSubmit={registerUser}>
        <div>
          <label>Hashed Password:</label>
          <input
            type="text"
            value={hashedPassword}
            onChange={(e) => setHashedPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salt:</label>
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            required
          />
        </div>
        <div>
          <label>RSA Public Key:</label>
          <input
            type="text"
            value={rsaPublicKey}
            onChange={(e) => setRsaPublicKey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register User</button>
      </form>

      <hr />

      {/* Get User Data Form */}
      <form onSubmit={getUserData}>
        <div>
          <label>Ethereum Address:</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get User Data</button>
      </form>

      <hr />

      <h3>Status: {status}</h3>

      {/* Display User Data */}
      {userData.hashedPassword && (
        <div>
          <h3>User Data:</h3>
          <p><strong>Hashed Password:</strong> {userData.hashedPassword}</p>
          <p><strong>Salt:</strong> {userData.salt}</p>
          <p><strong>RSA Public Key:</strong> {userData.rsaPublicKey}</p>
        </div>
      )}
    </div>
  );
};

export default App;