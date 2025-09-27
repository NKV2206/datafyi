from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from eth_account import Account
from x402.clients.httpx import x402HttpxClient
from web3 import Web3
from dotenv import load_dotenv
import os
import asyncio
import httpx

from base.payment_agent_base import AbstractPaymentAgent

load_dotenv()

class DatafyiPaymentAgent(AbstractPaymentAgent):
    def __init__(self):
        print("Reaches here 1")
        private_key = os.getenv("PRIVATE_KEY_WALLET")
        if not private_key:
            raise ValueError("Missing PRIVATE_KEY_WALLET in .env")
        w3 = Web3(Web3.HTTPProvider('https://rpc-amoy.polygon.technology'))
        self.account = Account.from_key(private_key)
        
        # Create client with longer timeout
        self.client = x402HttpxClient(
            account=self.account, 
            base_url="http://localhost:4021",
            timeout=30.0  # 30 second timeout
        )

    async def make_payment_async(self, dataset_id: str) -> str:
        print(f"Making payment for dataset_id: {dataset_id}")
        try:
            # Use GET request to the correct endpoint
            response = await self.client.get(f"/payment/{dataset_id}")
            resp = await response.aread()
            print(f"Response: {resp}")
            print(f"Response status: {response}")
            print(f"Response content: {response.text}")
            
            if response.status_code == 200:
                data = response.json()
                return data.get("blobId", "")
            else:
                print(f"Error: HTTP {response.status_code}")
                return ""
                
        except httpx.ReadTimeout:
            print("Request timed out - server might be slow")
            return ""
        except httpx.ConnectError:
            print("Connection error - server might not be running")
            return ""
        except Exception as e:
            print(f"Unexpected error: {e}")
            return ""

    def make_payment(self, dataset_id: str) -> str:
        print("Reaches here")
        # Run the async function in an event loop
        return asyncio.run(self.make_payment_async(dataset_id))

if __name__ == "__main__":
    print("Entering main")
    agent = DatafyiPaymentAgent()
    
    example_id = "2"
    example_res = agent.make_payment(example_id)
    print(f"Final result: {example_res}")
