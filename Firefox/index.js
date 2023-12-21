// Dire que le fichier est chargé
console.log("[PixlrAdblock] Extension chargée : index.js");

// Détecter les nouveaux élements sur la page
var observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		var addedNodes = mutation.addedNodes;
		addedNodes.forEach(node => {
			// Si l'élement a l'identifiant "pop" et a un enfant avec l'identifiant "pop-ad", le supprimer
			if(node.id == 'pop' && Array.from(node.childNodes).find(n => n.id == 'pop-ad')){
				console.log("[PixlrAdblock] 'pop-ad' bloqué");
				node.parentElement.remove() || node.remove();
			}

			// Si c'est une popup d'annonce (classes: announce news-dialog ani)
			if(node.classList && node.classList.contains('announce') && node.classList.contains('news-dialog') && node.classList.contains('ani')){
				console.log("[PixlrAdblock] 'announce news-dialog ani' bloqué");
				node.parentElement.remove() || node.remove();
			}

			// Si c'est le canvas de prévisualisation (quand on CTRL+S)
			if(node.nodeName == 'CANVAS'){
				var canvas = document.querySelector("#save-preview > canvas")
				if(canvas !== node) return; // si ce n'est pas le bon canvas, on arrête
				var base64Img = canvas.toDataURL(1.0)
				if(!base64Img) return; // si on a pas pu exporter l'image, on arrête
				var img = document.createElement('img')
				img.src = base64Img
				img.width = canvas.width
				img.height = canvas.height
				img.style="max-width: 100%; max-height: 350px; margin: 0 auto; display: block; border: 1px solid #333; background-size: 20px 20px; background-position: 50% 50%; background-image: var(--square-bg);"
				document.querySelectorAll("#save-preview > img").forEach(img => img.remove())
				canvas.outerHTML = img.outerHTML
			}

			// Si l'élement a l'identifiant right-space
			if(node.id == 'right-space'){
				// Obtenir le workspace
				var workspace = document.getElementById('workspace')

				// Supprimer l'espace à droite
				node.remove();

				// Enlever l'espace à droite du workspace
				var oldRight = parseInt(workspace.style.right.replace('px', ''));
				workspace.style.right = '0px';

				// Obtenir le "raster"
				var raster = document.querySelector('.raster');
				raster.style.width = `${oldRight + parseInt(raster.style.width.replace('px',''))}px`
				raster.setAttribute('width', `${oldRight + parseInt(raster.style.width.replace('px',''))}px`)
			}
		})
	});
});
observer.observe(document.body, { childList: true, subtree: true });
