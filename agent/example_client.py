from parse_agent import * 
from selection_agent import *
from payment_agent import *
from base.datafyi_pipeline import DatafyiClient

if __name__=="__main__":
    parseAgent = DatafyiParseAgent()
    selectAgent = DatafyiSelectionAgent()
    payAgent = DatafyiPaymentAgent()

    client = DatafyiClient(parseAgent, selectAgent, payAgent)
    client.make_request("My brother in christ, I need a dataset on AMD 's performance in the CPU market over the past 5 years", "Financial data is recommended")
