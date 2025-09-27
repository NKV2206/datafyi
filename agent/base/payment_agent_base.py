from abc import ABC, abstractmethod
from typing import List

class AbstractPaymentAgent(ABC):
    def __init__(self, *args, **kwargs):
        """Constructor that accepts any number of arguments and keyword arguments."""
        super().__init__()

    @abstractmethod
    def make_payment(self, dataset_id : str) -> str:
        """x402 payment wrapper that can be wired with custom logic"""

    def make_payments(self, dataset_ids : List[str]) -> List[str]:
        blob_ids = []
        for id in dataset_ids:
           blob_ids.append(self.make_payment(id)) 
        return blob_ids