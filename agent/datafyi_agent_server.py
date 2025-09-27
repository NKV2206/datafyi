from flask import Flask, request, jsonify
from flask_cors import CORS   # <-- add this
from selection_agent import DatafyiSelectionAgent, dataset_filter
from parse_agent import DatafyiParseAgent, get_tags

app = Flask(__name__)
CORS(app)  # <-- enable CORS for all routes

# Initialize agents once at startup
selection_agent = DatafyiSelectionAgent(maxSelects=6)
parse_agent = DatafyiParseAgent()

@app.route("/parse", methods=["POST"])
def parse_request():
    """
    Expects JSON:
    {
      "request": "natural language request string"
    }
    """
    try:
        data = request.get_json(force=True)
        req_text = data.get("request")
        if not req_text:
            return jsonify({"error": "Missing 'request'"}), 400

        tags = get_tags(parse_agent, req_text)
        return jsonify({"tags": tags})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/select", methods=["POST"])
def select_datasets():
    """
    Expects JSON:
    {
      "request": "user request",
      "criteria": "search criteria",
      "datasets": [
        {"id": "...", "tags": "...", "description": "..."},
        ...
      ]
    }
    """
    try:
        data = request.get_json(force=True)
        req_text = data.get("request")
        criteria = data.get("criteria", "")
        dataset_list = data.get("datasets", [])

        if not req_text or not dataset_list:
            return jsonify({"error": "Missing 'request' or 'datasets'"}), 400

        top_ids = dataset_filter(selection_agent, req_text, criteria, dataset_list)
        return jsonify({"selected": top_ids})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=True)
