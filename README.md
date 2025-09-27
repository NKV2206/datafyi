# Datafyi - Web3 Dataset Marketplace

Datafyi is a decentralized marketplace designed for datasets, leveraging Web3 technologies. The platform allows users to upload datasets with associated metadata, which are then made available for agents to search, select, and purchase based on various criteria. The marketplace features AI agents that help match datasets with user requests, making it easier for users to find relevant data and facilitating secure transactions through Web3.

## Vision

The vision for Datafyi is to create an open, decentralized ecosystem where data is easily discoverable, securely shared, and fairly monetized. By integrating Web3 principles like decentralization, blockchain-based payments, and access control, we aim to eliminate barriers in the traditional data marketplace. Users will be empowered to monetize their datasets, while agents will be able to access and purchase data securely and efficiently.

## Getting Started

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/your-username/datafyi.git
cd datafyi
````

### 2. Install Dependencies

#### Frontend (Next.js)

The frontend is built with Next.js, and you'll need to install the required dependencies:

```bash
npm install
```

#### Backend (Python)

Make sure to have Python installed on your machine (preferably version 3.8+). Install the required Python dependencies by navigating to the backend folder and using `pip` to install the packages listed in `requirements.txt`.

```bash
cd agent
pip install -r requirements.txt
```

### 3. Running the Development Servers

#### Step 1: Start the Python Flask Server

Before running the Next.js app, the Python Flask server needs to be started. This server handles dataset processing and AI agent functionality:

```bash
py agent/datafyi_agent_server.py
```

#### Step 2: Start the Next.js Development Server

After the Flask server is running, start the Next.js development server for the frontend:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Open the Application

Once both servers are running, open your browser and go to [http://localhost:3000](http://localhost:3000) to see the web app in action.

The page will auto-update as you make edits to `app/page.tsx`.

## SDK Integration

The Datafyi platform uses an SDK that wires together three core agents: `ParseAgent`, `SelectionAgent`, and `PaymentAgent`. These agents allow users to interact with the platform's dataset listings, process requests, and make payments.

Here is a breakdown of how you can use the SDK:

### DatafyiClient Class

The `DatafyiClient` is the main interface for interacting with the agents. It takes three agents—`ParseAgent`, `SelectionAgent`, and `PaymentAgent`—and handles the workflow for dataset parsing, selection, and payment.

```python
from parse_agent_base import *
from selection_agent_base import *
from payment_agent_base import *
from typing import List
import requests

class DatafyiClient():
    def __init__(self, parse_agent: AbstractParseAgent, selection_agent: AbstractSelectionAgent, payment_agent: AbstractPaymentAgent):
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
```

### Agent Classes

Here are the abstract agent classes that form the core of the SDK. You need to implement their methods to define how each agent should behave.

#### `AbstractParseAgent`

This agent is responsible for parsing the user's request into a list of tags (keywords).

```python
from abc import ABC, abstractmethod
from typing import List

class AbstractParseAgent(ABC):
    def __init__(self, *args, **kwargs):
        super().__init__()

    @abstractmethod
    def parse_req(self, req: str) -> List[str]:
        pass
```

#### `AbstractSelectionAgent`

This agent selects the most relevant datasets based on the request and search criteria.

```python
from abc import ABC, abstractmethod
from typing import List, Dict

class AbstractSelectionAgent(ABC):
    def __init__(self, *args, **kwargs):
        super().__init__()

    @abstractmethod
    def score_datasets(self, request: str, criteria: str, dataset_list: List[Dict]) -> List[str]:
        pass
```

#### `AbstractPaymentAgent`

This agent handles making payments for selected datasets. It can integrate with payment systems like x402.

```python
from abc import ABC, abstractmethod
from typing import List

class AbstractPaymentAgent(ABC):
    def __init__(self, *args, **kwargs):
        super().__init__()

    @abstractmethod
    def make_payment(self, dataset_id: str) -> str:
        pass

    def make_payments(self, dataset_ids: List[str]) -> List[str]:
        blob_ids = []
        for id in dataset_ids:
            blob_ids.append(self.make_payment(id))
        return blob_ids
```

### How to Use the SDK

1. Implement the methods for each of the agent classes (i.e., `parse_req`, `score_datasets`, and `make_payment`) based on your business logic.
2. Instantiate the `DatafyiClient` with your custom agents.
3. Use the `make_request` method to handle a dataset request. The client will automatically parse the request, select relevant datasets, and make the payments.

Example usage:

```python
# Example of using the DatafyiClient

# Instantiate the agents with your custom implementations
parse_agent = YourParseAgent()
selection_agent = YourSelectionAgent()
payment_agent = YourPaymentAgent()

# Create the Datafyi client
client = DatafyiClient(parse_agent, selection_agent, payment_agent)

# Make a request
req = "Looking for petal data with phosphate"
criteria = "Datasets using phosphate"
blob_ids = client.make_request(req, criteria)

print(f"Blob IDs: {blob_ids}")
```

## Folder Structure

```
/datafyi
│
├── /agent
│   ├── datafyi_agent_server.py
│   └── requirements.txt
│
├── /app
│   ├── page.tsx
│   └── ...
│
├── /public
│   └── walrus.jpg
└── /node_modules
```

## Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial.
* [Python Documentation](https://docs.python.org/3/) - Official Python documentation.

## Troubleshooting

If you encounter any issues, please make sure:

1. You have the correct versions of Node.js and Python installed.
2. All required services (e.g., Flask server, Web3 nodes) are running.
3. Python dependencies are correctly installed by running `pip install -r requirements.txt`.

For more help, refer to the [Next.js documentation](https://nextjs.org/docs) or the [Python documentation](https://docs.python.org).

```

### Key Updates:
- **SDK Integration**: Detailed the `DatafyiClient` class and how to use the three agents (`ParseAgent`, `SelectionAgent`, `PaymentAgent`) to interact with the platform.
- **Product Vision**: Expanded the description of Datafyi’s vision.
- **Usage Instructions**: Provided step-by-step instructions for implementing the SDK and using it with custom agents.

Let me know if you need any more changes or clarifications!
```
