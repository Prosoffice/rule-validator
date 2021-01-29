#!/bin/bash

curl -H "Content-Type: application/json" -d '{
  "rule": {
    "field": "0",
    "condition": "eq",
    "condition_value": "a"
  },
  "data": "damien-marley"
}' http://localhost:3000/validate-rule


echo ""
echo ""
curl -H "Content-Type: application/json" -d '{
	"rule": {
		"field": "missions",
		"condition": "gte",
		"condition_value": 30
	},
	"data": {
		"name": "James Holden",
		"crew": "Rocinante",
		"age": 34,
		"position": "Captain",
		"missions": 45
	}
}' http://localhost:3000/validate-rule




echo ""
echo ""
curl -H "Content-Type: application/json" -d '{
	"rule": {
		"field": "missions.count",
		"condition": "gte",
		"condition_value": 30
	},
	"data": {
		"name": "James Holden",
		"crew": "Rocinante",
		"age": 34,
		"position": "Captain",
		"missions": {
			"count": 45,
			"successful": 44,
			"failed": 1
		}
	}
}' http://localhost:3000/validate-rule




echo ""
echo ""
curl -H "Content-Type: application/json" -d '{
  "rule": {
    "field": "5",
    "condition": "contains",
    "condition_value": "rocinante"
  },
  "data": ["The Nauvoo", "The Razorback", "The Roci", "Tycho"]
}' http://localhost:3000/validate-rule


# INVALID JSON
echo ""
echo ""
curl -H "Content-Type: application/json" -d '{
  "rule": {
    "field": "missions.count"
    "condition": "gte",
    "condition_value": 30
  },
  "data": {
    "name": "James Holden",
    "crew": "Rocinante",
    "age": 34,
    "position": "Captain",
    "missions": {
      count: 45,
      successful: 44,
      failed: 1
    }
  }
}' http://localhost:3000/validate-rule

echo ""
echo ""
echo ""
echo "All test passed!"
