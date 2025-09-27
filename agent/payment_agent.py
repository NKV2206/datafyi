from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from eth_account import Account
from x402.clients.httpx import x402HttpxClient
from dotenv import load_dotenv
from typing import List
import os

load_dotenv()

class PaymentAgent:
    def __init__(self, model : str = os.getenv("LANGCHAIN_MODEL"), api_key : str = os.getenv("MODEL_API_KEY")):
        pass
        # self.llm = None
        # if (model == "llama3-70b-8192"):
        #     assert False, "llama3-70b-8192 has been discontinued"
        #     # self.llm = ChatGroq(model=model, api_key=api_key)
        # elif (model == "meta-llama/llama-4-scout-17b-16e-instruct"):
        #     self.llm = ChatGroq(model=model, api_key=api_key)

        # self.parse_req_template = ChatPromptTemplate.from_messages([
        # ("system", """You are given a natural language request describing a dataset.
        # Your job is to extract only the **core dataset keywords** as a comma-separated list with no spaces.

        # Rules:
        # - Keep only nouns, proper nouns, or compound noun phrases (e.g., "Electric Vehicles", "Social Media") but omit "data" or "dataset" component in a compound phrase if it includes "data" or "dataset".
        # - Drop adjectives, adverbs, urgency markers, and descriptive modifiers (e.g., "harsh", "urgent", "big").
        # - Keep geographic entities, organizations, domains, or fields of study if mentioned (e.g., "India", "Twitter", "Weather").
        # - Return only the keywords, in a single comma-separated line.
        # - Do not return explanations, extra words, or formatting beyond the list.

        # Example:
        # Request: "I need data about Electric Vehicles operating in India under harsh weather conditions. HELP URGENT"
        # Answer: Electric Vehicles,India,Weather
        # """),
        #     ("human", "Request: {request}")
        # ])

        # self.req_to_list = self.parse_req_template | self.llm
    
    def make_payment(self, request : str):
        account = Account.from_key(os.getenv("PRIVATE_KEY_WALLET"))
        client = x402HttpxClient(account=account, base_url="https://localhost:3000")
        response = client.post("/payment", json={"request": request})
        return response.json()




    


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Parse dataset request into keywords")
    parser.add_argument("request", type=str, help="The request describing the dataset")
    args = parser.parse_args()

    print("Starting PaymentAgent demo")
    agent = PaymentAgent()
    res = agent.make_payment(args.request)
    print(res)