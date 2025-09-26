from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate

from dotenv import load_dotenv
from typing import List
import os

load_dotenv()

class ParseAgent:
    def __init__(self, model : str = os.getenv("LANGCHAIN_MODEL"), api_key : str = os.getenv("MODEL_API_KEY")):
        self.llm = None
        if (model == "llama3-70b-8192"):
            assert False, "llama3-70b-8192 has been discontinued"
            # self.llm = ChatGroq(model=model, api_key=api_key)
        elif (model == "meta-llama/llama-4-scout-17b-16e-instruct"):
            self.llm = ChatGroq(model=model, api_key=api_key)

        self.parse_req_template = ChatPromptTemplate.from_messages([
        ("system", """You are given a natural language request describing a dataset.
        Your job is to extract only the **core dataset keywords** as a comma-separated list with no spaces.

        Rules:
        - Keep only nouns, proper nouns, or compound noun phrases (e.g., "Electric Vehicles", "Social Media") but omit "data" or "dataset" component in a compound phrase if it includes "data" or "dataset".
        - Drop adjectives, adverbs, urgency markers, and descriptive modifiers (e.g., "harsh", "urgent", "big").
        - Keep geographic entities, organizations, domains, or fields of study if mentioned (e.g., "India", "Twitter", "Weather").
        - Return only the keywords, in a single comma-separated line.
        - Do not return explanations, extra words, or formatting beyond the list.

        Example:
        Request: "I need data about Electric Vehicles operating in India under harsh weather conditions. HELP URGENT"
        Answer: Electric Vehicles,India,Weather
        """),
            ("human", "Request: {request}")
        ])

        self.req_to_list = self.parse_req_template | self.llm

    def parse_req(self, req : str) -> List[str]:
        """Return collection of keyword tags present in the request body in the form of a list"""
        print("Received parse request for this agent...")
        try:
            response = self.req_to_list.invoke({
                "request" : req
            })
            tagCollection = response.content.split(",")
            return tagCollection
        except Exception as e:
            raise Exception(f"Error identifying tags: {str(e)}") from e

class SelectionAgent:
    def __init__(self, model : str = os.getenv("LANGCHAIN_MODEL"), api_key : str = os.getenv("MODEL_API_KEY")):
        self.llm = None
        if (model == "llama3-70b-8192"):
            assert False, "llama3-70b-8192 has been discontinued"
            # self.llm = ChatGroq(model=model, api_key=api_key)
        elif (model == "meta-llama/llama-4-scout-17b-16e-instruct"):
            self.llm = ChatGroq(model=model, api_key=api_key)

        self.search_req_template = ChatPromptTemplate.from_messages([
            ("system", """
             """),
            ("human", "Request : {request}")
        ])

        self.req_to_list = self.search_req_template | self.llm

def get_tags(parse_agent : ParseAgent, req : str)-> List[str]:
    return parse_agent.parse_req(req)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Parse dataset request into keywords")
    parser.add_argument("request", type=str, help="The request describing the dataset")
    args = parser.parse_args()

    print("Starting ParseAgent demo")
    agent = ParseAgent()
    res = get_tags(agent, args.request)
    print(res)