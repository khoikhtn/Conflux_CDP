"use client";

import React, { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Address, Balance } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth/index";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [inputOne, setInputOne] = useState("");
  const [inputTwo, setInputTwo] = useState("");

  const [repayToken, setRepayToken] = useState("");

  const { data: yourContract } = useScaffoldContract({
    contractName: "YourContract",
  });

  console.log("YourContract", yourContract);

  const { writeContractAsync: requestLoanWriteAsync } = useScaffoldWriteContract("YourContract");

  const { writeContractAsync: repayLoanWriteAsync } = useScaffoldWriteContract("YourContract");

  const handleRequestLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputOne && inputTwo) {
      try {
        await requestLoanWriteAsync({
          functionName: "requestLoan",
          args: [BigInt(inputOne), BigInt(inputTwo)],
        });
      } catch (error) {
        console.error("Error submitting amounts", error);
      }
    } else {
      console.log("No amount submitted");
    }
  };

  const handleRepayLoan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputOne && inputTwo) {
      try {
        await repayLoanWriteAsync({
          functionName: "repayLoan",
          args: [BigInt(repayToken)],
        });
      } catch (error) {
        console.error("Error submitting amounts", error);
      }
    } else {
      console.log("No amount submitted");
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="flex justify-center items-center text-4xl font-bold text-gray-800">Welcome to Conflux CDP</h1>
        </div>

        {/* Sample App on Conflux */}
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="px-5">
            <div className="flex justify-center text-center mb-10">
              <h1 className="text-4xl font-bold text-gray-800">Connected Address:</h1>
            </div>

            <div className="flex justify-center items-center space-x-4 pb-4">
              <Address address={connectedAddress} format="short" size="2xl" />
              <Balance address={connectedAddress} />
            </div>
            <h1 className="text-center text-xl text-blue-600 font-semibold mt-4">Want to borrow our HRS tokens?</h1>
          </div>
        </div>

        <form onSubmit={handleRequestLoan} style={{ display: "flex", flexDirection: "column" }}>
          <div className=" flex flex-col justify-center items-center p-10 gap-10 ">
            <p className=" text-black text-3xl ">Requesting loan</p>
            <span className="text-sm">(5% interest rate, 150% collateralization ratio)</span>
            <div className=" border-[1px] border-gray-400 shadow-inner rounded-xl flex flex-col justify-center items-center p-10 gap-5">
              <div className=" flex-col flex gap-2">
                <label htmlFor="">Tokens to be borrowed</label>
                <form className="max-w-sm mx-auto">
                  <div className="flex">
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="US">STA</option>
                    </select>
                    <input
                      id="states"
                      onChange={e => setInputOne(e.target.value)}
                      placeholder="Type token amount"
                      className="bg-gray-50 border w-[50vw] border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>
              <div className=" flex-col flex gap-2">
                <label htmlFor="">Tokens to be collateralized</label>
                <form className="max-w-sm mx-auto">
                  <div className="flex">
                    <select
                      id="countries"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-blue-500 focus:border-blue-500 block w-[80%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="US">COL</option>
                    </select>
                    <input
                      id="states"
                      onChange={e => setInputTwo(e.target.value)}
                      placeholder="Type token amount"
                      className="bg-gray-50 border w-[50vw] border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>
              <button
                type="submit"
                className=" w-[30%] text-green-400 border-[1px] border-green-400 rounded-lg hover:text-white hover:bg-green-400 p-2"
              >
                Claim Tokens
              </button>
            </div>
          </div>
        </form>

        <form onSubmit={handleRepayLoan} style={{ display: "flex", flexDirection: "column" }}>
          <div className=" flex flex-col justify-center items-center p-10 gap-10 ">
            <p className=" text-black text-3xl ">Repay loan</p>
            <div className=" border-[1px] border-gray-400 shadow-inner rounded-xl flex flex-col justify-center items-center p-10 gap-5">
              <div className=" flex-col flex gap-2">
                <label htmlFor="">Pay back STA tokens here</label>
                <form className="max-w-sm mx-auto">
                  <div className="flex">
                    <input
                      id="states"
                      onChange={e => setRepayToken(e.target.value)}
                      placeholder="Type token amount"
                      className="bg-gray-50 border w-[50vw] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                </form>
              </div>
              <button
                type="submit"
                className=" w-[30%] text-green-400 border-[1px] border-green-400 rounded-lg hover:text-white hover:bg-green-400 p-2"
              >
                Repay tokens
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
