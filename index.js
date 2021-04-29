const axios = require('axios');
const config = require('./config.json');

const whitelistAddresses = async () => {
	try{
		for(const wallet of config.wallets) {
			const pendingStakes = await axios.post(wallet, {
				method: 'listcoldutxos',
			});

			for(const stake of pendingStakes['data']['result']) {
				if(stake['whitelisted'] == 'false') {
					await axios.post(wallet, {
						method: 'delegatoradd',
						params: [stake['coin-owner']],
					});
				}
			}
		}
	}
	catch(e) {
		console.log(e);
	}

};

const start = async () => {
	// eslint-disable-next-line no-constant-condition
	while(true) {
		await whitelistAddresses();
	}
};

console.log('starting');
start();