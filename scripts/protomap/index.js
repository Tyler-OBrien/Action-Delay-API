
class MyPlaceSymbolizer {
	place(layout, geom, feature) {
		let pt = geom[0][0]
		let name = feature.props.name

		var font = "12px sans-serif"
		if (feature.props.place == "suburb") font = "500 14px sans-serif"
		if (feature.props.place == "city") font = "800 16px sans-serif"

		layout.scratch.font = font
		let metrics = layout.scratch.measureText(name)
		let width = metrics.width
		let ascent = metrics.actualBoundingBoxAscent
		let descent = metrics.actualBoundingBoxDescent
		let bbox = { minX: pt.x - width / 2, minY: pt.y - ascent, maxX: pt.x + width / 2, maxY: pt.y + descent }

		let draw = ctx => {
			ctx.font = font
			ctx.fillStyle = "darkslategray"
			ctx.fillText(name, -width / 2, 0)
		}
		return [{ anchor: pt, bboxes: [bbox], draw: draw }]
	}
}




async function main() {
	const map = L.map('map');
	let markers = new Map();
	let labels = new Map();

	let PAINT_RULES = [
		{
			dataLayer: "water",
			symbolizer: new protomapsL.PolygonSymbolizer({ fill: "steelblue" })
		}
	];

	let LABEL_RULES = [
		{
			dataLayer: "places",
			symbolizer: new MyPlaceSymbolizer()
		}
	]

	var layer = protomapsL.leafletLayer({
		url: 'https://map.cloudflare.chaika.me/map.pmtiles',
		theme: "dark",
		labels: true,
		boundaries: true,
		maxBounds: [[-90, -180], [90, 180]],
		minZoom: 2,
		paintRules: PAINT_RULES,
		labelRules: LABEL_RULES
	});
	layer.addTo(map);

	var tryFetchMetals = fetch("https://metal.cloudflare.chaika.me/colos");
	var tryFetchColos = fetch("https://delay.cloudflare.chaika.me/v2/colos");

	var [fetchMetals, fetchColos] = await Promise.all([tryFetchMetals, tryFetchColos]);
	var [getMetals, getColos] = await Promise.all([fetchMetals.json(), fetchColos.json()]);

	let servers = [];
	for (const colo of getColos.results) {
		var tryGetMetalInfo = getMetals.find(metalColo => metalColo.coloId == colo.ID);

		var tryGetExistingServerInfo = servers.find(server => server.IATA == colo.IATA);
		if (!tryGetExistingServerInfo) {
			tryGetExistingServerInfo = {
				IATA: colo.IATA,
				niceName: colo.niceName,
				country: colo.country,
				lat: colo.lat,
				long: colo.long,
				cfRegionDO: colo.cfRegionDO,
				cfRegionR2: colo.cfRegionR2,
				activeMachinesCount: 0
			}
			servers.push(tryGetExistingServerInfo)
		}
		if (tryGetMetalInfo) {
			tryGetExistingServerInfo.activeMachinesCount += tryGetMetalInfo.activeMachinesCount;
			tryGetExistingServerInfo.latestUpdate = tryGetExistingServerInfo.latestUpdate
				? new Date(Math.max(new Date(tryGetExistingServerInfo.latestUpdate), new Date(tryGetMetalInfo.latestUpdate)))
				: tryGetMetalInfo.latestUpdate;
		}
	}

	function updateInfoPanel(server) {
		document.getElementById('server-info').innerHTML = `
			                    <div class="info-title">${server.niceName}</div>
			                    <div class="info-item">
			                        <span class="info-label">IATA:</span> ${server.IATA}
			                    </div>
			                    <div class="info-item">
			                        <span class="info-label">Durable Object Region:</span> ${server.cfRegionR2}
			                    </div>
			                    <div class="info-item">
			                        <span class="info-label">Active Machines:</span> ${server.activeMachinesCount}
			                    </div>
			                    ${server.latestUpdate ? `
			                    <div class="info-item">
			                        <span class="info-label">Last Update:</span> ${new Date(server.latestUpdate).toLocaleString()}
			                    </div>
			                    ` : ''}
			                `;
		if (server.IATA == "{{PLSINJECTUSRCOLOCLOUDFLAREOK}}") {
			document.getElementById('server-info').innerHTML += `
			                        <div class="info-item">
			                            <span class="info-label">You are currently connected to this PoP.</span>
			                        </div>`;
		}
	}

	function addServerToMap(server) {
		const marker = L.marker([server.lat, server.long], {
			icon: L.divIcon({
				className: 'custom-marker',
				html: `<div style="background-color: ${server.activeMachinesCount >= 1000 ? '#ff4477' : '#4477ff'};
			                              width: ${server.activeMachinesCount >= 1000 ? '14' : '10'}px;
			                              height: ${server.activeMachinesCount >= 1000 ? '14' : '10'}px;
			                              border-radius: 50%;
			                              border: 2px solid white;"></div>`
			})
		})
			.bindPopup(server.niceName)
			.addTo(map);

		const label = L.marker([server.lat, server.long], {
			icon: L.divIcon({
				className: `marker-label ${server.activeMachinesCount >= 1000 ? 'marker-label-large' : ''}`,
				html: server.IATA,
				iconSize: [40, 20],
				iconAnchor: [20, -10]
			})
		});

		if (map.getZoom() < 4 && server.activeMachinesCount < 1000) {
			label.remove();
		} else if (map.getZoom() >= 4) {
			label.addTo(map);
		}

		markers.set(server.IATA, marker);
		labels.set(server.IATA, label);

		map.on('zoomend', function () {
			if (map.getZoom() < 4 && server.activeMachinesCount < 1000) {
				label.remove();
			} else if (map.getZoom() >= 4) {
				label.addTo(map);
			}
		});

		marker.on('click', () => {
			updateInfoPanel(server);
			map.setView([server.lat, server.long], 6);
		});
	}

	function updateVisibility() {
		const minMachines = parseInt(document.getElementById('machineFilter').value) || 0;

		servers.forEach(server => {
			const marker = markers.get(server.IATA);
			const label = labels.get(server.IATA);

			if (server.activeMachinesCount >= minMachines) {
				marker.addTo(map);
				if (map.getZoom() >= 4 || server.activeMachinesCount >= 1000) {
					label.addTo(map);
				}
			} else {
				marker.remove();
				label.remove();
			}
		});
	}

	function setupSearch() {
		const searchBox = document.getElementById('searchBox');
		const resultsDiv = document.getElementById('searchResults');

		searchBox.addEventListener('input', (e) => {
			const query = e.target.value.toLowerCase();
			if (!query) {
				resultsDiv.innerHTML = '';
				return;
			}

			const matches = servers.filter(server =>
				server.IATA.toLowerCase().includes(query) ||
				server.niceName.toLowerCase().includes(query)
			);

			resultsDiv.innerHTML = matches.slice(0, 5).map(server => `
			                        <div class="search-result-item" onclick="window.focusServer('${server.IATA}')">
			                            ${server.IATA} - ${server.niceName} (${server.activeMachinesCount} machines)
			                        </div>
			                    `).join('');
		});
	}

	window.focusServer = (IATA) => {
		const server = servers.find(s => s.IATA === IATA);
		if (server) {
			map.setView([server.lat, server.long], 6);
			updateInfoPanel(server);
		}
	};

	let userCoordLat = {{ PLSINJECTUSRLAT }
}, userCoordLong = {{ PLSINJECTUSRLONG }};
if (userCoordLat != 0) {
	map.setView([userCoordLat, userCoordLong], 6);
	L.marker([userCoordLat, userCoordLong], {
		icon: L.divIcon({
			className: 'custom-marker',
			html: '<div style="background-color: #ff4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>'
		})
	})
		.bindPopup('Your GeoIP Location')
		.addTo(map);
}

servers.forEach(addServerToMap);

map.on('zoomend', updateVisibility);
document.getElementById('machineFilter').addEventListener('input', updateVisibility);

setupSearch();

var tryGetUserColo = servers.find(colo => colo.IATA == "{{PLSINJECTUSRCOLOCLOUDFLAREOK}}");
if (tryGetUserColo) {
	updateInfoPanel(tryGetUserColo);
}

// Update stats
let totalMachines = servers.reduce((sum, server) => sum + server.activeMachinesCount, 0);
let lastUpdate = servers.reduce((latest, server) => {
	if (!server.latestUpdate) return latest;
	return !latest || new Date(server.latestUpdate) > new Date(latest) ? server.latestUpdate : latest;
}, null);

document.getElementById('totalColos').textContent = getColos.results.length;
document.getElementById('totalPoPs').textContent = servers.length;
document.getElementById('totalMachines').textContent = totalMachines.toLocaleString();
document.getElementById('lastUpdated').textContent = lastUpdate ? new Date(lastUpdate).toLocaleString() : '-';
			        }
main()