# Pneumatic

**NOTE**: This is currently not usable.  Don't bother.

A decntralized Web browser extension.

## Ethereum

### Injection

This extension follows [EIP 1193](https://eips.ethereum.org/EIPS/eip-1193).

## IPFS

Will attempt to serve IPFS URLs

- ipfs://QmZ4tDuvesekSs4qM5ZBKpXiZGun7S2CYtEZRB3DYXkjGx

## Development

Perhaps this will have better docs later.

### Notes

In one terminal, run webpack:

    yarn build:watch

In another:

    yarn start

This will launch Firefox with the temporary extension installed, and reload on
file changes.

Test provider in browser console:

    pneumatic.provider.request({ method: 'eth_blockNumber', params: [] }).then(res => console.log(parseInt(res, 16)))
