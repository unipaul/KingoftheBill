
(function ($) {
	"use strict";

})(jQuery);

var KingoftheBill;
var userAccount;

function displaysumDonations(web3){

	KingoftheBill.sumDonations(function(error, result){
		if(!error){
			$("#sumDonations").append(`Sum of all donations: ${web3.fromWei(result.toNumber())} ETH`);
			jQuery.getJSON('https://api.coincap.io/v2/rates/ethereum',  function(data) {
				var rate = data.data.rateUsd; 
				$("#sumDonations").append(` ($${(web3.fromWei(result.toNumber())*rate).toFixed(2)})`);
			});
		}
		else{
		console.error(error);
		}
	});
}

function donate() {
	window.ethereum.enable();
	var name = document.getElementById("donor").value;
	if(name.length > 25) {
		name = name.substring(0,24)+"...";
	}
	var donation = document.getElementById("donation").value;
	KingoftheBill.donate(name, {from: web3.eth.accounts[0], value: web3.toWei(donation, "ether")}, function(error, txhash){
		if (!error)
			$("#txStatus").text("Sending donation to Blockchain. This may take a while."); 
		else
			$("#txStatus").text(error);
	});

}

function filltable(web3){
	var table = [];
	var unique = [];
	var d = 0;
	KingoftheBill.getaddressLUT(function(error, lut){
		var getdon = new Promise((resolve, reject) => {

			lut.forEach((value, index, array) => {

				if(!unique.includes(value)){
					unique.push(value);

					KingoftheBill.getDonationsofDonor(value, function(error, result) {
						table.push([value,web3.fromWei(result.toNumber())])
						if(table.length === lut.length - d){resolve();}
					});
				}
				else{
					d++;
					if(table.length === lut.length - d){resolve();}
				}

			});

		});
		getdon.then(() => {

			table.sort(function(a,b){return b[1]-a[1];});

			KingoftheBill.getNameofDonor(table[0][0], function(error, result){
				$("#td01").text(`${result}`);
				$("#td02").text(`${table[0][1]} ETH`);
			})
			KingoftheBill.getNameofDonor(table[1][0], function(error, result){
				$("#td11").text(`${result}`);
				$("#td12").text(`${table[1][1]} ETH`);
			})
			KingoftheBill.getNameofDonor(table[2][0], function(error, result){
				$("#td21").text(`${result}`);
				$("#td22").text(`${table[2][1]} ETH`);
			})
			KingoftheBill.getNameofDonor(table[3][0], function(error, result){
				$("#td31").text(`${result}`);
				$("#td32").text(`${table[3][1]} ETH`);
			})
			KingoftheBill.getNameofDonor(table[4][0], function(error, result){
				$("#td41").text(`${result}`);
				$("#td42").text(`${table[4][1]} ETH`);
			});	
			KingoftheBill.getNameofDonor(table[5][0], function(error, result){
				$("#td51").text(`${result}`);
				$("#td52").text(`${table[5][1]} ETH`);
			});
			KingoftheBill.getNameofDonor(table[6][0], function(error, result){
				$("#td61").text(`${result}`);
				$("#td62").text(`${table[6][1]} ETH`);
			});	
			KingoftheBill.getNameofDonor(table[7][0], function(error, result){
				$("#td71").text(`${result}`);
				$("#td72").text(`${table[7][1]} ETH`);
			});	
			KingoftheBill.getNameofDonor(table[8][0], function(error, result){
				$("#td81").text(`${result}`);
				$("#td82").text(`${table[8][1]} ETH`);
			});		
			KingoftheBill.getNameofDonor(table[9][0], function(error, result){
				$("#td91").text(`${result}`);
				$("#td92").text(`${table[9][1]} ETH`);
			});			
		});
	});

	// var accountInterval = setInterval(function() {
	// 	if (web3.eth.accounts[0] !== userAccount) {
	// 	    userAccount = web3.eth.accounts[0];
	// 	    KingoftheBill.getNameofDonor(userAccount, function(error, result){
	// 	    	console.log(result);
	// 	    	if (!error && result){
	// 	    		document.getElementById("donor").value = result;
	// 	    	}
	// 	    	else{
	// 	    		console.log(error);
	// 	    	}
	// 	    });
	// 	  }
	// }, 300);
}

window.addEventListener('load', function(){
	if (typeof web3 !== 'undefined') {
		var web3js = new Web3(web3.currentProvider);
		console.log("MetaMask injected web3");
	} 
	else {
		console.log('No Web3 Detected... using HTTP Provider');
			
			var web3js = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/4413cef8ae2848059c206a0808da8ce6'));
	}

	KingoftheBill =	web3js.eth.contract(ABI).at('0x0EbC0FD1a2ee16e1AB1f37e889f0bF1f7B854f33');
	filltable(web3js);
	displaysumDonations(web3js);

})
