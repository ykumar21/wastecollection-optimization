let n, m, lfill, k, trx, trcap, currcap, currt, lastvisit = -1, rdcnt = -1;

function Path() {
	this.destination = 0;
	this.timetaken = 0;
}

function Collsite() 
// Distances from node to landfill, landfill to node and capcity of sites and whether visited or not
{
	this.capacity = 0;
	this.visited = false;
	this.tolfill = 0;
	this.fromlfill = 0;
	this.adj = [];
}

function Round() {
	this.sites = []; // Stores sites visited in a round
	this.tm = 0; // Stores time taken in that round
	this.cap = 0; // Stores the total capacity taken in that round
}

function Truck() {
	this.rds = []; // Stores the indexes of rounds a truck is undertaking
	this.cumtm = 0; // Stores the cumalative time of rounds already allocated to truck
	this.capserve = 0; // Stores the capacity the truck serves over all rounds
}

let rounds = []; // Stores details of rounds
let empty = new Round(); // An empty round variable for pushback
let trucks = []; // Array of trucks
let emptrk = new Truck(); // Distances from node to landfill, landfill to node and capcity of sites
let emptysite = new Collsite();
let sitelist = [];
let custsort = (a, b) =>
// Sorting function for adjacency list of a node, base on the heuristic algo m*x + y
{
	return (k * a.timetaken + sitelist[a.destination].tolfill) - (k * b.timetaken + sitelist[b.destination].tolfill);
};

let rdsort = (a, b) =>
// Descending order of time sort function for rounds
{
	return b.tm - a.tm;
};

let dfs = (node) =>  
// Generic dfs
{
	lastvisit = node; // We need the last visited node as we have to add last->landfill cost at end
	sitelist[node].visited = true; // Marks node as visited
	currcap += sitelist[node].capacity; // Increases capacity of current truck by the capacity of the current node
	for (let i = 0; i < sitelist[node].adj.length; i++) // Iterates over adjacent nodes for current node
	{
		let next = sitelist[node].adj[i].destination; // Candidate next node (taken in sorted order based on heuristic)
		if (sitelist[next].visited !== true && currcap + sitelist[next].capacity <= trcap) // If candidate hasnt been visited and truck doesnt overflow
		{
			currt += sitelist[node].adj[i].timetaken; // Time of current node increased by the edgeweight
			dfs(next); // Go to candidate
			break; // We break as we dont want the dfs function to return to this node and go to other nodes
		}
	}
}
let compute = () => // Compute for current value of k
{
	sitelist[lfill].visited = true;
	for (let i = 1; i <= n; i++) {
		sitelist[i].adj = sitelist[i].adj.sort(custsort); // Sort adjacency lists of all nodes on basis of heuristic
	}
	currt = 0; // Start computing the time taken for the current value of k
	for (let j = 0; j < sitelist[lfill].adj.length; j++) // Iterates over nodes attached to landfill(all nodes are connected)
	{
		let i = sitelist[lfill].adj[j].destination; // Check for the jth node connected to landfill
		if (i !== lfill && sitelist[i].visited === false) // If node hasnt been visited already
		{
			currcap = 0; // Send a new truck
			dfs(i); // Find the route for this truck
			currt += sitelist[i].fromlfill; // Add initial cost of going from landfill to destination node
			if (lastvisit !== -1) // If the cost for last visit node has not not been added
			{
				currt += sitelist[lastvisit].tolfill; // Add the cost from last visit node to landfill
				lastvisit = -1; // Mark that last visit does not need to be added any more
			}
		}
	}
	return currt; // Return the final optimal time for current k
}

