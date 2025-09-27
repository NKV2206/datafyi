from parse_agent_base import *
from selection_agent_base import *
from payment_agent_base import *
from typing import List

class DatafyiClient():
    def __init__(self, parse_agent : AbstractParseAgent, selection_agent : AbstractSelectionAgent, payment_agent : AbstractPaymentAgent):
        self.parse_agent = parse_agent
        self.selection_agent = selection_agent
        self.payment_agent = payment_agent

    def make_request(self, req : str, crit : str, maxDatasets : int) -> List[str]:
        tags = self.parse_agent.parse_req(req)
        # Post these tags to backend API 1
        content_listings = [{}]
        dataset_ids = self.selection_agent.score_datasets(req, crit, maxDatasets, content_listings)
        blob_ids = self.payment_agent.make_payments(dataset_ids) # Has the 2nd backend API call

