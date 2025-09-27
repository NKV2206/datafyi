from abc import ABC, abstractmethod
from typing import List

class AbstractParseAgent(ABC):
    def __init__(self, *args, **kwargs):
        """Constructor that accepts any number of arguments and keyword arguments."""
        super().__init__()

    @abstractmethod
    def parse_req(self, req: str) -> List[str]:
        """Abstract method to parse a request into a list of tags (keywords)."""
        pass