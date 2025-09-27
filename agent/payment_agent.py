from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from eth_account import Account
from x402.clients.httpx import x402HttpxClient
from dotenv import load_dotenv
import os

from base.payment_agent_base import AbstractPaymentAgent

load_dotenv()

class DatafyiPaymentAgent(AbstractPaymentAgent):
    def __init__(self):
        private_key = os.getenv("PRIVATE_KEY_WALLET")
        if not private_key:
            raise ValueError("Missing PRIVATE_KEY_WALLET in .env")
        self.account = Account.from_key(private_key)
        self.client = x402HttpxClient(account=self.account, base_url="http://localhost:3000")

    def make_payment(self, dataset_id: str) -> str:
        response = self.client.post("/payment", json={"dataset_id": dataset_id})
        return response.json().get("data", "")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Trigger a payment for a dataset")
    parser.add_argument("request", type=str, help="Dataset ID to purchase")
    args = parser.parse_args()

    agent = DatafyiPaymentAgent()
    res = agent.make_payment(args.request)
    print(res)

    example_id = "example_dataset_123"
    example_res = agent.make_payment(example_id)
    print(example_res)
