from parse_agent_base import *
from selection_agent_base import *
from payment_agent_base import *
from typing import List
import requests

class DatafyiClient():
    def __init__(self, parse_agent : AbstractParseAgent, selection_agent : AbstractSelectionAgent, payment_agent : AbstractPaymentAgent):
        self.parse_agent = parse_agent
        self.selection_agent = selection_agent
        self.payment_agent = payment_agent

    def make_request(self, req: str, crit: str) -> List[str]:
        tags = self.parse_agent.parse_req(req)
        tags_str = ",".join(tags)

        try:
            response = requests.get(
                "http://localhost:3000/api/agent",
                params={"tags": tags_str},
                timeout=10
            )
            response.raise_for_status()
            content_listings = list(response.json())

            dataset_ids = self.selection_agent.score_datasets(req, crit, content_listings)
            blob_ids = self.payment_agent.make_payments(dataset_ids)

            return blob_ids

        except requests.RequestException as e:
            print(f"Request error: {e}")
            return []

