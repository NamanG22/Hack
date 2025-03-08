const Bank = require('../models/Bank');
const Route = require('../models/Route');

class RoutingService {
    static async buildGraph() {
        const banks = await Bank.find();
        const routes = await Route.find();
        
        const graph = new Map();
        
        banks.forEach(bank => {
            graph.set(bank.bicCode, {
                charge: bank.charge,
                connections: new Map()
            });
        });

        routes.forEach(route => {
            const fromNode = graph.get(route.fromBic);
            if (fromNode) {
                fromNode.connections.set(route.toBic, route.timeTakenMinutes);
            }
        });

        return graph;
    }

    static async findFastestRoute(fromBank, toBank) {
        const graph = await this.buildGraph();
        if (!graph.has(fromBank) || !graph.has(toBank)) {
            throw new Error('Invalid bank codes');
        }
        
        const result = this.dijkstra(graph, fromBank, toBank);
        return {
            route: result.path,
            time: result.totalTime
        };
    }

    static async findCheapestRoute(fromBank, toBank) {
        const graph = await this.buildGraph();
        if (!graph.has(fromBank) || !graph.has(toBank)) {
            throw new Error('Invalid bank codes');
        }

        const result = this.bellmanFord(graph, fromBank, toBank);
        return {
            route: result.path,
            cost: result.totalCost
        };
    }

    static dijkstra(graph, start, end) {
        const distances = new Map();
        const previous = new Map();
        const unvisited = new Set();

        graph.forEach((_, node) => {
            distances.set(node, Infinity);
            unvisited.add(node);
        });
        distances.set(start, 0);

        while (unvisited.size > 0) {
            let current = null;
            let shortestDistance = Infinity;

            // Find the unvisited node with shortest distance
            for (let node of unvisited) {
                if (distances.get(node) < shortestDistance) {
                    shortestDistance = distances.get(node);
                    current = node;
                }
            }

            if (current === null) break;
            if (current === end) break;

            unvisited.delete(current);

            const currentNode = graph.get(current);
            currentNode.connections.forEach((time, neighbor) => {
                if (unvisited.has(neighbor)) {
                    const newDistance = distances.get(current) + time;
                    if (newDistance < distances.get(neighbor)) {
                        distances.set(neighbor, newDistance);
                        previous.set(neighbor, current);
                    }
                }
            });
        }

        // Reconstruct path
        const path = [];
        let current = end;
        while (current) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path: path,
            totalTime: distances.get(end)
        };
    }

    static bellmanFord(graph, start, end) {
        const distances = new Map();
        const previous = new Map();

        // Initialize distances
        graph.forEach((_, node) => {
            distances.set(node, Infinity);
        });
        distances.set(start, 0);

        // Relax edges
        const nodes = Array.from(graph.keys());
        for (let i = 0; i < nodes.length - 1; i++) {
            for (let [node, data] of graph) {
                data.connections.forEach((_, neighbor) => {
                    const cost = graph.get(neighbor).charge;
                    const newCost = distances.get(node) + cost;
                    if (newCost < distances.get(neighbor)) {
                        distances.set(neighbor, newCost);
                        previous.set(neighbor, node);
                    }
                });
            }
        }

        // Reconstruct path
        const path = [];
        let current = end;
        while (current) {
            path.unshift(current);
            current = previous.get(current);
        }

        return {
            path: path,
            totalCost: distances.get(end)
        };
    }
}

module.exports = RoutingService;
