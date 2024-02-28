// Fonction pour calculer le module en dB de H(p)
function calculateModuleInDB(av, fh, frequencies) {
    var moduleDataDB = [];
    var p;
    for (var i = 0; i < frequencies.length; i++) {
        p = 2 * Math.PI * frequencies[i];
        moduleDataDB.push(20 * Math.log10(Math.abs((2 * Math.PI * av * fh) / (p + 2 * Math.PI * fh))));
    }
    return moduleDataDB;
}

// JavaScript pour mettre � jour le trac�
function updatePlot() {
    // V�rifier si un graphique existe d�j�
    if (window.myChart) {
        // Si oui, le d�truire avant de cr�er un nouveau
        window.myChart.destroy();
    }

    var av = parseFloat(document.getElementById('av').value);
    var fh_mhz = parseFloat(document.getElementById('fh').value); // Fr�quence haute en MHz
    var fh = fh_mhz * 1e6; // Convertir MHz en Hz
    var fmin = parseFloat(document.getElementById('fmin').value); // Utiliser parseFloat pour obtenir un r�el
    var fmax_mhz = parseFloat(document.getElementById('fmax').value); // fmax en MHz
    var fmax = fmax_mhz * 1e6; // Convertir MHz en Hz

    // Calculer les coordonn�es du point de coupure
    var x_intersection = av * fh;
    var y_intersection = 0; // Pour couper l'axe des x, la valeur y est 0

    // Calculer la valeur y de la droite horizontale
    var horizontalLineY = 20 * Math.log10(av);

    // Cr�er les donn�es pour le trac�
    var frequencies = [];
    var currentFrequency = fmin;
    while (currentFrequency <= fmax) {
        frequencies.push(currentFrequency);
        currentFrequency *= 2; // Augmente la fr�quence par pas de 10 pour la visualisation
    }

    var moduleDataDB = calculateModuleInDB(av, fh, frequencies);

    var ctx = document.getElementById('graph').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: frequencies,
            datasets: [{
                label: '|H(p)| (dB) reel',
                data: moduleDataDB,
                borderColor: 'blue',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: 'Frequency (Hz)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Magnitude (dB)'
                    }
                }
            }
        }
    });
}

// Fonction pour r�initialiser les champs
function resetFields() {
    document.getElementById('av').value = '';
    document.getElementById('fh').value = '';
    document.getElementById('fmin').value = '';
    document.getElementById('fmax').value = '';
    document.getElementById('results').innerText = ''; // Remplace innerHTML par innerText pour �viter une erreur si le r�sultat est null

    // V�rifier si un graphique existe d�j�
    if (window.myChart) {
        // Si oui, le d�truire
        window.myChart.destroy();
    }
}

// Attacher un gestionnaire d'�v�nement au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Attacher les gestionnaires d'�v�nements aux boutons
    var plotButton = document.getElementById('plotButton');
    plotButton.addEventListener('click', updatePlot);

    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetFields);
});
