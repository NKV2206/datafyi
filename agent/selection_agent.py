from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate

from dotenv import load_dotenv
import os

from base.selection_agent_base import *

from typing import List

load_dotenv()

class DatafyiSelectionAgent(AbstractSelectionAgent):
    def __init__(self, maxSelects = 3, model: str = os.getenv("LANGCHAIN_MODEL"), api_key: str = os.getenv("MODEL_API_KEY")):
        super().__init__()
        self.llm = None
        self.maxSelects = maxSelects
        if (model == "llama3-70b-8192"):
            assert False, "llama3-70b-8192 has been discontinued"
            # self.llm = ChatGroq(model=model, api_key=api_key)
        elif (model == "meta-llama/llama-4-scout-17b-16e-instruct"):
            self.llm = ChatGroq(model=model, api_key=api_key)

        self.search_req_template = ChatPromptTemplate.from_messages([
            ("system", """Request: {request}, Search Criteria: {criteria}
            You will be given a list of datasets. Each dataset will contain the following information:
            - Tags: A comma-separated list indicating the categories of the dataset.
            - Description: A textual description of what the dataset contains.
            - Dataset ID: (Not relevant to grading)

            Your task is to evaluate each dataset's positive relevance to the request and search criteria. 
            Assign a score out of 100, where:
            - 0 <= SCORE <= 100
            - The score should be a float with up to 2 decimal places.
            
            STRICT OUTPUT FORMAT: 
            - Only return the scores of each dataset, in the same order.
            - The scores must be separated by commas with NO spaces between them. 
            - DO NOT include any additional text, explanation, or anything other than the scores. 
            - Example: "92.5,85.0,45.3"
            """),
            ("human", "Datasets: {dataset_list}")
        ])

        self.select_filter = self.search_req_template | self.llm

    def score_datasets(self, request, criteria, dataset_list):
        """
        This function scores a list of datasets based on the request and criteria.
        It returns a list of the top maxSelects dataset IDs with their corresponding scores.
        """
        print("Received select and filter request for these dataset listings...")
        try:
            response = self.select_filter.invoke({
                "request" : request,
                "criteria": criteria,
                "dataset_list" : dataset_list
            })
            allScores = response.content.split(",")            
            allScores = [float(score.strip()) for score in allScores]

            scored_datasets = [
                {"dataset_id": dataset_list[i]["id"], "score": allScores[i]}
                for i in range(len(allScores))
            ]

            scored_datasets.sort(key=lambda x: x["score"], reverse=True)
            top_datasets_ids = [dataset["dataset_id"] for dataset in scored_datasets[:self.maxSelects]]

            return top_datasets_ids

        except Exception as e:
            raise Exception(f"Error scoring and selecting datasets: {str(e)}") from e

def dataset_filter(selectAgent, request, criteria, dataset_list):
    return selectAgent.score_datasets(request, criteria, dataset_list)

if __name__ == "__main__":
    print("Starting SelectionAgent demo...")
    agent = DatafyiSelectionAgent(maxSelects=2)
    
    req = "I'm in dire need of petal data that has fertilizer as a variable. PLS HElp man"
    crit = "Datasets using phosphate would be best"
    
    dataset_list = [
        {
            "id": "PetalFertilizer_001",
            "tags": "Petal, Fertilizer, Magnesium, Agriculture",
            "description": "This dataset contains petal growth data from plants with magnesium-based fertilizers as a variable, collected from agricultural fields."
        },
        {
            "id": "TreeFertilizer_002",
            "tags": "Tree, Fertilizer, Organic, Agriculture",
            "description": "A dataset focusing on tree growth with organic fertilizers. Using phosphate-based testing, it explores different fertilizers in agriculture."
        },
        {
            "id": "RandomData_003",
            "tags": "Weather, Traffic, India",
            "description": "This dataset contains weather and traffic data collected from various cities in India, with no relation to fertilizers or petal growth."
        }
    ]
    
    res = dataset_filter(agent, req, crit, dataset_list)
    print(res)
