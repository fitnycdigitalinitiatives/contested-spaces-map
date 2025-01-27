{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [{{ cells["coordinates"].value }}]
    },
    "properties": {
        "email": {{ jsonize(cells["Email Address"].value) }},
        "name": {{ jsonize(cells["Name and Affiliation"].value) }},
        "site": {{ jsonize(cells["Site"].value) }},
        "critical_response": {{ jsonize(cells["Critical Response"].value) }},
        "filenames": {{ jsonize(cells["filenames"].value.split("|")) }},
        "references": {{ jsonize(cells["References"].value.split("|")) }}
    }
}