let dfs2 = (node) => // Timetaken dfs to fix the optimal k rounds
{
	rounds[rdcnt].sites.push(node); // Add the current node to current round
	lastvisit = node; // Set the last visit node has current for reason mentioned last time
	sitelist[node].visited = true; // Mark current node as visited
	rounds[rdcnt].cap += sitelist[node].capacity; // Add the capacity of current site to the current round
	for (let i = 0; i < sitelist[node].adj.length; i++) // Iterate over adjancet nodes of current node sorted by heuristic
	{
		let next = sitelist[node].adj[i].destination; // Take a candidate next, then next line checks if it has not been visited
		if (sitelist[next].visited !== true && rounds[rdcnt].cap + sitelist[next].capacity <= trcap) // Ensures truck will not overflow when it goes there
		{
			rounds[rdcnt].tm += sitelist[node].adj[i].timetaken; // Add the edge weight to the current round's time
			dfs2(next); // Go to the next node
			break; // Break as we do not want to come back to this node and pick another candidate
		}
	}
}
let build = () => {
	sitelist[lfill].visited = true;
	for (let i = 1; i <= n; i++) {
		sitelist[i].adj = sitelist[i].adj.sort(custsort); // Sorts the nodes according to heuristic for optimal k
	}
	for (let j = 0; j < sitelist[lfill].adj.size(); j++) // Iterates over nodes connected to landfill
	{
		let i = sitelist[lfill].adj[j].destination; // Takes a node adjance to landfill as candidate
		if (i !== lfill && sitelist[i].visited === false) // If the node hasn't already been visited visit it
		{
			rdcnt++; // Starts a new round
			rounds.push(empty); // Initializes empty round to vector 
			lastvisit = -1; // Marks last visit has -1
			rounds[rdcnt].tm += sitelist[i].fromlfill; // Add the time from landfill to destination node to current node's time 
			dfs2(i); // Visit node to start routing
			if (lastvisit !== -1) // If there is a last visit node to landfill path left add to time
			{
				lastvisit = -1; // Mark that there is no last visit to landfill left
				rounds[rdcnt].tm += sitelist[lastvist].tolfill; // Add time to current round's time.
			}
		}
	}
}
let routingfunc = (n, m, lfill, trx, trcap) => {
	// Input nodes(no. of sites), edges, landfill index, no. of trucks and truck capacity
	for (let i = 0; i <= n; i++) // Initialize 
	{
		sitelist.push(new Collsite());
	}
	for (let i = 1; i <= n; i++) // Input capacities of nodes (sites)
	{
		cin >> sitelist[i].capacity;
	}
	for (let i = 0; i < m; i++) // Input edges and edgeweights
	{
		let a, b, t;
		cin >> a >> b >> t;
		let item = new Path();
		item.destination = b;
		item.timetaken = t;
		sitelist[a].adj.push(item); // Add an edge to b with weight t to the adjacency list of a
		if (b === lfill) // If b = landfill then set return cost to landfill if a is last node
		{
			sitelist[a].tolfill = t;
		}
		else if (a === lfill) // If a = landfill then set initial visit from landfill to b cost
		{
			sitelist[b].fromlfill = t;
		}
	}
	k = 0; // Start from k = 0
	let minT = 1000000000;
	let optK = 0; // MinT stores minimum time and optK optimal found K till now
	while (k < 100) // Running k from 0 to 100 for every 0.1
	{
		let val = compute(); // Compute value for current k
		for (let i = 1; i <= n; i++) sitelist[i].visited = false; // Mark all nodes as unvisited again
		if (val < minT) // Update minimum time and optimal k if the current k gives a shorter time
		{
			minT = val;
			optK = k;
		}
		k += 0.1; // Increase k by 0.1
	}
	k = optK; // Set k to optimal K to rebuild solution and store final rounds, we didn't do this everytime earlier to save memory
	for (let i = 1; i <= n; i++) sitelist[i].visited = false;
	build(); // Call build function similar to compute but builds the final round system
	rounds = rounds.sort(rdsort); // Sort rounds in descending order for allocation to trucks (greedy)
	for (let i = 0; i < rounds.size(); i++) // Iterate over all rounds for printing what we have currently
	{
		cout << "Round: " << i + 1 << endl;
		for (let j = 0; j < rounds[i].sites.length; j++) {
			cout << rounds[i].sites[j] << " ";
		}
		cout << endl;
		cout << "Round Time: " << rounds[i].tm << " Round Capacity: " << rounds[i].cap << endl;
	}
	for (let i = 0; i < trx; i++) {
		trx[i].push(emptrk);
	}
	for (let i = 0; i < rounds.length; i++) // Iterate over all rounds to allocate rounds to trucks
	{ // Notice that we want to minimize the time taken by the truck that takes maximum time
		let mn = 1e9, mni = -1; // For every round we destination find truck which currently has minimum allocated time (mni is index of this truck)
		for (let j = 0; j < trx; j++) {
			if (trucks[j].cumtm < mn) // If current truck has less than mn cumalative time then set mn as this and make this minimum time truck
			{
				mni = j;
				mn = trucks[j].cumtm;
			}
		}
		trucks[mni].cumtm += rounds[i].tm; // For the finally chosen truck for this round, add the time of round to its cumalative
		trucks[mni].rds.push(i); // Add the round to the trucks list of rounds.
		trucks[mni].capserve += rounds[i].cap; // Add the round's total capacity collected to the truck's capacity servd
	}
	for (let i = 0; i < trx; i++) // Print truck info
	{
		cout << "Truck no: " << i + 1 << endl;
		for (let j = 0; j < trucks[i].rds.length; j++) {
			cout << "Round no: " << trucks[i].rds[j] + 1; << endl;
			for (let k = 0; k < rounds[trucks[i].rds[j]].sites.length; k++) {
				cout << rounds[trucks[i].rds[j]].sites[k] << " ";
			}
			cout << endl;
		}
		cout << "Total Time: " << trucks[i].cumtm << " Capacity Served: " << trucks[i].capserve << endl;
	}
}