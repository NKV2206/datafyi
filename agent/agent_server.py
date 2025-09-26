from flask import Flask, request, jsonify
from search_agent import *
from selection_agent import *

load_dotenv()

app = Flask(__name__)

selection_agent = SelectionAgent()
parse_agent = ParseAgent()


@app.route("/filter_datasets", methods=["POST"])
def filter_datasets():
    data = request.get_json()
    try:
        req = data["request"]
        criteria = data.get("criteria", "")
        max_selects = int(data.get("maxSelects", 3))
        dataset_list = data["dataset_list"]

        result = selection_agent.score_datasets(req, criteria, max_selects, dataset_list)
        return jsonify({"success": True, "results": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/parse_request", methods=["POST"])
def parse_request():
    data = request.get_json()
    try:
        req = data["request"]
        tags = parse_agent.parse_req(req)
        return jsonify({"success": True, "tags": tags})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True, port=5000)