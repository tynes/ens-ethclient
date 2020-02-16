/**
 *
 */

'use strict';

const {Client} = require('bcurl');
const config = require('bcfg');
const Validator = require('bval');

const Web3 = require('web3');
const web3 = new Web3();
const ens = web3.eth.ens;

const HttpProvider = require('ethjs-provider-http')

class EthClient extends Client {
  constructor(options) {
    super(options);

    this.network = options.network;
    // TODO(mark): allow config with host/port
    this.provider = new HttpProvider(options.url);
    this.ens = new ens(this.provider);
  }

  /**
   * Make an RPC call.
   * @returns {Promise}
   */

  execute(name, params) {
    return super.execute('/', name, params);
  }

  async getHeight() {
    return this.execute('eth_blockNumber');
  }

  async getBlock(hash, details = false) {
    if (typeof hash === 'number')
      return this.getBlockByNumber(hash, details);

    return this.getBlockByHash(hash, details);
  }

  async getBlockByNumber(height, details = false) {
    const valid = new Validator({height, details});
    const args = [valid.hex('height'), valid.bool('details')];

    return this.execute('eth_getBlockByNumber', args);
  }

  async getBlockByHash(hash, details = false) {
    const valid = new Validator({hash, details});
    const args = [valid.hex('hash'), valid.bool('details')];

    return this.execute('eth_getBlockByHash', args);
  }

  // TODO(mark): allow for multiple types of resolution
  // with a type parameter. Right now only addr
  // is supported.
  async resolveENS(domain) {
    const resolver = this.ens.resolver(domain);
    return await resolver.addr();
  }
}

module.exports = EthClient;
