from abc import ABC, abstractmethod
from typing import List, Dict

class AbstractSelectionAgent(ABC):
    def __init__(self, *args, **kwargs):
        """Constructor that accepts any number of arguments and keyword arguments."""
        super().__init__()

    @abstractmethod
    def score_datasets(self, request: str, criteria: str, dataset_list: List[Dict]) -> List[str]:
        """
        Abstract method to score a list of datasets based on the request and criteria.
        The method should return a list of dictionaries with the top maxSelects datasets.
        
        :param request: The user's dataset request (e.g., "Need petal data with fertilizer").
        :param criteria: The search criteria (e.g., "Datasets using phosphate").
        :param maxSelects: The maximum number of datasets to return.
        :param dataset_list: A list of dictionaries containing dataset metadata.
        :return: A list of the top maxSelects datasets
        """
        pass