import {React, useState, useEffect} from 'react'
import {ethers} from 'ethers'
import styles from './Bank.module.css'
import simple_token_abi from './Contracts/bank_app_abi.json'
import Interactions from './Interactions';

const BankApp = () => {

	// deploy simple token contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x75fCfC95271e0DdbeffC07be2957680685E7D225';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');
	const [sum, setSum] = useState("");
	const [sub, setSub] = useState("");
	const [mul, setMul] = useState("");

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [accStatus, setAccStatus]= useState("");

	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
				setConnButtonText('Wallet Connected');
			})
			.catch(error => {
				setErrorMessage(error.message);
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}
	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}

	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, simple_token_abi, tempSigner);
		setContract(tempContract);	
	}
	const Addition = async(e)=>{
		e.preventDefault();
		let a = e.target.add1.value;
		let b = e.target.add2.value;
		let txt= await contract.sum(a,b);
		setSum(parseInt(txt));
	}
	const Substraction = async(e)=>{
		e.preventDefault();
		let a = e.target.sub1.value;
		let b = e.target.sub2.value;
		let txt= await contract.sub(a,b);
		setSub(parseInt(txt));
	}
	const Multiplication = async(e)=>{
		e.preventDefault();
		let a = e.target.mul1.value;
		let b = e.target.mul2.value;
		let txt= await contract.mul(a,b);
		setMul(parseInt(txt));
	}


	return (
	<div >
		<h2> Calculations Dapp- Addition, Substraction, Multiplication </h2>
		<button className={styles.button6} onClick={connectWalletHandler}>{connButtonText}</button>
		<h3>Address: {defaultAccount}</h3>
		{errorMessage}
		<div className={styles.interactionsCard}>
			<form onSubmit={Addition}>
					<h3> Addition </h3>
					<div className={styles.form_field}>
						<input type='number' id='add1' min='0' step='1'/>
						<p> + </p>
						<input type='number' id='add2' min='0' step='1'/>
						<button type='submit' className={styles.button6}>ADD</button>
					<h3> = {sum}</h3>
					</div>
			</form>
			<form onSubmit={Substraction}>
					<h3> Substraction </h3>
					<div className={styles.form_field}>
						<input type='number' id='sub1' min='0' step='1'/>
						<p> - </p>
						<input type='number' id='sub2' min='0' step='1'/>
						<button type='submit' className={styles.button6}>SUB</button>
					<h3> = {sub}</h3>
					</div>
			</form>
			<form onSubmit={Multiplication}>
					<h3> Multiplication </h3>
					<div className={styles.form_field}>
						<input type='number' id='mul1' min='0' step='1'/>
						<p> X </p>
						<input type='number' id='mul2' min='0' step='1'/>
						<button type='submit' className={styles.button6}>MUL</button>
					<h3> = {mul}</h3>
					</div>
			</form>
		</div>
	</div>
	)
}

export default BankApp;
