import React, { Component } from "react";
import logo from "../assets/imgs/logo.png";
import character from "../assets/imgs/Character.png";
import cardgif from "../assets/imgs/card.gif";
import { Modal } from "react-bootstrap";
import v1 from "../assets/imgs/footer-icons/v1.png";
import v2 from "../assets/imgs/footer-icons/v2.png";
import v3 from "../assets/imgs/footer-icons/v3.png";
import v4 from "../assets/imgs/footer-icons/v4.png";
import v5 from "../assets/imgs/footer-icons/v5.png";
import thankyou from "../assets/imgs/thankyou.gif";
import Countdown from "react-countdown";
import congrats from "../assets/imgs/congrats.png";
import moon from "../assets/imgs/moon.gif";
import star from "../assets/imgs/star.gif";
import smoke from "../assets/imgs/smoke.gif";
import fan from "../assets/imgs/fan.png";
import { useEffect, useState, useRef } from "react";
import { connectWallet, getCurrentWalletConnected } from "../utils/interact.js";
import Web3 from "web3";
import { ToastContainer, toast } from 'react-toastify';
const { ethers } = require("ethers");

const Home = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");

  const [nftDetails, setNftDetails] = useState([]);
  const [stakeDetails, setStakeDetails] = useState([]);
  const [pool, setPool] = useState("");
  const [tokenId, setTokenId] = useState("");

  // window.scrollTo(0, 0);

  const tokenContract = "0x1F57F7f55F1222C80D2C80C6d623525496a90eE7";
  const nftContract = "0x8c0122f2F8f3543eF652B31151d93eba00Ae79A4";
  const stakingContract = "0xEdcc912904B5Cc372e7656eF455Cb9549a4Ddd45";
  const tokenContractAbi = require('../abi/token.json');
  const nftContractAbi = require('../abi/nft.json');
  const stakingContractAbi = require('../abi/staking.json');

  function timeout(delay) {
    return new Promise(res => setTimeout(res, delay));
  }

  useEffect(async () => {
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);

    getNftData();
    getStakeData();
    // getFrensCount();

    addWalletListener();
  }, []);

  const stakeNFT = async (id, pool) => {
    if (pool == "") {
      toast("No Pool Selected, Please select one");
      await timeout(2000);
      window.location.reload(false);
    } else {
      //Contract Interaction
      const web3 = new Web3(window.ethereum);

      //Approve NFT
      window.contract3 = await new web3.eth.Contract(nftContractAbi, nftContract);
      const transactionParameters = {
        to: nftContract, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract3.methods.approve(stakingContract, id).encodeABI()//make call to NFT smart contract
      };

      //sign the transaction via Metamask
      const txHash = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
      toast("Wait for Approval, then confirm the staking transaction");
      await timeout(5000);

      //Do Staking
      window.contract4 = await new web3.eth.Contract(stakingContractAbi, stakingContract);
      //set up your Ethereum transaction
      const transactionParametersStaking = {
        to: stakingContract, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract4.methods.stakeNFT(id, pool).encodeABI()//make call to NFT smart contract
      };
      //sign the transaction via Metamask
      const txHashStaking = await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [transactionParametersStaking],
        });

      await timeout(5000);
      toast("✅ Staking of NFT done successfully");
      document.getElementById("for-close").style.display = "none";
      document.getElementById("for-open").style.display = "block";
      await timeout(2000);
      window.location.reload(false);
    }
    setTokenId("");
    setPool("");
  };

  const handleCongrats = () => {
    document.getElementById("for-close").style.display = "none";
    document.getElementById("for-open").style.display = "block";
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    setTokenId(id);
  }

  const [shows, setShows] = useState(false);
  const handleShows = () => setShows(true);
  const handleCloseS = () => setShows(false);

  const unstakeNFT = async (index, tokenId, pool) => {

    //Contract Interaction
    const web3 = new Web3(window.ethereum);

    //Do Staking
    window.contract5 = await new web3.eth.Contract(stakingContractAbi, stakingContract);
    //set up your Ethereum transaction
    const transactionParametersUnStaking = {
      to: stakingContract, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      'data': window.contract5.methods.unStakeNFT(index, tokenId, pool).encodeABI()//make call to NFT smart contract
    };
    //sign the transaction via Metamask
    const txHashUnStaking = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParametersUnStaking],
      });

    await timeout(5000);
    toast("✅ UnStaking of NFT done successfully");
    setShows(true);
    await timeout(2000);
    window.location.reload(false);
  };

  const getNftData = async () => {
    const web3 = new Web3(window.ethereum);

    try {
      window.contract = await new web3.eth.Contract(nftContractAbi, nftContract);
      const user_token_ids = await window.contract.methods.walletOfOwner(window.ethereum.selectedAddress).call();
      var nft_data = [];

      for (var i = 0; i < user_token_ids.length; i++) {
        const token_uri = await window.contract.methods.tokenURI(user_token_ids[i]).call();

        const uri = token_uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        const response = await fetch(uri);
        if (!response.ok) {
          throw new Error('Something went wrong');
        }
        const url_data = await response.json();

        const data = {
          "id": user_token_ids[i],
          "url": uri,
          "compiler": url_data.compiler,
          "date": url_data.date,
          "dna": url_data.dna,
          "description": url_data.description,
          "edition": url_data.edition,
          "image": url_data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
          "name": url_data.name
        }

        nft_data.push(data);
      }
      setNftDetails(nft_data);
    } catch (err) {
      console.log(err);
    }
  };

  const getStakeData = async () => {
    const web3 = new Web3(window.ethereum);

    try {
      window.contract1 = await new web3.eth.Contract(stakingContractAbi, stakingContract);
      const user_staking = await window.contract1.methods.userStakingList(window.ethereum.selectedAddress).call();

      var stake_data = [];

      for (var i = 0; i < user_staking.length; i++) {
        const check = await window.contract1.methods.checkIfAlreadyUnstaked(user_staking[i], window.ethereum.selectedAddress).call();
        if (!check) {
          const stakes = await window.contract1.methods.stakes(user_staking[i]).call();
          window.contract2 = await new web3.eth.Contract(nftContractAbi, nftContract);
          if (stakes.tokenId == "0") {

          } else {
            const token_uri = await window.contract2.methods.tokenURI(stakes.tokenId).call();

            const uri = token_uri.replace("ipfs://", "https://ipfs.io/ipfs/");
            const response = await fetch(uri);
            if (!response.ok) {
              throw new Error('Something went wrong');
            }
            const url_data = await response.json();

            //Get Remaining Time of Pool
            const end_time = (Math.floor(parseInt(stakes.timestamp)) + stakes.pool * 24 * 60 * 60);

            const data = {
              "index": user_staking[i],
              "url": uri,
              "compiler": url_data.compiler,
              "date": url_data.date,
              "dna": url_data.dna,
              "description": url_data.description,
              "edition": url_data.edition,
              "image": url_data.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
              "name": url_data.name,
              "token_id": stakes.tokenId,
              "pool": stakes.pool,
              "timestamp": end_time
            }
            stake_data.push(data);
          }
        }
      }
      setStakeDetails(stake_data);
    } catch (err) {
      console.log(err);
    }
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          //setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          toast("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      toast("🦊  You must install Metamask, a virtual Ethereum wallet, in your browser.");
    }
  }

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);
  };

  return (
    <>
      {/* Pop up for pool selection */}
      <Modal show={show} onHide={handleClose}>
        <div className="popup-wrap">
          <div id="for-close" className="forclosing">
            <div className="row">
              <div className="col-6">
                <button id="pool1" className="stake-btn pool1" onClick={() => { setPool("7"); }}>
                  Pool 1
                </button>
                <p className="days-ab">7 Days</p>
              </div>
              <div className="col-6">
                <button id="pool2" className="stake-btn pool2" onClick={() => { setPool("15"); }}>
                  Pool 2
                </button>
                <p className="days-ab">15 Days</p>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <button id="pool3" className="stake-btn pool3" onClick={() => { setPool("30"); }}>
                  Pool 3
                </button>
                <p className="days-ab">30 Days</p>
              </div>
              <div className="col-6">
                <button id="pool4" className="stake-btn pool4" onClick={() => { setPool("45"); }}>
                  Pool 4
                </button>
                <p className="days-ab">45 Days</p>
              </div>
            </div>

            <button className="stake-btn" onClick={() => stakeNFT(tokenId, pool)}>
              Stake
            </button>
          </div>

          <div id="for-open" className="for-open">
            <h2 className="thanks">
              Thanks <img className="thanksgif" src={thankyou} alt="" />
            </h2>
            <p className="thanks-p">
              Your Staking Is Done Wait For The Counter Ends & Claim Your
              Reward!
            </p>
          </div>
        </div>
      </Modal>

      {/* popup for reward */}
      <Modal show={shows} onHide={handleCloseS}>
        <div className="popup-wrap">
          <div id="congratulations">
            <h2 className="congrats">Congratulations</h2>
            <img className="cong-img" src={congrats} alt="" />
          </div>
        </div>
      </Modal>

      <section className="hero-section">
        <img className="star" src={star} alt="" />
        <div className="container">
          <div className="row">
            <div className="col-sm-3">
              <a href="/">
                <img className="logo-img" src={logo} alt="" />
              </a>
            </div>
            <div className="col-sm-9">
              <div className="navigation-wrap">
                <ul className="navigationul">
                  <li className="nav-list">
                    <a className="nav-links" href="#">
                      Home
                    </a>
                  </li>
                  <li className="nav-list">
                    <a className="nav-links" href="#mynfts">
                      My NFTs
                    </a>
                  </li>
                  <li className="nav-list">
                    <a className="nav-links" href="#mystaking">
                      My Staking
                    </a>
                  </li>
                  <div className="connect-wallet-wrapper">
                    {/* <button className="connect-wallet">Connect wallet</button> */}
                    <button id="walletButton" className="connect-wallet" onClick={connectWalletPressed}>
                      {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                      ) : (
                        <span>Connect Wallet</span>
                      )}
                    </button>
                    {/* <a className="nav-links connect-wallet" href="#">
                    Connect Wallet
                  </a> */}
                  </div>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="moon-wrap">
                  <img className="moon" src={moon} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="for-clouds">
          <div className="thecharacter">
            <div className="container">
              <div className="row">
                <div className="col-sm-7">
                  <div className="smokeandchar">
                    <img
                      className="img-fluid character"
                      src={character}
                      alt=""
                    />
                    <img className="smoke" src={smoke} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mains">
        <div className="for-border-top"></div>
        <section id="mynfts" className="mynfts">
          <div className="container">
            <div className="row">
              <div className="title-wrap">
                <h2 className="main-tit">My NFTs</h2>
              </div>
              {nftDetails.length > 0 ?
                nftDetails.map((item, index) => {
                  return (
                    <div className="col-xl-3">
                      <div className="full-bg"></div>
                      <div className="card-main">
                        <img src={cardgif} alt="" className="card-image" />
                        <div className="card-gif"></div>
                        <div className="details">
                          <div className="details-flexx">
                            <p className="name">Name:</p>
                            <p className="name">{item.name}</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Token Id:</p>
                            <p className="name">{item.id}</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Token Standard:</p>
                            <p className="name">ERC-721</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Blockchain:</p>
                            <p className="name">ETH</p>
                          </div>
                        </div>

                        <button
                          id="place-btn"
                          className="stake-btn"
                          onClick={() => handleShow(item.id)}
                        >
                          Stake
                        </button>
                      </div>
                    </div>
                  )
                })
                :
                <div></div>
              }
              {/* <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="place-btn"
                    className="stake-btn"
                    onClick={handleShow}
                  >
                    Stake
                  </button>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="place-btn"
                    className="stake-btn"
                    onClick={handleShow}
                  >
                    Stake
                  </button>
                </div>
              </div>
              <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="place-btn"
                    className="stake-btn"
                    onClick={handleShow}
                  >
                    Stake
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        <section id="mystaking" className="mystaking">
          <div className="container">
            <div className="row">
              <div className="title-wrap">
                <h2 className="main-tit">My Staking</h2>
              </div>
              {stakeDetails.length > 0 ?
                stakeDetails.map((item, index) => {
                  return (
                    <div className="col-xl-3">
                      <div className="full-bg"></div>
                      <div className="card-main staking">
                        <img src={cardgif} alt="" className="card-image" />
                        <div className="card-gif"></div>
                        <div className="details">
                          <div className="details-flexx">
                            <p className="name">Name:</p>
                            <p className="name">{item.name}</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Token Id:</p>
                            <p className="name">{item.token_id}</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Token Standard:</p>
                            <p className="name">ERC-721</p>
                          </div>
                          <div className="details-flexx">
                            <p className="name">Blockchain:</p>
                            <p className="name">ETH</p>
                          </div>
                        </div>
                        {(new Date()) > (new Date(parseInt(item.timestamp) * 1000))
                          ?
                          <button
                            id="claim-btn"
                            className="claim-btn "
                            onClick={() => unstakeNFT(item.index, item.token_id, item.pool)}
                          >
                            Claim
                          </button>
                          :
                          <div className="countdown-wrapper">
                            <Countdown
                              onComplete={() => window.location.reload(false)}
                              date={new Date(parseInt(item.timestamp) * 1000)}
                            />
                            <div className="dayswrapper">
                              <p className="dayss">Day</p>
                              <p className="dayss">Hrs</p>
                              <p className="dayss">Min</p>
                              <p className="dayss">Sec</p>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  )
                }) :
                <div></div>}
              {/* <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main staking">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="claim-btn"
                    className="claim-btn "
                    onClick={handleShows}
                  >
                    Claim
                  </button>
                </div>
              </div>

              <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main staking">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="claim-btn"
                    className="claim-btn "
                    onClick={handleShows}
                  >
                    Claim
                  </button>
                </div>
              </div>

              <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main staking">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="claim-btn"
                    className="claim-btn "
                    onClick={handleShows}
                  >
                    Claim
                  </button>
                </div>
              </div> */}
            </div>
            {/* 
            <div style={{ paddingTop: "30px" }} className="row">
              <div className="col-xl-3">
                <div className="full-bg"></div>
                <div className="card-main staking">
                  <img src={cardgif} alt="" className="card-image" />
                  <div className="card-gif"></div>
                  <div className="details">
                    <div className="details-flexx">
                      <p className="name">Name:</p>
                      <p className="name">Breading Pass</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Id :</p>
                      <p className="name">1836</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Token Standard :</p>
                      <p className="name">ERC-721</p>
                    </div>
                    <div className="details-flexx">
                      <p className="name">Block Chian :</p>
                      <p className="name">ETH</p>
                    </div>
                  </div>

                  <button
                    id="claim-btn"
                    className="claim-btn "
                    onClick={handleShows}
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div> */}
          </div>

          <div className="footer">
            <div className="container">
              <div className="row">
                <div className="col-md-3">
                  <img className="moonrabit" src={logo}></img>
                </div>
                <div className="col-md-5">
                  <div className="link1">
                    <a className="link" href="link">
                      moonrabbits.wtf{" "}
                    </a>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="logos">
                    <img className="medialogo" src={v1}></img>
                    <img className="medialogo" src={v2}></img>
                    <img className="medialogo" src={v3}></img>
                    <img className="medialogo" src={v5}></img>
                    <img className="medialogo" src={v4}></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <img className="fan" src={fan} alt="" /> */}
      </main>
    </>
  );
};

export default Home;
