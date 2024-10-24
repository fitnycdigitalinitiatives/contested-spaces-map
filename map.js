$(document).ready(function () {
    const url = "contested-spaces-map.json?_=" + (new Date()).getTime();
    fetch(url)
        .then((response) => response.json())
        .then((geoJSON) => {
            let map = L.map('map').setView([40.7621, -73.9280], 12);;
            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZml0ZGlnaXRhbGluaXRpYXRpdmVzIiwiYSI6ImNqZ3FxaWI0YTBoOXYyenA2ZnVyYWdsenQifQ.ckTVKSAZ8ZWPAefkd7SOaA', {
                id: 'mapbox/light-v10',
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' + 'Imagery © <a href="http://mapbox.com">Mapbox</a>'
            }).addTo(map);
            const geoJSONLayer = L.geoJSON(geoJSON, {
                onEachFeature: onEachFeature
            });
            L.markerClusterGroup.layerSupport({
                maxClusterRadius: 5
            }).addTo(map).checkIn(geoJSONLayer);
            geoJSONLayer.addTo(map);
            map.fitBounds(geoJSONLayer.getBounds());
            $('body').append(`
                <!-- Modal -->
                <div class="modal fade" id="viewerModal" tabindex="-1" aria-labelledby="viewerLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title fs-6" id="viewerLabel"></h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        </div>
                        <div class="modal-footer small">
                        </div>
                        </div>
                    </div>
                </div>
            `
            );
            const viewerModal = document.getElementById('viewerModal');
            if (viewerModal) {
                viewerModal.addEventListener('show.bs.modal', event => {
                    console.log(event.relatedTarget.getAttribute('data-url'));

                    const modalBody = viewerModal.querySelector('.modal-body');
                    $(modalBody).html(`
                        <image src="${event.relatedTarget.getAttribute('data-url')}" class="w-100">
                    `);
                    const modalTitle = viewerModal.querySelector('.modal-title');
                    $(modalTitle).html(`
                        ${event.relatedTarget.getAttribute('data-title')}
                    `);
                    const modalFooter = viewerModal.querySelector('.modal-footer');
                    $(modalFooter).html(`
                        Photo by ${event.relatedTarget.getAttribute('data-photographer')}
                    `);
                });
            }
        });
});

function onEachFeature(feature, layer) {
    let popup_content = '';
    if (feature.properties.site) {
        popup_content += `<h1>${feature.properties.site}</h1>`;
    }
    if (feature.properties.filenames) {
        popup_content += `<div class="row gx-2">`;
        feature.properties.filenames.forEach(filename => {
            popup_content += `<div class="col-3"><button class="w-100 text-dark border-0 bg-transparent p-0" data-bs-toggle="modal" data-bs-target="#viewerModal" data-photographer="${feature.properties.name}" data-title="${feature.properties.site}" data-url="images/${filename}"><image src="images/${filename}" class="popup-image mb-2"></button></div>`;
        });
        popup_content += `</div>`;

    }
    if (feature.properties.name) {
        popup_content += `<p>${feature.properties.name}</p>`;
    }
    if (feature.properties.critical_response) {
        popup_content += `<h2>Critical Response</h2>`;
        popup_content += `<p>${feature.properties.critical_response}</p>`;
    }

    const popup = L.popup({
        maxWidth: 400
    }).setContent(popup_content);
    layer.bindPopup(popup);
}