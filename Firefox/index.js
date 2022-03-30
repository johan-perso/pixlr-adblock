// Dire que le fichier est chargé
console.log("[PixlrAdblock] Extension chargée");

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