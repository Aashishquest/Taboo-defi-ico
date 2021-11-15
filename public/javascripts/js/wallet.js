const contract_address = '0x1BE28AdF4ee250CBC9c6c80f9cAaC378085a440F';

const abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function BuyNFT() {
        // Get a Web3 instance for the wallet
        const web3 = new Web3(provider);

        console.log("Web3 instance is", web3);

        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();
        // Load chain information over an HTTP API
        //   const chainData = await EvmChains.getChain(chainId);
        //   document.querySelector("#network-name").textContent = chainData.name;

        // Get list of accounts of the connected wallet
        const accounts = await web3.eth.getAccounts();

        // MetaMask does not give you all accounts, only the selected account
        // console.log("Got accounts", accounts);
        selectedAccount = accounts[0];
        console.log(selectedAccount)
        // Purge UI elements any previously loaded accounts
        
        // Go through all accounts and get their ETH balance
        const rowResolvers = accounts.map(async (address) => {
            const balance = await web3.eth.getBalance(address);
            // ethBalance is a BigNumber instance
            // https://github.com/indutny/bn.js/
            // const ethBalance = web3.utils.fromWei(balance, "ether");
            // const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
            // Fill in the templated row and put in the document
        });

        // Because rendering account does its own RPC commucation
        // with Ethereum node, we do not want to display any results
        // until data for all accounts is loaded
        await Promise.all(rowResolvers);

        const address = '0x1BE28AdF4ee250CBC9c6c80f9cAaC378085a440F';

        const abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

        const caddress = web3.utils.toChecksumAddress(address);

        const nftcontract= new web3.eth.Contract(abi ,caddress);
        let wallet_balance2= await getBalance(selectedAccount);
        console.log(wallet_balance2);
        // const web3 = new Web3(provider);
        let wallet_balance=wallet_balance2/1000000000000000000;
        let tier="";
        let fees="";
        let usdRate=await fetchUsdRate();
        var balance_usd=wallet_balance*usdRate;
        console.log('usd rate',usdRate);
        console.log('usd balance',balance_usd);
        var finalprice =getBasicPrice();
        var content_id = getContentId(); //document.getElementById('content_id').value;
       
        if(balance_usd>=1000&&balance_usd<=5000){
            tier="2 Tier";
            fees=7.5;
            let discount=(finalprice*10)/100;
            finalprice=finalprice-discount;
        }else if(balance_usd>=5000){
            tier="3 Tier";
            fees=5;
            let discount=(finalprice*15)/100;
            finalprice=finalprice-discount;
        }
        else{
            tier="1 Tier";
            fees=10;
            finalprice=finalprice;
         }
         
        let amount= '0x' + ((finalprice*1000000000000000000).toString(16))
         if(amount>wallet_balance2){
            alert("Insufficient Fund");

            location.reload();
         }
        const nonce = await web3.eth.getTransactionCount(selectedAccount, 'latest'); //get latest nonce
        const from_account = web3.utils.toChecksumAddress(selectedAccount);
        const to_account=web3.utils.toChecksumAddress("0x7A0Fb15634a9939cA928789ba500749D63899E03");

        tx = {
            'from':from_account,
            'to':caddress,
            'nonce': nonce,
            'gas': 5000000,
            'maxPriorityFeePerGas': 1999999987,
            'data': nftcontract.methods.transfer(to_account,amount).encodeABI()
          };

          web3.eth.sendTransaction(tx, function(err, hash) {
            if (!err) 
             {  
                 console.log(hash);

                 $.ajax({
                    dataType: "json",
                    type: 'post',
                    url: '/users/save-order',
                     data: {
                           tx_id:hash,
                           content_id:content_id,
                           address:selectedAccount,
                          // qty: document.getElementById("copies").value,
                             amount: finalprice,
                             fees:fees,
                //         currency: currency,
                //         currencyRate: currencyRate
                          },
                     success: function(data) {
                        
                              console.log(data);  
                              
                               window.location.href="/transfer-nft?hash="+hash;


                             //location.reload();
                    }
                 });
                 
             }
             else{
                 console.log(err);
             }
          } );
           

  }

 

  async function BuyNFTAll() {
    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    //   const chainData = await EvmChains.getChain(chainId);
    //   document.querySelector("#network-name").textContent = chainData.name;

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    // console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
    console.log(selectedAccount)
    // Purge UI elements any previously loaded accounts
    
    // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async (address) => {
        const balance = await web3.eth.getBalance(address);
        // ethBalance is a BigNumber instance
        // https://github.com/indutny/bn.js/
        // const ethBalance = web3.utils.fromWei(balance, "ether");
        // const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
        // Fill in the templated row and put in the document
    });

    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    await Promise.all(rowResolvers);

    const address = '0x1BE28AdF4ee250CBC9c6c80f9cAaC378085a440F';

    const abi =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegator","type":"address"},{"indexed":true,"internalType":"address","name":"fromDelegate","type":"address"},{"indexed":true,"internalType":"address","name":"toDelegate","type":"address"}],"name":"DelegateChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"delegate","type":"address"},{"indexed":false,"internalType":"uint256","name":"previousBalance","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newBalance","type":"uint256"}],"name":"DelegateVotesChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DELEGATION_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"DOMAIN_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"}],"name":"checkpoints","outputs":[{"internalType":"uint32","name":"fromBlock","type":"uint32"},{"internalType":"uint256","name":"votes","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"}],"name":"delegate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegatee","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"delegateBySig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"delegator","type":"address"}],"name":"delegates","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"getCurrentVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"getPriorVotes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"numCheckpoints","outputs":[{"internalType":"uint32","name":"","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

    const caddress = web3.utils.toChecksumAddress(address);

    const nftcontract= new web3.eth.Contract(abi ,caddress);
    let wallet_balance2= await getBalance(selectedAccount);
    console.log(wallet_balance2);
    // const web3 = new Web3(provider);
    let wallet_balance=wallet_balance2/1000000000000000000;

    let  tier="";
    let fees="";
    let usdRate=await fetchUsdRate();
     console.log(usdRate);
    var finalprice =getBasicPriceAll();
    var balance_usd=wallet_balance*usdRate;
    console.log("usd price",price_in_usd);
    var content_id = getContentIdAll(); //document.getElementById('content_id').value;

    if(balance_usd>=1000&&balance_usd<=5000){
        tier="2 Tier";
        fees=7.5;
        let discount=(finalprice*10)/100;
        finalprice=finalprice-discount;
    }else if(balance_usd>=5000){
        tier="3 Tier";
        fees=5;
        let discount=(finalprice*15)/100;
        finalprice=finalprice-discount;
    }
    else{
        tier="1 Tier";
        fees=10;
        finalprice=finalprice;
     }




    let amount= '0x' + ((finalprice*1000000000000000000).toString(16))
     if(amount>wallet_balance2){
        alert("Insufficient Fund");

        location.reload();
     }
    const nonce = await web3.eth.getTransactionCount(selectedAccount, 'latest'); //get latest nonce
    const from_account = web3.utils.toChecksumAddress(selectedAccount);
    const to_account=web3.utils.toChecksumAddress("0x7A0Fb15634a9939cA928789ba500749D63899E03");

    tx = {
        'from':from_account,
        'to':caddress,
        'nonce': nonce,
        'gas': 5000000,
        'maxPriorityFeePerGas': 1999999987,
        'data': nftcontract.methods.transfer(to_account,amount).encodeABI()
      };

      web3.eth.sendTransaction(tx, function(err, hash) {
        if (!err) 
         {  
             console.log(hash);

             $.ajax({
                dataType: "json",
                type: 'post',
                url: '/users/save-order',
                 data: {
                       tx_id:hash,
                       content_id:content_id,
                       address:selectedAccount,
                      // qty: document.getElementById("copies").value,
                       amount: finalprice,
                       fees:fees,
            //         currency: currency,
            //         currencyRate: currencyRate
                      },
                 success: function(data) {
                    
                          console.log(data);  
                          
                           window.location.href="/transfer-nft?hash="+hash;


                         //location.reload();
                }
             });
             
         }
         else{
             console.log(err);
         }
      } );
       

}





  async function getBalance(wallet_address){
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);
    
    const nftcontract= new web3.eth.Contract(abi,contract_address);
    //console.log(nftcontract);
    try{
        const balance = await nftcontract.methods.balanceOf(wallet_address).call({
            from :contract_address,
            gas:500000
          });
          console.log('balance  is',balance);
    
          return balance;

    }catch(err){
       console.log(err)
    }
}





    async function BuyContent() {
        // Get a Web3 instance for the wallet
        const web3 = new Web3(provider);

        console.log("Web3 instance is", web3);

        // Get connected chain id from Ethereum node
        const chainId = await web3.eth.getChainId();
        // Load chain information over an HTTP API
        //   const chainData = await EvmChains.getChain(chainId);
        //   document.querySelector("#network-name").textContent = chainData.name;

        // Get list of accounts of the connected wallet
        const accounts = await web3.eth.getAccounts();

        // MetaMask does not give you all accounts, only the selected account
        // console.log("Got accounts", accounts);
        selectedAccount = accounts[0];

        // Purge UI elements any previously loaded accounts
        
        // Go through all accounts and get their ETH balance
        const rowResolvers = accounts.map(async (address) => {
            const balance = await web3.eth.getBalance(address);
            // ethBalance is a BigNumber instance
            // https://github.com/indutny/bn.js/
            // const ethBalance = web3.utils.fromWei(balance, "ether");
            // const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
            // Fill in the templated row and put in the document
        });

        // Because rendering account does its own RPC commucation
        // with Ethereum node, we do not want to display any results
        // until data for all accounts is loaded
        await Promise.all(rowResolvers);

        //var code = "92655f7237f805673a2a810ed0badd228445bf8fe38a43c0f65fd2616fff25b7";

        // const web3 = new Web3(provider);
        var finalprice =getBasicPrice();
        await web3.eth.sendTransaction({
            from: selectedAccount,
           // data: code,
            to: "0x6cDDe6477FCBC301a11ECD8Dc41307A5470DF7F1", 
            value:'0x' + ((finalprice* 1000000000000000000).toString(16)),
        }, function(err, transactionHash) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(transactionHash);
                var content_id = getContentId(); //document.getElementById('content_id').value;
                console.log(content_id);
                
                // // obj.value = txHash;
                $.ajax({
                   dataType: "json",
                   type: 'post',
                   url: '/users/save-order',
                    data: {
                          tx_id:transactionHash,
                          content_id:content_id,
                          address:selectedAccount,
                         // qty: document.getElementById("copies").value,
                            amount: finalprice,
               //         currency: currency,
               //         currencyRate: currencyRate
                         },
                    success: function(data) {
                        swal({
                             type: 'success',
                              text: 'Transaction completed successfully.',
                              timer: 3000,
                              onOpen: function() {
                                swal.showLoading()
                            }
                        }).then(function() {
                            location.reload();
                       });
                                  location.reload();
                   }
                });
           
            }
        });
    }   

async function resetAccountData() {        
    await BuyNFT(provider);        
}

async function resetAccountDataAll() {        
    await BuyNFTAll(provider);        
}

/**
* Connect wallet button pressed.
*/
async function onBuyNFT() {

    console.log("Opening a dialog", web3Modal);
    try {
          provider = await web3Modal.connect();
       }catch(e) {
        console.log("Could not get a wallet connection", e);
    return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        BuyNFT();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        //BuyContent();
        BuyNFT();
    });

    await resetAccountData();
}

async function onBuyNFTAll() {

    console.log("Opening a dialog", web3Modal);
    try {
          provider = await web3Modal.connect();
       }catch(e) {
        console.log("Could not get a wallet connection", e);
    return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        BuyNFTAll();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        //BuyContent();
        BuyNFTAll();
    });

    await resetAccountDataAll();
}


async function fetchUsdRate() {
    let response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=taboo-token&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true');
    if (response.ok) { // if HTTP-status is 200-299
  // get the response body (the method explained below)
  let data = await response.json();
 
  return data['taboo-token'].usd
}
   
}
// Script connect wallet


    
