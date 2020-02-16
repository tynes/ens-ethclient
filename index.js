
const {Client} = require('bcurl');
const config = require('bcfg');
const Validator = require('bval');

// keep file with ENS contract addresses
// use network as the key in the ENS
// contract address map

class EthClient extends Client {
  constructor(options) {
    super(options);

    this.network = options.network;
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

  // TODO: figure out all the logic here
  async resolveENS(domain) {
    const hash = nameHash(domain);

  }
}

// TODO: implement nameHash
function nameHash(domain) {
  return domain;
}

module.exports = EthClient;

